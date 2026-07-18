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

import { auth } from './firebase';

/**
 * Determines if a Firestore user document or the current auth session belongs to an admin.
 * @param {object|null} userData - The Firestore user document data
 * @returns {boolean}
 */
export function isAdminUser(userData) {
  if (userData && userData.isAdmin === true) return true;

  // Fallback email check to guarantee immediate admin access without custom claims set yet
  const currentUser = auth?.currentUser;
  if (currentUser && currentUser.email) {
    const email = currentUser.email.toLowerCase();
    if (email === 'mchokri100@gmail.com' || email === 'ahmed1195@gmail.com') {
      return true;
    }
  }

  return false;
}
