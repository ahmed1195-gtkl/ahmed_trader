import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Wrench, Clock, Calendar, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function MaintenancePage({ pageName, maintenanceInfo }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const customMessage = maintenanceInfo?.message;
  const startTime = maintenanceInfo?.startTime;
  const returnTime = maintenanceInfo?.returnTime;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
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
            <div className="absolute inset-0 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse" />
            {/* Inner ring */}
            <div className="absolute inset-3 rounded-full bg-amber-500/5 border border-amber-500/10" />
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Wrench className="w-10 h-10 text-amber-500" />
            </div>
            {/* Orbit dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
              {isAr ? 'صيانة النظام' : 'System Maintenance'}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-foreground mb-4"
          >
            {isAr ? 'الصفحة قيد الصيانة المؤقتة' : 'Page Under Maintenance'}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8"
          >
            {customMessage || (
              isAr
                ? 'هذا القسم غير متاح حالياً بينما نقوم بتطوير وتحسين تجربة المستخدم. يُرجى التحقق لاحقاً.'
                : 'This section is temporarily unavailable while we perform system enhancements. Please check back later.'
            )}
          </motion.p>

          {/* Info Card (Timings if configured) */}
          {(startTime || returnTime) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-xl p-5 mb-8 text-left space-y-3"
            >
              {startTime && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      {isAr ? 'تاريخ البدء' : 'Maintenance Start'}
                    </p>
                    <p className="text-xs text-foreground font-semibold">
                      {new Date(startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {returnTime && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      {isAr ? 'العودة المتوقعة' : 'Expected Return'}
                    </p>
                    <p className="text-xs text-foreground font-semibold">
                      {new Date(returnTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Return button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              <ArrowLeft className="w-4 h-4" />
              {isAr ? 'العودة للرئيسية' : 'Return to Home'}
            </button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
