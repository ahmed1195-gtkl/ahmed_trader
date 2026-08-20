/**
 * PlatformContext
 * Streams `platformSettings/main` from Firestore in real-time.
 * Provides page availability + feature switches to the entire app.
 *
 * Usage:
 *   const { pages, features, maintenance } = usePlatform();
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// ─── Default values (all ON by default) ────────────────────────────────────
const DEFAULT_SETTINGS = {
  pages: {
    academy: true,
    books: true,
    community: true,
    messages: true,
    aiBot: true,
    pipCalculator: true,
    courses: true,
    challenges: true,
    marketIntelligence: true,
    globalLeaderboard: true,
    news: true,
    brokers: true,
    sheetsGuide: true,
    friends: true,
  },
  features: {
    messagesEnabled: true,
    notificationsEnabled: true,
    bookPurchase: true,
    community: true,
  },
  maintenance: false,
  pageMaintenance: {
    courses: { enabled: false, message: '', startTime: null, returnTime: null },
    news: { enabled: false, message: '', startTime: null, returnTime: null },
    academy: { enabled: false, message: '', startTime: null, returnTime: null },
    aiBot: { enabled: false, message: '', startTime: null, returnTime: null },
    challenges: { enabled: false, message: '', startTime: null, returnTime: null },
    messages: { enabled: false, message: '', startTime: null, returnTime: null },
    community: { enabled: false, message: '', startTime: null, returnTime: null },
    books: { enabled: false, message: '', startTime: null, returnTime: null },
    brokers: { enabled: false, message: '', startTime: null, returnTime: null },
    marketIntelligence: { enabled: false, message: '', startTime: null, returnTime: null },
    globalLeaderboard: { enabled: false, message: '', startTime: null, returnTime: null },
    pipCalculator: { enabled: false, message: '', startTime: null, returnTime: null },
    sheetsGuide: { enabled: false, message: '', startTime: null, returnTime: null },
  }
};

const PlatformContext = createContext({
  ...DEFAULT_SETTINGS,
  loading: true,
  rawSettings: DEFAULT_SETTINGS,
});

// ─── Provider ───────────────────────────────────────────────────────────────
export function PlatformProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'platformSettings', 'main');

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings({
          pages: { ...DEFAULT_SETTINGS.pages, ...(data.pages || {}) },
          features: { ...DEFAULT_SETTINGS.features, ...(data.features || {}) },
          maintenance: data.maintenance ?? false,
          pageMaintenance: { ...DEFAULT_SETTINGS.pageMaintenance, ...(data.pageMaintenance || {}) },
        });
      } else {
        // First run: bootstrap the document with defaults
        setDoc(ref, DEFAULT_SETTINGS, { merge: true }).catch(console.error);
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    }, (err) => {
      console.error('[PlatformContext] Firestore error:', err);
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <PlatformContext.Provider value={{ ...settings, loading, rawSettings: settings }}>
      {children}
    </PlatformContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function usePlatform() {
  return useContext(PlatformContext);
}

export default PlatformContext;
