/**
 * /src/hooks/useBookAccess.js
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * React hook — checks if the current Firebase user
 * has purchased the Sober Book.
 *
 * Sources (in priority order):
 *   1. Firebase Auth Custom Claims  (fastest — in JWT, no extra read)
 *   2. Firestore users/{uid}.soberBookAccess  (fallback)
 *
 * The hook also watches for token refresh after payment,
 * so the UI updates automatically without a page reload.
 */

import { useState, useEffect } from 'react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

export function useBookAccess() {
  const [hasAccess, setHasAccess]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [userId, setUserId]         = useState(null);

  useEffect(() => {
    const auth = getAuth();
    let firestoreUnsub = null;

    // Listen for token changes (login, logout, token refresh after Claims update)
    const unsubAuth = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        setUserId(null);
        if (firestoreUnsub) { firestoreUnsub(); firestoreUnsub = null; }
        return;
      }

      setUserId(user.uid);

      // 1. Check Custom Claims (no Firestore read needed)
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims?.soberBookAccess === true) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // 2. Fallback: watch Firestore field (catches newly granted access
      //    before the user's JWT refreshes, which can take up to 1 hour)
      const db = getFirestore();
      if (firestoreUnsub) firestoreUnsub();
      firestoreUnsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHasAccess(!!data?.soberBookAccess);
        } else {
          setHasAccess(false);
        }
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (firestoreUnsub) firestoreUnsub();
    };
  }, []);

  /**
   * Force-refresh the ID token so Custom Claims propagate
   * immediately after a successful payment (call this from
   * the payment success page / URL param handler).
   */
  const refreshToken = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(/* forceRefresh */ true);
    }
  };

  return { hasAccess, loading, userId, refreshToken };
}
