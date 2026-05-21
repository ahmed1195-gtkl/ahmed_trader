import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signInWithRedirect,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';
import {
  Eye, EyeOff, Mail, Lock, User, Globe, Phone,
  Shield, ArrowLeft, CheckCircle2, AlertCircle,
  Loader2, ChevronRight
} from 'lucide-react';
import shukritradeLogo from '../assets/shukritrade_logo.svg';

/* ─────────────────────────────────────────────
   Reusable Premium Input with left icon + glow
───────────────────────────────────────────── */
const PremiumInput = ({
  id, type = 'text', placeholder, value, onChange,
  icon: Icon, rightElement, required, autoComplete,
  inputMode, className = ''
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative group ${className}`}>
      {/* Left icon */}
      {Icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10
          ${focused ? 'text-amber-400' : 'text-white/25'}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full h-12 rounded-xl bg-white/[0.04] border transition-all duration-300 outline-none
          text-white placeholder-white/20 text-[16px] font-medium
          ${Icon ? 'pl-11' : 'pl-4'}
          ${rightElement ? 'pr-12' : 'pr-4'}
          ${focused
            ? 'border-amber-500/60 bg-white/[0.07] shadow-[0_0_0_3px_rgba(245,158,11,0.08)]'
            : 'border-white/8 hover:border-white/15'
          }
        `}
      />

      {/* Right element (e.g. password toggle) */}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightElement}
        </div>
      )}

      {/* Glow line at bottom on focus */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full"
        animate={{ width: focused ? '80%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   Premium Label
───────────────────────────────────────────── */
const FieldLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="block text-[10px] font-black uppercase tracking-[0.15em] text-amber-400/70 mb-1.5 pl-0.5"
  >
    {children}
  </label>
);

/* ─────────────────────────────────────────────
   Main Auth Component
───────────────────────────────────────────── */
const Auth = () => {
  const { t } = useTranslation();

  // ── All original state (preserved exactly) ──
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // ── New UI-only state ──
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ── Original computed value (preserved exactly) ──
  const selectedCountry = useMemo(() => {
    return countries.find(c => c.code === country);
  }, [country]);

  // ── Original password strength effect (preserved exactly) ──
  useEffect(() => {
    if (!isLogin && password) {
      let strength = 0;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password, isLogin]);

  // ── Original error translation (preserved exactly) ──
  const translateError = (err) => {
    const code = err.code;
    const message = err.message;
    console.error("Auth Error Details:", { code, message });

    if (code === 'auth/operation-not-allowed') {
      return "Authentication method not enabled in Firebase Console. Please enable Email/Password and Google.";
    }
    if (code === 'auth/unauthorized-domain') {
      return "This domain is not authorized in Firebase Console. Please add it to the authorized domains list.";
    }

    switch (code) {
      case 'auth/weak-password': return t('auth.weakPassword');
      case 'auth/invalid-email': return t('auth.invalidEmail');
      case 'auth/email-already-in-use': return t('auth.emailInUse');
      case 'auth/wrong-password': return t('auth.wrongPassword');
      case 'auth/user-not-found': return t('auth.userNotFound');
      case 'auth/invalid-credential': return t('auth.wrongPassword');
      case 'auth/too-many-requests': return t('auth.tooManyRequests');
      case 'auth/network-request-failed': return t('auth.networkError');
      case 'auth/googleError': return t('auth.googleError');
      case 'auth/user-disabled': return t('auth.accountSuspended');
      default: return t('auth.error');
    }
  };

  // ── Original onboarding check (preserved exactly) ──
  const checkUserOnboarding = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isSuspended) {
        await auth.signOut();
        setError(t('auth.accountSuspended'));
        return;
      }

      if (docSnap.exists() && docSnap.data().onboardingCompleted) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error("Firestore Error:", err);
      navigate('/');
    }
  };

  // ── Original unique UID generator (preserved exactly) ──
  const generateUniqueNumericUID = async () => {
    let isUnique = false;
    let newUID = '';
    while (!isUnique) {
      newUID = Math.floor(100000 + Math.random() * 900000).toString();
      const q = query(collection(db, "users"), where("numericUID", "==", newUID));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }
    return newUID;
  };

  // ── Original email auth handler (preserved exactly) ──
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isForgotPassword) {
      if (!email) {
        setError(t('auth.invalidEmail'));
        setLoading(false);
        return;
      }
      try {
        const actionCodeSettings = {
          url: `${window.location.origin}/reset-password`,
          handleCodeInApp: true,
        };
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        setMessage(t('auth.resetEmailSent'));
      } catch (err) {
        console.error("Reset Password Error:", err);
        setError(translateError(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().twoFactorEnabled) {
          setShow2FA(true);
          await auth.signOut();
          setLoading(false);
          return;
        }

        await checkUserOnboarding(user);
      } else {
        if (!fullName || !phone || !country) {
          setError(t('auth.error'));
          setLoading(false);
          return;
        }

        const numericUID = await generateUniqueNumericUID();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName,
          email,
          phone,
          country,
          numericUID,
          createdAt: new Date().toISOString(),
          onboardingCompleted: false,
          isSuspended: false
        });

        await sendEmailVerification(userCredential.user);
        setMessage(t('auth.emailVerificationSent'));
        setIsLogin(true);
      }
    } catch (err) {
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Original Google login (preserved exactly) ──
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const numericUID = await generateUniqueNumericUID();
        await setDoc(docRef, {
          fullName: user.displayName,
          email: user.email,
          numericUID,
          createdAt: new Date().toISOString(),
          onboardingCompleted: false,
          isSuspended: false
        });
      }
      await checkUserOnboarding(user);
    } catch (err) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        setError(translateError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Original strength helpers (preserved exactly) ──
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-amber-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return t('auth.strength.weak');
    if (passwordStrength === 2) return t('auth.strength.medium');
    return t('auth.strength.strong');
  };

  // ── Original 2FA handler (preserved exactly) ──
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (verificationCode === '123456') {
      navigate('/');
    } else {
      setError('Invalid verification code. Use 123456 for demo.');
    }
  };

  // ── UI helpers ──
  const switchMode = useCallback(() => {
    if (isForgotPassword) {
      setIsForgotPassword(false);
      setIsLogin(true);
    } else {
      setIsLogin(prev => !prev);
    }
    setError('');
    setMessage('');
    setShowPassword(false);
  }, [isForgotPassword]);

  const pageTitle = isForgotPassword
    ? t('auth.resetPassword')
    : isLogin ? t('auth.welcome') : t('auth.createAccount');

  const pageSub = isForgotPassword
    ? t('auth.resetPasswordSub')
    : isLogin
      ? t('auth.welcomeSub')
      : t('auth.createAccountSub');

  // ── Password eye toggle button ──
  const PasswordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-amber-400 transition-colors"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-black overflow-hidden relative">

      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-amber-600/4 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[5%] w-[200px] h-[200px] bg-amber-400/3 rounded-full blur-[80px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative"
      >
        {/* ── Logo / Brand mark ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <img src={shukritradeLogo} alt="ShükriTrade" className="h-10 sm:h-12 w-auto object-contain" decoding="async" />
          </div>
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto" />
        </motion.div>

        {/* ── Main glass card ── */}
        <div className="relative">
          {/* Card glow border */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent blur-sm pointer-events-none" />

          <div className="relative bg-zinc-950/60 backdrop-blur-3xl border border-white/[0.06] rounded-[2rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)]">

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="px-8 pt-9 pb-8">

              {/* ── Header ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageTitle}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent uppercase tracking-tight mb-2">
                    {pageTitle}
                  </h1>
                  <p className="text-white/35 text-xs font-medium leading-relaxed">{pageSub}</p>
                </motion.div>
              </AnimatePresence>

              {/* ── 2FA Screen ── */}
              <AnimatePresence mode="wait">
                {show2FA ? (
                  <motion.form
                    key="2fa"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleVerify2FA}
                    className="space-y-5"
                  >
                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-7 h-7 text-amber-400" />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-widest text-white mb-1">{t('auth.securityCheck')}</h3>
                      <p className="text-xs text-white/30">{t('auth.enterCode')}</p>
                    </div>

                    <div>
                      <FieldLabel>{t('auth.verificationCode')}</FieldLabel>
                      <input
                        type="text"
                        placeholder="• • • • • •"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full h-14 rounded-xl bg-white/[0.04] border border-white/10 text-center text-2xl tracking-[0.6em] font-black text-white outline-none focus:border-amber-500/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)] transition-all duration-300 text-[16px]"
                        maxLength={6}
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      {t('auth.verifyLogin')}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setShow2FA(false)}
                      className="w-full flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors pt-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      {t('auth.backToLogin')}
                    </button>
                  </motion.form>

                ) : (
                  /* ── Main Auth Form ── */
                  <motion.form
                    key={`form-${isLogin}-${isForgotPassword}`}
                    initial={{ opacity: 0, x: isLogin ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleEmailAuth}
                    className="space-y-4"
                  >

                    {/* ── Signup-only fields ── */}
                    <AnimatePresence>
                      {!isLogin && !isForgotPassword && (
                        <motion.div
                          key="signup-extra"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden space-y-4"
                        >
                          {/* Full Name */}
                          <div>
                            <FieldLabel htmlFor="fullName">{t('auth.fullName')}</FieldLabel>
                            <PremiumInput
                              id="fullName"
                              type="text"
                              placeholder="Ahmed Ali"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              icon={User}
                              required
                              autoComplete="name"
                            />
                          </div>

                          {/* Country */}
                          <div>
                            <FieldLabel htmlFor="country">{t('auth.country')}</FieldLabel>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none z-10">
                                <Globe className="w-4 h-4" />
                              </div>
                              <Select onValueChange={setCountry} value={country}>
                                <SelectTrigger className="w-full h-12 pl-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[16px] font-medium hover:border-white/15 focus:border-amber-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)] transition-all duration-300 outline-none">
                                  <SelectValue placeholder={t('auth.country')} className="text-white/20" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900/95 backdrop-blur-2xl border-white/10 text-white max-h-60 rounded-xl shadow-2xl">
                                  {countries.map((c) => (
                                    <SelectItem key={c.code} value={c.code} className="focus:bg-amber-500/20 focus:text-amber-300 rounded-lg text-sm">
                                      {c.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Phone */}
                          <div>
                            <FieldLabel htmlFor="phone">{t('auth.phone')}</FieldLabel>
                            <div className="flex gap-2">
                              <div className="flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 text-sm text-white/40 font-medium min-w-[72px] h-12 shrink-0">
                                {selectedCountry ? selectedCountry.phone : '+···'}
                              </div>
                              <PremiumInput
                                id="phone"
                                type="tel"
                                placeholder="555 00 00 00"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                icon={Phone}
                                required
                                inputMode="tel"
                                autoComplete="tel"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Email ── */}
                    <div>
                      <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                      <PremiumInput
                        id="email"
                        type="email"
                        placeholder="ahmed@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>

                    {/* ── Password ── */}
                    {!isForgotPassword && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5 pl-0.5">
                          <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-400/70">
                            {t('auth.password')}
                          </label>
                          {isLogin && (
                            <button
                              type="button"
                              onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); }}
                              className="text-[10px] font-bold text-white/30 hover:text-amber-400 transition-colors uppercase tracking-widest"
                            >
                              {t('auth.forgotPassword')}
                            </button>
                          )}
                        </div>
                        <PremiumInput
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          icon={Lock}
                          rightElement={PasswordToggle}
                          required
                          autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />

                        {/* Password strength bar */}
                        <AnimatePresence>
                          {!isLogin && password && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2.5 overflow-hidden"
                            >
                              <div className="flex justify-between text-[9px] uppercase font-black tracking-widest mb-1.5 px-0.5">
                                <span className="text-white/25">{t('auth.passwordStrength')}</span>
                                <span className={
                                  passwordStrength <= 1 ? 'text-red-400' :
                                  passwordStrength === 2 ? 'text-amber-400' :
                                  passwordStrength === 3 ? 'text-blue-400' : 'text-green-400'
                                }>
                                  {getStrengthText()}
                                </span>
                              </div>
                              <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                                  transition={{ duration: 0.4, ease: 'easeOut' }}
                                  className={`h-full rounded-full ${getStrengthColor()}`}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* ── Error / Success feedback ── */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/8 border border-red-500/15 backdrop-blur-sm"
                        >
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-red-300 text-xs font-semibold leading-relaxed">{error}</p>
                        </motion.div>
                      )}
                      {message && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-green-500/8 border border-green-500/15 backdrop-blur-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <p className="text-green-300 text-xs font-semibold leading-relaxed">{message}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Primary action button ── */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.01 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="relative w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 mt-1
                        bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600
                        text-black shadow-lg shadow-amber-500/20
                        hover:shadow-amber-500/35 hover:from-amber-300 hover:to-amber-500
                        disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {/* Shimmer effect */}
                      {!loading && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                          animate={{ translateX: ['−100%', '200%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                        />
                      )}
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {isForgotPassword ? t('auth.resetPassword') : isLogin ? t('auth.login') : t('auth.signup')}
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    {/* ── Divider + Google ── */}
                    {!isForgotPassword && (
                      <>
                        <div className="relative py-1">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.06]" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 bg-zinc-950/60">
                              {t('auth.or')}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={loading}
                          whileHover={!loading ? { scale: 1.01, borderColor: 'rgba(245,158,11,0.3)' } : {}}
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          className="w-full h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          {t('auth.google')}
                        </motion.button>
                      </>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer toggle ── */}
            {!show2FA && (
              <div className="px-8 pb-7 pt-0">
                <div className="border-t border-white/[0.04] pt-5 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-xs text-white/25 font-medium">
                    {isForgotPassword
                      ? t('auth.rememberPassword')
                      : isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                  </span>
                  <motion.button
                    type="button"
                    onClick={switchMode}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-xs font-black text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest"
                  >
                    {isForgotPassword ? t('auth.login') : isLogin ? t('auth.signup') : t('auth.login')}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Trust badges ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-5 mt-6"
        >
          {[t('auth.sslBadge'), t('auth.firebaseBadge'), t('auth.encryptedBadge')].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-white/15">
              <div className="w-1 h-1 rounded-full bg-amber-500/40" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{badge}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
