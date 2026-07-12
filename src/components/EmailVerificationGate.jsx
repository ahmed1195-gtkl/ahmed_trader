import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Mail, CheckCircle, RefreshCw, LogOut, Loader2, AlertCircle } from 'lucide-react';
import shukritradeLogo from '../assets/shukritrade_logo.svg';

const EmailVerificationGate = ({ onVerified }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isRTL = lang === 'ar';

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = auth.currentUser;

  const dictionary = {
    en: {
      title: 'Verify Your Email',
      desc: 'We have sent a verification link to your email address:',
      checkBtn: 'I Have Verified My Email',
      resendBtn: 'Resend Verification Link',
      logoutBtn: 'Logout & Switch Account',
      successSent: 'Verification email sent successfully! Please check your inbox.',
      notVerified: 'Email is not verified yet. Please click the link in your email and try again.',
      checking: 'Checking verification status...',
      sending: 'Sending...',
      errorOccured: 'An error occurred. Please try again.',
      verifiedSuccess: 'Email verified successfully! Welcome to Shukritrade.',
    },
    ar: {
      title: 'تفعيل البريد الإلكتروني',
      desc: 'لقد أرسلنا رابط التفعيل إلى عنوان بريدك الإلكتروني:',
      checkBtn: 'لقد قمت بتفعيل حسابي',
      resendBtn: 'إعادة إرسال رابط التفعيل',
      logoutBtn: 'تسجيل الخروج وتغيير الحساب',
      successSent: 'تم إرسال بريد التفعيل بنجاح! يرجى التحقق من صندوق الوارد.',
      notVerified: 'البريد الإلكتروني لم يتم تفعيله بعد. يرجى الضغط على الرابط في الرسالة والمحاولة مرة أخرى.',
      checking: 'جاري التحقق من حالة التفعيل...',
      sending: 'جاري الإرسال...',
      errorOccured: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      verifiedSuccess: 'تم تفعيل البريد الإلكتروني بنجاح! مرحباً بك في شكر تريد.',
    },
    fr: {
      title: 'Vérifiez votre e-mail',
      desc: 'Nous avons envoyé un lien de vérification à votre adresse e-mail :',
      checkBtn: "J'ai vérifié mon e-mail",
      resendBtn: 'Renvoyer le lien de vérification',
      logoutBtn: 'Déconnexion & Changer de compte',
      successSent: 'E-mail de vérification envoyé avec succès ! Veuillez vérifier votre boîte de réception.',
      notVerified: "L'e-mail n'est pas encore vérifié. Veuillez cliquer sur le lien dans votre e-mail et réessayer.",
      checking: 'Vérification du statut...',
      sending: 'Envoi en cours...',
      errorOccured: 'Une erreur est survenue. Veuillez réessayer.',
      verifiedSuccess: 'E-mail vérifié avec succès ! Bienvenue sur Shukritrade.',
    }
  };

  const ui = dictionary[lang] || dictionary.en;

  const handleCheckVerification = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // Reload user profile to get fresh emailVerified status from Firebase Auth
      await user.reload();
      if (auth.currentUser.emailVerified) {
        setMessage(ui.verifiedSuccess);
        if (onVerified) {
          setTimeout(() => {
            onVerified();
          }, 1500);
        }
      } else {
        setError(ui.notVerified);
      }
    } catch (err) {
      console.error(err);
      setError(ui.errorOccured);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;
    setResending(true);
    setError('');
    setMessage('');
    try {
      await sendEmailVerification(user);
      setMessage(ui.successSent);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/too-many-requests') {
        setError(lang === 'ar' ? 'طلبات كثيرة جداً. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.' : 'Too many requests. Please wait a moment before trying again.');
      } else {
        setError(ui.errorOccured);
      }
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-primary/4 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand logo */}
        <div className="text-center mb-8">
          <img src={shukritradeLogo} alt="Shukritrade" className="h-10 sm:h-12 w-auto object-contain mx-auto" />
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mt-3" />
        </div>

        {/* Card */}
        <div className="relative bg-card/60 backdrop-blur-3xl border border-border rounded-2xl overflow-hidden shadow-lg shadow-gold-glow p-8">
          {/* Top glowing bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex flex-col items-center text-center">
            {/* Animated mail icon */}
            <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-amber-500 animate-pulse" />
            </div>

            <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-3">
              {ui.title}
            </h1>
            
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-1">
              {ui.desc}
            </p>
            <p className="text-amber-400 font-bold text-sm mb-6 select-all">
              {user?.email}
            </p>

            {/* Error or Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-red-500/8 border border-red-500/15 backdrop-blur-sm mb-5 text-start"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs font-semibold leading-relaxed">{error}</p>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-green-500/8 border border-green-500/15 backdrop-blur-sm mb-5 text-start"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-green-300 text-xs font-semibold leading-relaxed">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons list */}
            <div className="w-full space-y-3.5">
              {/* Check status button */}
              <motion.button
                onClick={handleCheckVerification}
                disabled={loading || resending}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {loading ? ui.checking : ui.checkBtn}
              </motion.button>

              {/* Resend email button */}
              <motion.button
                onClick={handleResendEmail}
                disabled={loading || resending}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 border border-border bg-white/[0.03] hover:bg-white/[0.07] text-foreground font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {resending ? ui.sending : ui.resendBtn}
              </motion.button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full h-10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-red-400 transition-colors pt-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                {ui.logoutBtn}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationGate;
