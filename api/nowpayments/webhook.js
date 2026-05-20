/**
 * /api/nowpayments/webhook.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Vercel Serverless Function — NOWPayments IPN Webhook
 *
 * NOWPayments calls this URL automatically when a payment
 * reaches a terminal state (finished / confirmed / failed).
 *
 * Security: every IPN call is signed with HMAC-SHA512 using
 * your IPN Secret. We verify the signature before doing anything.
 *
 * Environment variables required (Vercel Dashboard):
 *   NOWPAYMENTS_IPN_SECRET        — IPN Secret from NOWPayments dashboard
 *   FIREBASE_PROJECT_ID           — e.g. your-project-id
 *   FIREBASE_CLIENT_EMAIL         — service account email
 *   FIREBASE_PRIVATE_KEY          — service account private key (with \n)
 *   TELEGRAM_BOT_TOKEN            — (optional) for admin notifications
 *   TELEGRAM_ADMIN_CHAT_ID        — (optional) your Telegram chat id
 */

import crypto from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// ── Firebase Admin singleton (safe across hot-reloads) ──────────────
function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel stores multi-line secrets with literal \n — fix them:
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

// ── HMAC-SHA512 Signature Verification ──────────────────────────────
/**
 * NOWPayments sends the header x-nowpayments-sig containing
 * HMAC-SHA512( sorted_json_body, IPN_SECRET ).
 * We must sort the JSON keys alphabetically, then hash.
 */
function verifySignature(rawBody, receivedSig) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) {
    console.error('[webhook] NOWPAYMENTS_IPN_SECRET is not set!');
    return false;
  }

  // Sort keys alphabetically (NOWPayments requirement)
  const sorted = JSON.stringify(
    JSON.parse(rawBody),
    Object.keys(JSON.parse(rawBody)).sort()
  );

  const expectedSig = crypto
    .createHmac('sha512', secret)
    .update(sorted)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSig, 'hex'),
    Buffer.from(receivedSig, 'hex')
  );
}

// ── Optional: Notify admin via Telegram ─────────────────────────────
async function notifyAdmin(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (_) {
    // Non-critical — don't fail the webhook over a notification error
  }
}

// ── Main Handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Capture raw body for signature verification
  // Vercel automatically parses JSON — we need the raw string.
  // Use the built-in `req.body` (already parsed) and re-stringify
  // in sorted order for verification.
  const rawBody = JSON.stringify(req.body);
  const receivedSig = req.headers['x-nowpayments-sig'];

  // ── 1. Verify signature ─────────────────────────────────────────
  if (!receivedSig || !verifySignature(rawBody, receivedSig)) {
    console.warn('[webhook] Invalid or missing signature — request rejected');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = req.body;
  const { payment_status, order_description, payment_id, price_amount, price_currency } = payload;

  console.log(`[webhook] payment_id=${payment_id} status=${payment_status}`);

  // ── 2. Only act on "finished" payments ──────────────────────────
  // NOWPayments statuses: waiting → confirming → confirmed → sending
  //                       → partially_paid → finished / failed / refunded
  if (payment_status !== 'finished') {
    // Acknowledge receipt but do nothing
    return res.status(200).json({ received: true, action: 'none', payment_status });
  }

  // ── 3. Extract userId from order_description ─────────────────────
  // Format we set in create-invoice: "SOBER_BOOK|uid:<userId>"
  const uidMatch = (order_description ?? '').match(/uid:([^\s|]+)/);
  const userId = uidMatch?.[1];

  if (!userId) {
    console.error('[webhook] Could not extract userId from order_description:', order_description);
    // Still return 200 so NOWPayments doesn't keep retrying
    return res.status(200).json({ received: true, error: 'userId not found' });
  }

  // ── 4. Update Firestore + Auth Custom Claims ────────────────────
  try {
    const db = getAdminDb();
    const auth = getAuth();

    // 4a. Firestore — store purchase metadata
    await db.collection('users').doc(userId).set(
      {
        soberBookAccess: true,
        soberBookPurchasedAt: FieldValue.serverTimestamp(),
        soberBookPaymentId: payment_id,
        soberBookPaymentAmount: price_amount,
        soberBookPaymentCurrency: price_currency,
        purchasedBooks: FieldValue.arrayUnion('sober-trading'),
      },
      { merge: true }
    );

    // 4b. Auth Custom Claims — needed for Firebase Storage rules
    // Merge with any existing claims to avoid overwriting others
    const existingUser = await auth.getUser(userId);
    const existingClaims = existingUser.customClaims ?? {};
    await auth.setCustomUserClaims(userId, {
      ...existingClaims,
      soberBookAccess: true,
    });

    console.log(`[webhook] ✅ Granted soberBookAccess + Custom Claim to userId=${userId}`);

    // ── 5. Log the transaction ────────────────────────────────────
    await db.collection('book_purchases').add({
      userId,
      bookId: 'sober-trading',
      bookTitle: 'Sober Trading',
      paymentId: payment_id,
      paymentGateway: 'nowpayments',
      amountUsd: price_amount,
      currency: price_currency,
      status: 'completed',
      createdAt: FieldValue.serverTimestamp(),
    });

    // ── 6. Notify admin ───────────────────────────────────────────
    await notifyAdmin(
      `📚 <b>Book Purchased — NOWPayments!</b>\n` +
      `👤 User: <code>${userId}</code>\n` +
      `💰 Amount: ${price_amount} ${price_currency?.toUpperCase()}\n` +
      `🔑 Payment ID: <code>${payment_id}</code>\n` +
      `📖 Book: Sober Trading`
    );

    return res.status(200).json({ received: true, action: 'access_granted', userId });
  } catch (err) {
    console.error('[webhook] Update failed:', err);
    return res.status(500).json({ error: 'Database update failed' });
  }
}

// Vercel config: disable body parsing so we get the raw buffer
// (needed for correct signature verification)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
