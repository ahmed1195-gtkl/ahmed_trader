/**
 * /api/binance/create-order.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Vercel Serverless Function — Binance Pay Create Order
 *
 * Creates a Binance Pay order and returns:
 *   - checkoutUrl  (redirect user here)
 *   - qrcodeUrl    (show QR in app)
 *   - prepayId     (for status polling)
 *
 * Docs: https://developers.binance.com/docs/binance-pay/api-order-create-v3
 *
 * Environment variables required (Vercel Dashboard):
 *   BINANCE_PAY_API_KEY     — Merchant API Key
 *   BINANCE_PAY_API_SECRET  — Merchant API Secret
 *   NEXT_PUBLIC_SITE_URL    — e.g. https://your-site.vercel.app
 */

import crypto from 'crypto';

const BINANCE_PAY_BASE = 'https://bpay.binanceapi.com';

/**
 * Build the HMAC-SHA256 signature required by Binance Pay.
 * Format: TIMESTAMP + "\n" + NONCE + "\n" + BODY + "\n"
 */
function buildSignature(timestamp, nonce, body, secret) {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex').toUpperCase();
}

/** Generate a random nonce (32 chars, alphanumeric) */
function generateNonce() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

export default async function handler(req, res) {
  // ── 1. Method guard ─────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ── 2. CORS ─────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ── 3. Validate input ───────────────────────────────────────────
  const { userId, priceUsd } = req.body ?? {};

  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  const amount = Number(priceUsd);
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Missing or invalid priceUsd' });
  }

  // ── 4. Prepare request ──────────────────────────────────────────
  const apiKey    = process.env.BINANCE_PAY_API_KEY;
  const apiSecret = process.env.BINANCE_PAY_API_SECRET;
  const timestamp = Date.now().toString();
  const nonce     = generateNonce();

  // Unique merchant trade number (max 32 chars)
  const merchantTradeNo = `SBR${Date.now()}`;

  const orderBody = {
    env: {
      terminalType: 'WEB',
    },
    merchantTradeNo,
    orderAmount: amount.toFixed(2),
    currency: 'USDT', // Binance Pay charges in crypto; USDT pegged to USD
    goods: {
      goodsType: '02',           // 02 = Digital goods
      goodsCategory: 'Z000',     // Education / Books
      referenceGoodsId: 'sober-trading',
      goodsName: 'Sober Trading E-Book',
      goodsDetail: `User:${userId}`,
    },
    returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/books/sober-trading?payment=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/books/sober-trading?payment=cancelled`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/binance/webhook`,
    // Store userId in buyerMemo so webhook can retrieve it
    buyerMemo: `uid:${userId}`,
  };

  const bodyString = JSON.stringify(orderBody);
  const signature  = buildSignature(timestamp, nonce, bodyString, apiSecret);

  // ── 5. Call Binance Pay API ─────────────────────────────────────
  try {
    const binanceRes = await fetch(`${BINANCE_PAY_BASE}/binancepay/openapi/v3/order`, {
      method: 'POST',
      headers: {
        'Content-Type':              'application/json',
        'BinancePay-Timestamp':      timestamp,
        'BinancePay-Nonce':          nonce,
        'BinancePay-Certificate-SN': apiKey,
        'BinancePay-Signature':      signature,
      },
      body: bodyString,
    });

    const data = await binanceRes.json();

    if (data.status !== 'SUCCESS') {
      console.error('[binance/create-order] API error:', data);
      return res.status(502).json({
        error: 'Binance Pay order creation failed',
        details: data,
      });
    }

    const { checkoutUrl, qrcodeLink, prepayId } = data.data;

    return res.status(200).json({ checkoutUrl, qrcodeUrl: qrcodeLink, prepayId });
  } catch (err) {
    console.error('[binance/create-order] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
