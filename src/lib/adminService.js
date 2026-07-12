/**
 * adminService.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for admin detection.
 *
 * ✅ Correct approach: read `isAdmin: true` from the user's
 *    Firestore document — set manually by a super-admin.
 * ❌ Never hardcode admin emails in source code.
 * ─────────────────────────────────────────────────────────────
 *
 * To grant admin access, run this once in Firebase Console or
 * via a secure Cloud Function:
 *   db.collection('users').doc(USER_UID).update({ isAdmin: true })
 */

/**
 * Determines if a Firestore user document belongs to an admin.
 * @param {object|null} userData - The Firestore user document data
 * @returns {boolean}
 */
export function isAdminUser(userData) {
  if (!userData) return false;
  return userData.isAdmin === true;
}
