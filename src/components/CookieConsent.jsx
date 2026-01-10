import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from './ui/button';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 z-[100] flex justify-center pointer-events-none"
        >
          <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl max-w-4xl w-full pointer-events-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="hidden md:flex p-3 bg-yellow-400/10 rounded-xl">
                <Cookie className="w-8 h-8 text-yellow-400" />
              </div>
              
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-white font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Cookie className="w-5 h-5 text-yellow-400 md:hidden" />
                  {t('cookies.title')}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('cookies.description')}
                </p>
              </div>

              <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                <Button
                  variant="ghost"
                  onClick={handleDecline}
                  className="flex-1 md:flex-none text-gray-400 hover:text-white hover:bg-white/5"
                >
                  {t('cookies.decline')}
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 md:flex-none bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8"
                >
                  {t('cookies.accept')}
                </Button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="hidden md:block text-gray-500 hover:text-white transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
