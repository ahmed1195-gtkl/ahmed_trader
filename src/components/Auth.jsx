import { useState, useMemo, useEffect } from 'react';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';

const Auth = () => {
  const { t } = useTranslation();
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
  const navigate = useNavigate();

  const selectedCountry = useMemo(() => {
    return countries.find(c => c.code === country);
  }, [country]);

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

  const translateError = (err) => {
    const code = err.code;
    const message = err.message;
    console.error("Auth Error Details:", { code, message });
    
    // Check for specific Firebase configuration errors
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
      // Fallback: if firestore fails, just go to home to not block the user
      navigate('/');
    }
  };

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
        // Explicitly set the continue URL to our reset-password page
        const actionCodeSettings = {
          url: `${window.location.origin}/reset-password`,
          handleCodeInApp: true,
        };
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        setMessage(t('auth.resetEmailSent'));
        // Don't switch back immediately so user can read the message
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
        
        // Check for 2FA
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
        // Check if user exists in Firestore and is suspended
        // Note: In a real scenario, we'd check a 'suspended' flag in Firestore
        // because Firebase Auth 'createUser' will fail if the email exists in Auth,
        // but if the user was deleted from Auth but kept in Firestore as 'suspended',
        // we can block them here.
        
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Try popup first, if it fails or is blocked, we can handle it
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
        // Fallback to redirect if popup is blocked
        await signInWithRedirect(auth, googleProvider);
      } else {
        setError(translateError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return t('auth.strength.weak');
    if (passwordStrength === 2) return t('auth.strength.medium');
    return t('auth.strength.strong');
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (verificationCode === '123456') {
      // In a real app, you'd use a custom token or MFA provider
      // For this UI demo, we'll just proceed to home
      navigate('/');
    } else {
      setError('Invalid verification code. Use 123456 for demo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/60 backdrop-blur-2xl border-yellow-500/30 text-white shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent uppercase tracking-tighter">
              {isForgotPassword ? t('auth.resetPassword') : (isLogin ? t('auth.welcome') : t('auth.createAccount'))}
            </CardTitle>
            <CardDescription className="text-gray-400 font-medium">
              {isForgotPassword ? t('auth.email') : (isLogin ? t('hero.description').substring(0, 60) + '...' : t('benefits.title'))}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <AnimatePresence mode="wait">
              {show2FA ? (
                <motion.form
                  key="2fa-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerify2FA}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-black uppercase text-white">Security Check</h3>
                    <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code sent to your device.</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest">Verification Code</Label>
                    <Input 
                      type="text" 
                      placeholder="123456" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="text-center text-2xl tracking-[0.5em] font-black bg-white/5 border-white/10 focus:border-yellow-500/50 h-16 text-white"
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest"
                  >
                    Verify & Login
                  </Button>
                  <button 
                    type="button" 
                    onClick={() => setShow2FA(false)}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
                  >
                    Back to Login
                  </button>
                </motion.form>
              ) : !isLogin && !isForgotPassword && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="fullName">{t('auth.fullName')}</Label>
                    <Input id="fullName" type="text" placeholder="Ahmed Ali" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="country">{t('auth.country')}</Label>
                    <Select onValueChange={setCountry} value={country}>
                      <SelectTrigger className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11">
                        <SelectValue placeholder={t('auth.country')} />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/20 text-white max-h-60">
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code} className="focus:bg-yellow-500 focus:text-black">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="phone">{t('auth.phone')}</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-md px-3 text-sm text-gray-400 min-w-[70px]">
                        {selectedCountry ? selectedCountry.phone : '+...'}
                      </div>
                      <Input id="phone" type="tel" placeholder="555 00 00 00" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11 flex-1" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-2">
              <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" placeholder="ahmed@example.com" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {!isForgotPassword && (
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="password">{t('auth.password')}</Label>
                  {isLogin && (
                    <button onClick={() => setIsForgotPassword(true)} className="text-xs text-yellow-500/60 hover:text-yellow-500 transition-colors">
                      {t('auth.forgotPassword')}
                    </button>
                  )}
                </div>
                <Input id="password" type="password" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {!isLogin && password && (
                  <div className="mt-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                      <span className="text-gray-500">{t('auth.passwordStrength')}</span>
                      <span className={passwordStrength <= 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500'}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                        className={`h-full ${getStrengthColor()}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</motion.p>}
            {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20">{message}</motion.p>}

            <Button 
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-lg shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
            >
              {loading ? "..." : (isForgotPassword ? t('auth.resetPassword') : (isLogin ? t('auth.login') : t('auth.signup')))}
            </Button>

            {!isForgotPassword && (
              <>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/40 px-4 text-gray-500 font-bold">{t('auth.or')}</span></div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {t('auth.google')}
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-2 pb-8">
            <p className="text-sm text-gray-400">
              {isForgotPassword ? "" : (isLogin ? t('auth.noAccount') : t('auth.hasAccount'))}
            </p>
            <button 
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                  setIsLogin(true);
                } else {
                  setIsLogin(!isLogin);
                }
                setError('');
                setMessage('');
              }} 
              className="text-sm text-yellow-500 font-bold hover:underline"
            >
              {isForgotPassword ? t('auth.login') : (isLogin ? t('auth.signup') : t('auth.login'))}
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
