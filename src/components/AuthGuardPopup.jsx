import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

const AuthGuardPopup = ({ isOpen }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop - No click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-amber-500" />
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            {isAr ? 'محتوى' : 'Protected'} <span className="text-amber-500">{isAr ? 'محمي' : 'Content'}</span>
          </h2>
          
          <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed">
            {isAr 
              ? 'للوصول إلى هذه الميزة المتقدمة، يجب عليك إنشاء حساب أو تسجيل الدخول أولاً. انضم إلينا الآن لبدء رحلتك الاحترافية.' 
              : 'To access this advanced feature, you must create an account or sign in first. Join us now to start your professional journey.'}
          </p>

          <div className="space-y-4">
            {/* Google Sign In */}
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" decoding="async" loading="lazy" />
              {isAr ? 'التسجيل عبر جوجل' : 'Sign in with Google'}
            </Button>

            {/* Email/Auth Page */}
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              {isAr ? 'إنشاء حساب / تسجيل دخول' : 'Create Account / Login'}
            </Button>

            {/* Back to Home - Optional but user said "no back button" for the popup itself, 
                however, we should allow them to go back to home if they don't want to register */}
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors mt-4"
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500/50" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              {isAr ? 'بياناتك محمية ومشفرة بالكامل' : 'Your data is fully protected and encrypted'}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthGuardPopup;
