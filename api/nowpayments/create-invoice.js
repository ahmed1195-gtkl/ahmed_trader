/**
 * /api/nowpayments/create-invoice.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Vercel Serverless Function — NOWPayments Invoice
 * Creates a hosted payment page and returns the invoice URL
 * to the frontend, so the client is redirected there to pay.
 *
 * Environment variables required (set in Vercel Dashboard):
 *   NOWPAYMENTS_API_KEY  — your NOWPayments API key
 *   NEXT_PUBLIC_SITE_URL — e.g. https://your-site.vercel.app
 */

export default async function handler(req, res) {
  // ── 1. Allow only POST ──────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ── 2. CORS headers (adjust origin to your domain) ──────────────
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

  // ── 4. Call NOWPayments Invoice API ─────────────────────────────
  try {
    const nowPaymentsRes = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: 'usd',
        // We embed userId in order_description so the webhook can
        // extract it reliably (order_id has length limits).
        order_description: `SOBER_BOOK|uid:${userId}`,
        // A short human-readable ID shown in the NOWPayments dashboard
        order_id: `sober-${Date.now()}`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/nowpayments/webhook`,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/books/sober-trading?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/books/sober-trading?payment=cancelled`,
        is_fixed_rate: false,
        is_fee_paid_by_user: false,
      }),
    });

    const data = await nowPaymentsRes.json();

    if (!nowPaymentsRes.ok) {
      console.error('[create-invoice] NOWPayments error:', data);
      return res.status(502).json({
        error: 'Failed to create NOWPayments invoice',
        details: data,
      });
    }

    // ── 5. Return the invoice URL to the frontend ────────────────
    return res.status(200).json({
      invoiceUrl: data.invoice_url,
      invoiceId: data.id,
    });
  } catch (err) {
    console.error('[create-invoice] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
