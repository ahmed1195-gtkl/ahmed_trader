import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[450px] z-[200]"
        >
          <div className="relative overflow-hidden bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Cookie className="w-7 h-7 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-medium">
                    {t('cookies.description')}
                    <Link to="/privacy" className="text-amber-500 hover:underline ml-1 font-black uppercase tracking-widest text-[9px]">
                      {t('cookies.policy')}
                    </Link>
                  </p>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDecline}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  {t('cookies.decline')}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-4 rounded-2xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  {t('cookies.accept')}
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
