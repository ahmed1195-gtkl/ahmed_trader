import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  X, MessageCircle, Zap, Shield, Clock,
  ChevronRight, Copy, Check, ExternalLink,
  Lock, Star, Sparkles
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SVG brand logos (Simple Icons paths)
───────────────────────────────────────────── */
const BinanceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#F3BA2F">
    <path d="M12 0L8.386 3.614l-2.25-2.25L12 -1.5 17.864 4.364l-2.25 2.25zM7.5 6.75L12 2.25l4.5 4.5-4.5 4.5zM0 12l3.614-3.614 2.25 2.25L0 16.364zM6.75 12L12 6.75 17.25 12 12 17.25zM20.386 8.386L24 12l-3.614 3.614-2.25-2.25 1.864-1.864-1.864-1.864zM16.5 12l-4.5 4.5-4.5-4.5 4.5-4.5zM8.386 20.386l-2.25-2.25L12 12.75l5.864 5.386-2.25 2.25L12 16.364zM12 24l-5.864-5.864 2.25-2.25L12 20.25l3.614-3.364 2.25 2.25z"/>
  </svg>
);

const TelegramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#229ED9">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const CryptoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#002D74">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.51 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.306.969z"/>
  </svg>
);

const StripeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#635BFF">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.92 5.555C4.56 23.346 7.897 24 11.09 24c2.619 0 4.785-.681 6.356-1.979 1.672-1.386 2.521-3.presumed 2.521-5.509 0-4.165-2.521-5.886-5.991-7.362z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Payment options config
───────────────────────────────────────────── */
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
    link: 'https://t.me/ahmed_trader_123',
  },
  {
    id: 'binance',
    nameAr: 'Binance Pay',
    nameEn: 'Binance Pay',
    descAr: 'ادفع بـ USDT أو BNB أو أي عملة Binance',
    descEn: 'Pay with USDT, BNB, or any Binance asset',
    icon: BinanceLogo,
    color: '#F3BA2F',
    bgColor: 'rgba(243,186,47,0.1)',
    borderColor: 'rgba(243,186,47,0.3)',
    badge: null,
    action: 'copy',
    copyValue: 'BINANCE_PAY_ID_PLACEHOLDER',
    copyLabel: { ar: 'Binance Pay ID', en: 'Binance Pay ID' },
  },
  {
    id: 'crypto',
    nameAr: 'Crypto Pay',
    nameEn: 'Crypto Pay',
    descAr: 'دفع مشفر آمن — USDT / BTC / ETH',
    descEn: 'Secure crypto payment — USDT / BTC / ETH',
    icon: CryptoLogo,
    color: '#002D74',
    bgColor: 'rgba(0,45,116,0.15)',
    borderColor: 'rgba(99,91,255,0.35)',
    badge: null,
    action: 'copy',
    copyValue: 'CRYPTO_WALLET_PLACEHOLDER',
    copyLabel: { ar: 'عنوان المحفظة', en: 'Wallet Address' },
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

/* ─────────────────────────────────────────────
   CopyToClipboard mini-button
───────────────────────────────────────────── */
const CopyButton = ({ value, isAr }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}
    </motion.button>
  );
};

/* ─────────────────────────────────────────────
   Main Modal
───────────────────────────────────────────── */
const PaymentModal = ({ isOpen, onClose, bookTitle, price, originalPrice }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    if (option.action === 'disabled') return;
    if (option.action === 'telegram') {
      window.open(option.link, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedOption(option.id === selectedOption ? null : option.id);
  };

  const savings = (originalPrice - price).toFixed(2);
  const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);

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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/80"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Top ambient glow */}
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
                <h2 className="text-white font-black text-lg uppercase tracking-tight">
                  {isAr ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-amber-500/5 border-b border-amber-500/10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-0.5">
                    {isAr ? 'ملخص الطلب' : 'Order Summary'}
                  </p>
                  <p className="text-white font-bold text-sm truncate">{bookTitle}</p>
                </div>
                <div className={`flex items-baseline gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl font-black text-white">${price}</span>
                  <div className="text-right">
                    <span className="block text-zinc-600 line-through text-xs">${originalPrice}</span>
                    <span className="block text-green-400 text-[10px] font-bold">
                      {isAr ? `وفّرت $${savings}` : `Save $${savings}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Discount pill */}
              <div className="flex items-center gap-2 mt-3">
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

            {/* Payment Options */}
            <div className="p-6 space-y-3">
              {PAYMENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption === option.id;
                const isDisabled = option.action === 'disabled';

                return (
                  <div key={option.id}>
                    <motion.button
                      whileHover={isDisabled ? {} : { scale: 1.01 }}
                      whileTap={isDisabled ? {} : { scale: 0.99 }}
                      onClick={() => handleOptionClick(option)}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                        ${isDisabled
                          ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]'
                          : isSelected
                            ? 'cursor-pointer'
                            : 'cursor-pointer hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
                        }
                      `}
                      style={
                        isSelected
                          ? { background: option.bgColor, borderColor: option.borderColor }
                          : { borderColor: 'rgba(255,255,255,0.06)' }
                      }
                    >
                      {/* Icon */}
                      <div
                        className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: option.bgColor, border: `1px solid ${option.borderColor}` }}
                      >
                        <Icon />
                      </div>

                      {/* Label */}
                      <div className={`flex-1 text-${isAr ? 'right' : 'left'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-black text-sm">
                            {isAr ? option.nameAr : option.nameEn}
                          </span>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-400 text-[9px] font-black uppercase tracking-wider">
                              {isAr ? option.badge.ar : option.badge.en}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          {isAr ? option.descAr : option.descEn}
                        </p>
                      </div>

                      {/* Arrow */}
                      {!isDisabled && (
                        <ChevronRight
                          className="w-4 h-4 flex-shrink-0 transition-all duration-200"
                          style={{ color: isSelected ? option.color : 'rgba(161,161,170,0.5)' }}
                        />
                      )}
                    </motion.button>

                    {/* Expanded detail for copy options */}
                    <AnimatePresence>
                      {isSelected && option.action === 'copy' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mx-2 mt-2 p-4 rounded-xl border"
                            style={{ background: option.bgColor, borderColor: option.borderColor }}
                          >
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                              {isAr ? option.copyLabel.ar : option.copyLabel.en}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <code
                                className="flex-1 text-white text-xs font-mono bg-black/30 px-3 py-2 rounded-lg break-all"
                                style={{ borderLeft: `3px solid ${option.color}` }}
                              >
                                {option.copyValue}
                              </code>
                              <CopyButton value={option.copyValue} isAr={isAr} />
                            </div>
                            <p className="text-zinc-500 text-[10px] mt-3 leading-relaxed">
                              {isAr
                                ? `بعد الدفع، تواصل مع الأدمن على تيليجرام مع إرسال إثبات الدفع للحصول على الكتاب.`
                                : `After payment, contact admin on Telegram with proof of payment to receive the book.`}
                            </p>
                            <motion.a
                              whileHover={{ scale: 1.01 }}
                              href="https://t.me/ahmed_trader_123"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] text-xs font-black uppercase tracking-wider transition-all hover:bg-[#229ED9]/30 cursor-pointer w-fit"
                            >
                              <TelegramLogo />
                              {isAr ? 'تواصل مع الأدمن' : 'Contact Admin'}
                              <ExternalLink className="w-3 h-3" />
                            </motion.a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
