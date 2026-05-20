/**
 * /src/components/BookAccessGate.jsx
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Guards any content behind soberBookAccess.
 * Shows a premium paywall UI if the user hasn't purchased.
 *
 * Usage:
 *   <BookAccessGate onBuy={() => setPaymentOpen(true)}>
 *     <FullBookContent />
 *   </BookAccessGate>
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { useBookAccess } from '../hooks/useBookAccess';
import { useSearchParams } from 'react-router-dom';

const FEATURES = [
  { ar: 'الوصول الكامل لجميع الفصول الـ 12', en: 'Full access to all 12 chapters' },
  { ar: 'تحميل ملف PDF بدون قيود', en: 'Unlimited PDF download' },
  { ar: 'تحديثات مجانية مدى الحياة', en: 'Free lifetime updates' },
  { ar: 'دعم مباشر من Shukritrade', en: 'Direct Shukritrade support' },
];

export default function BookAccessGate({ children, onBuy }) {
  const { i18n }  = useTranslation();
  const isAr      = i18n.language === 'ar';
  const { hasAccess, loading, refreshToken } = useBookAccess();
  const [searchParams] = useSearchParams();

  // If redirected back from payment gateway with ?payment=success,
  // force-refresh the token so Custom Claims appear immediately.
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      refreshToken();
    }
  }, [searchParams]);

  // ── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // ── Has access — render children ──────────────────────────────────
  if (hasAccess) {
    return (
      <>
        {/* Access granted banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 w-fit"
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
            {isAr ? 'لديك وصول كامل للكتاب' : 'You have full book access'}
          </span>
        </motion.div>
        {children}
      </>
    );
  }

  // ── No access — paywall ───────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-[2rem] overflow-hidden border border-white/8 bg-zinc-900/40 backdrop-blur-xl"
    >
      {/* Blurred preview of locked content */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="blur-[10px] opacity-20 p-10 text-zinc-400 text-sm leading-loose">
          {isAr
            ? 'محتوى الكتاب المحمي — اشترِ الكتاب للوصول لجميع الفصول...'
            : 'Protected book content — purchase to unlock all chapters...'}
        </div>
      </div>

      {/* Paywall card */}
      <div className="relative flex flex-col items-center text-center px-8 py-16 z-10">
        {/* Lock icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-500/20 to-amber-600/10
                     border border-amber-500/20 flex items-center justify-center mb-8 shadow-xl shadow-amber-500/10"
        >
          <Lock className="w-9 h-9 text-amber-500" />
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
          {isAr ? 'هذا المحتوى محمي' : 'This Content is Locked'}
        </h3>
        <p className="text-zinc-400 text-sm max-w-md mb-8 leading-relaxed">
          {isAr
            ? 'الفصل الأول متاح مجاناً. لقراءة باقي الفصول، اشترِ الكتاب الإلكتروني بسعر مخفض 50%.'
            : 'Chapter 1 is free. To read the remaining chapters, purchase the e-book at 50% off.'}
        </p>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 w-full max-w-md text-start">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-zinc-300 text-xs font-medium">{isAr ? f.ar : f.en}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-4xl font-black text-white">$11.99</span>
          <span className="text-zinc-600 line-through text-lg">$23.98</span>
          <span className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-black">
            -50%
          </span>
        </div>

        {/* Buy button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBuy}
          className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400
                     text-black font-black text-sm uppercase tracking-widest transition-all
                     shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          {isAr ? 'اشترِ الكتاب الآن' : 'Buy the Book Now'}
        </motion.button>

        {/* NOWPayments link */}
        <a
          href="https://nowpayments.io/payment/?iid=4993211899"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-zinc-500 hover:text-amber-500 text-xs underline underline-offset-4 transition-colors cursor-pointer"
        >
          {isAr ? 'أو ادفع مباشرةً عبر NOWPayments ↗' : 'Or pay directly via NOWPayments ↗'}
        </a>
      </div>
    </motion.div>
  );
}
