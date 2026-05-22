/**
 * /api/binance/webhook.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Vercel Serverless Function — Binance Pay Webhook (IPN)
 *
 * Binance calls this endpoint when a payment is completed.
 * Security: verify the HMAC-SHA512 signature from Binance
 * before updating Firebase.
 *
 * Docs: https://developers.binance.com/docs/binance-pay/webhook
 *
 * Environment variables required (Vercel Dashboard):
 *   BINANCE_PAY_API_KEY     — Merchant API Key
 *   BINANCE_PAY_API_SECRET  — Merchant API Secret
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 *   TELEGRAM_BOT_TOKEN      — (optional)
 *   TELEGRAM_ADMIN_CHAT_ID  — (optional)
 */

import crypto from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// ── Firebase Admin singleton ─────────────────────────────────────────
function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

/**
 * Verify Binance Pay webhook signature.
 * Header: BinancePay-Signature
 * Format: HMAC-SHA512( TIMESTAMP + "\n" + NONCE + "\n" + BODY + "\n", SECRET )
 */
function verifyBinanceSignature(req, rawBody) {
  const timestamp  = req.headers['binancepay-timestamp'];
  const nonce      = req.headers['binancepay-nonce'];
  const receivedSig = req.headers['binancepay-signature'];

  if (!timestamp || !nonce || !receivedSig) return false;

  const payload = `${timestamp}\n${nonce}\n${rawBody}\n`;
  const expected = crypto
    .createHmac('sha512', process.env.BINANCE_PAY_API_SECRET)
    .update(payload)
    .digest('hex')
    .toUpperCase();

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(receivedSig.toUpperCase())
    );
  } catch {
    return false;
  }
}

// ── Optional Telegram notification ──────────────────────────────────
async function notifyAdmin(message) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (_) {}
}

// ── Main handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawBody = JSON.stringify(req.body);

  // ── 1. Verify Binance signature ──────────────────────────────────
  if (!verifyBinanceSignature(req, rawBody)) {
    console.warn('[binance/webhook] Invalid signature — rejected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // ── 2. Parse webhook payload ─────────────────────────────────────
  // Binance wraps the actual data in a "bizContent" JSON string
  const { bizType, bizStatus, bizContent } = req.body ?? {};

  console.log(`[binance/webhook] bizType=${bizType} bizStatus=${bizStatus}`);

  // Only handle PAY events that are FINISHED
  if (bizType !== 'PAY' || bizStatus !== 'PAY_SUCCESS') {
    return res.status(200).json({ returnCode: 'SUCCESS', returnMessage: 'noop' });
  }

  // ── 3. Parse bizContent ──────────────────────────────────────────
  let orderData;
  try {
    orderData = JSON.parse(bizContent);
  } catch {
    console.error('[binance/webhook] Failed to parse bizContent');
    return res.status(400).json({ error: 'Invalid bizContent' });
  }

  const { merchantTradeNo, openUserId, transactionId, orderAmount, currency, buyerMemo } = orderData;

  // ── 4. Extract userId from buyerMemo ─────────────────────────────
  // We stored "uid:<userId>" when creating the order
  const uidMatch = (buyerMemo ?? '').match(/uid:([^\s|]+)/);
  const userId = uidMatch?.[1];

  if (!userId) {
    console.error('[binance/webhook] Could not extract userId from buyerMemo:', buyerMemo);
    // Return SUCCESS to stop Binance from retrying; log for manual review
    return res.status(200).json({ returnCode: 'SUCCESS', returnMessage: 'userId not found' });
  }

  // ── 5. Update Firestore + Auth Custom Claims ─────────────────────
  try {
    const db  = getAdminDb();
    const auth = getAuth();

    // 5a. Firestore — user access
    await db.collection('users').doc(userId).set(
      {
        soberBookAccess: true,
        soberBookPurchasedAt: FieldValue.serverTimestamp(),
        soberBookPaymentId: transactionId,
        soberBookPaymentAmount: orderAmount,
        soberBookPaymentCurrency: currency,
        purchasedBooks: FieldValue.arrayUnion('sober-trading'),
      },
      { merge: true }
    );

    // 5b. Custom Claims (for Storage rules)
    const existingUser = await auth.getUser(userId);
    const existingClaims = existingUser.customClaims ?? {};
    await auth.setCustomUserClaims(userId, {
      ...existingClaims,
      soberBookAccess: true,
    });

    // 5c. Increment book salesCount
    await db.collection('books').doc('sober-trading').set(
      { salesCount: FieldValue.increment(1) },
      { merge: true }
    );

    // 5d. Purchase log
    await db.collection('book_purchases').add({
      userId,
      bookId: 'sober-trading',
      bookTitle: 'Sober Trading',
      paymentGateway: 'binance-pay',
      merchantTradeNo,
      transactionId,
      amountUsd: orderAmount,
      currency,
      status: 'completed',
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log(`[binance/webhook] ✅ Access + Custom Claim + salesCount++ for userId=${userId}`);

    await notifyAdmin(
      `📚 <b>Binance Pay Purchase!</b>\n` +
      `👤 User: <code>${userId}</code>\n` +
      `💰 Amount: ${orderAmount} ${currency?.toUpperCase()}\n` +
      `🔑 Tx: <code>${transactionId}</code>\n` +
      `📖 Book: Sober Trading`
    );

    return res.status(200).json({ returnCode: 'SUCCESS', returnMessage: 'OK' });
  } catch (err) {
    console.error('[binance/webhook] Error:', err);
    return res.status(500).json({ returnCode: 'FAIL', returnMessage: 'Database error' });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
};
