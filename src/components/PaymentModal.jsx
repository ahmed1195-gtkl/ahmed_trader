import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getAuth } from 'firebase/auth';
import {
  X, MessageCircle, Zap, Shield, Clock,
  ChevronRight, ExternalLink, Lock, Star, Sparkles, Loader2
} from 'lucide-react';

/* ── Brand SVG logos ── */
const BinanceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#F3BA2F">
    <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6355-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.568 12l2.6926-2.7164zm-9.272 0l2.7164 2.7164-2.7164 2.7164L9.2713 12l2.7164-2.7164zM12 0l7.353 7.353-2.7164 2.7164L12 5.4468 7.3634 10.0694 4.647 7.353 12 0z"/>
  </svg>
);
const TelegramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#229ED9">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);
const CryptoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#6366f1">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.51 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.306.969z"/>
  </svg>
);
const StripeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#635BFF">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.92 5.555C4.56 23.346 7.897 24 11.09 24c2.619 0 4.785-.681 6.356-1.979 1.672-1.386 2.521-3.398 2.521-5.509 0-4.165-2.521-5.886-5.991-7.362z"/>
  </svg>
);

/* ── Payment options ── */
const PAYMENT_OPTIONS = [
  {
    id: 'admin',
    nameAr: 'التواصل مع الأدمن',
    nameEn: 'Contact Admin',
    descAr: 'تواصل مباشر عبر تيليجرام للشراء',
    descEn: 'Direct Telegram contact to purchase',
    icon: TelegramLogo,
    color: '#229ED9',
    bgColor: 'rgba(34,158,217,0.1)',
    borderColor: 'rgba(34,158,217,0.3)',
    badge: null,
    action: 'telegram',
    link: 'https://t.me/Ahmed_trader_support',
  },
  {
    id: 'nowpayments',
    nameAr: 'Crypto Pay (NOWPayments)',
    nameEn: 'Crypto Pay (NOWPayments)',
    descAr: 'USDT / BTC / ETH / أكثر من 300 عملة رقمية',
    descEn: 'USDT / BTC / ETH / 300+ cryptocurrencies',
    icon: CryptoLogo,
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.1)',
    borderColor: 'rgba(99,102,241,0.3)',
    badge: null,
    action: 'nowpayments',
    link: 'https://nowpayments.io/payment/?iid=4993211899',
  },
  {
    id: 'binance',
    nameAr: 'Binance Pay',
    nameEn: 'Binance Pay',
    descAr: 'ادفع بـ USDT أو BNB عبر تطبيق Binance',
    descEn: 'Pay with USDT or BNB via Binance app',
    icon: BinanceLogo,
    color: '#F3BA2F',
    bgColor: 'rgba(243,186,47,0.1)',
    borderColor: 'rgba(243,186,47,0.3)',
    badge: null,
    action: 'binance-api',
  },
  {
    id: 'stripe',
    nameAr: 'Stripe',
    nameEn: 'Stripe',
    descAr: 'بطاقات الائتمان والخصم — قريباً',
    descEn: 'Credit & debit cards — coming soon',
    icon: StripeLogo,
    color: '#635BFF',
    bgColor: 'rgba(99,91,255,0.08)',
    borderColor: 'rgba(99,91,255,0.2)',
    badge: { ar: 'قريباً', en: 'Soon' },
    action: 'disabled',
  },
];

/* ── Main Modal ── */
const PaymentModal = ({ isOpen, onClose, bookTitle, price, originalPrice }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [selectedOption, setSelectedOption] = useState(null);
  const [binanceLoading, setBinanceLoading] = useState(false);
  const [binanceError, setBinanceError] = useState('');

  const savings = (originalPrice - price).toFixed(2);
  const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleOptionClick = async (option) => {
    if (option.action === 'disabled') return;

    if (option.action === 'telegram') {
      window.open(option.link, '_blank', 'noopener,noreferrer');
      return;
    }

    if (option.action === 'nowpayments') {
      window.open(option.link, '_blank', 'noopener,noreferrer');
      return;
    }

    if (option.action === 'binance-api') {
      // Call our Vercel serverless function
      setBinanceLoading(true);
      setBinanceError('');
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setBinanceError(isAr ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
          setBinanceLoading(false);
          return;
        }
        const res = await fetch('/api/binance/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid, priceUsd: price }),
        });
        const data = await res.json();
        if (!res.ok || !data.checkoutUrl) throw new Error(data.error || 'Failed');
        window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        setBinanceError(isAr ? 'حدث خطأ، حاول مرة أخرى' : 'Error occurred, please retry');
      } finally {
        setBinanceLoading(false);
      }
      return;
    }

    // toggle expand for any other action
    setSelectedOption(option.id === selectedOption ? null : option.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/80 max-h-[90vh] overflow-y-auto"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-amber-500/8 blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 pb-5 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">
                    {isAr ? 'دفع آمن ومشفر' : 'Secure & Encrypted Payment'}
                  </span>
                </div>
                <h2 className="text-foreground font-black text-lg uppercase tracking-tight">
                  {isAr ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order summary */}
            <div className="px-6 py-4 bg-amber-500/5 border-b border-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-0.5">
                    {isAr ? 'ملخص الطلب' : 'Order Summary'}
                  </p>
                  <p className="text-white font-bold text-sm truncate">{bookTitle}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">${price}</span>
                  <div>
                    <span className="block text-zinc-600 line-through text-xs">${originalPrice}</span>
                    <span className="block text-green-400 text-[10px] font-bold">
                      {isAr ? `وفّرت $${savings}` : `Save $${savings}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/25">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-[10px] font-black uppercase tracking-wider">
                    {discountPct}% {isAr ? 'خصم' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-500 text-[10px] font-bold">
                    {isAr ? 'عرض محدود' : 'Limited Offer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment options */}
            <div className="p-6 space-y-3">
              {PAYMENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isDisabled = option.action === 'disabled';
                const isBinanceLoading = option.id === 'binance' && binanceLoading;

                return (
                  <div key={option.id}>
                    <motion.button
                      whileHover={isDisabled ? {} : { scale: 1.01 }}
                      whileTap={isDisabled ? {} : { scale: 0.99 }}
                      onClick={() => handleOptionClick(option)}
                      disabled={isDisabled || isBinanceLoading}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left
                        ${isDisabled ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]'
                          : 'cursor-pointer hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'}`}
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    >
                      {/* Icon */}
                      <div
                        className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: option.bgColor, border: `1px solid ${option.borderColor}` }}
                      >
                        {isBinanceLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : <Icon />}
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-black text-sm">
                            {isAr ? option.nameAr : option.nameEn}
                          </span>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-400 text-[9px] font-black uppercase">
                              {isAr ? option.badge.ar : option.badge.en}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          {isAr ? option.descAr : option.descEn}
                        </p>
                        {/* Binance error */}
                        {option.id === 'binance' && binanceError && (
                          <p className="text-red-400 text-[10px] mt-1">{binanceError}</p>
                        )}
                      </div>

                      {!isDisabled && (
                        <ExternalLink className="w-4 h-4 flex-shrink-0 text-zinc-600" />
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Footer trust badges */}
            <div className="px-6 pb-6 flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: Shield, ar: 'دفع آمن', en: 'Safe Payment' },
                { icon: Zap, ar: 'تسليم فوري', en: 'Instant Delivery' },
                { icon: Star, ar: 'ضمان الجودة', en: 'Quality Guaranteed' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-zinc-600">
                  <badge.icon className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isAr ? badge.ar : badge.en}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
