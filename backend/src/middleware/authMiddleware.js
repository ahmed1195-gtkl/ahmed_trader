import admin from 'firebase-admin';
import logger from '../utils/logger.js';

/**
 * checkAuth
 * ─────────────────────────────────────────────────────────────
 * Verifies the Firebase ID token sent in the Authorization header.
 * Sets req.user = { uid, email, ... } on success.
 * Returns 401/403 on missing or invalid tokens.
 */
export async function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // { uid, email, isAdmin, ... }
    next();
  } catch (err) {
    logger.warn(`Auth middleware rejected token: ${err.message}`);
    return res.status(403).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

/**
 * requireOwnership
 * ─────────────────────────────────────────────────────────────
 * After checkAuth, ensures that the userId in the request
 * matches the authenticated user's uid.
 * Admins (isAdmin custom claim OR fallback admin emails) bypass this check.
 */
export function requireOwnership(req, res, next) {
  const requestedUserId = req.body.userId || req.query.userId;

  if (!requestedUserId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  // Check admin via custom claim OR fallback emails (guarantees immediate access)
  const userEmail = req.user?.email ? req.user.email.toLowerCase() : '';
  const ADMIN_EMAILS = ['mchokri100@gmail.com', 'ahmed1195@gmail.com'];
  const isAdmin = req.user?.isAdmin === true || ADMIN_EMAILS.includes(userEmail);
  const isOwner = req.user?.uid === requestedUserId;

  if (!isAdmin && !isOwner) {
    logger.warn(
      `Ownership violation: uid=${req.user?.uid} tried to access userId=${requestedUserId}`
    );
    return res.status(403).json({ error: 'Forbidden: Access denied' });
  }

  next();
}
