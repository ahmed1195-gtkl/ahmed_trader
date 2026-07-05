/**
 * ComingSoonPage — Premium placeholder for disabled pages.
 * Shown when an admin disables a page via Firebase.
 * Fully translated via i18n. Matches platform design system.
 */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, Lock, Sparkles } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';

export default function ComingSoonPage({ pageName }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-lg w-full text-center"
        >
          {/* Icon Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative mx-auto w-28 h-28 mb-8"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20 animate-pulse" />
            {/* Inner ring */}
            <div className="absolute inset-3 rounded-full bg-primary/5 border border-primary/10" />
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            {/* Orbit dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              {t('page.comingSoonBadge')}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black uppercase tracking-tighter text-foreground mb-4"
          >
            {t('page.comingSoon')}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto mb-8"
          >
            {t('page.comingSoonDesc')}
          </motion.p>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 flex items-start gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                {t('page.comingSoonStatus')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('page.comingSoonSubDesc')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
