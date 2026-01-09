import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    switch (code) {
      case 'auth/weak-password': return t('auth.weakPassword');
      case 'auth/invalid-email': return t('auth.invalidEmail');
      case 'auth/email-already-in-use': return t('auth.emailInUse');
      case 'auth/wrong-password': return t('auth.wrongPassword');
      case 'auth/user-not-found': return t('auth.userNotFound');
      case 'auth/invalid-credential': return t('auth.wrongPassword');
      case 'auth/too-many-requests': return t('auth.tooManyRequests');
      case 'auth/network-request-failed': return t('auth.networkError');
      case 'auth/popup-closed-by-user': return t('auth.googleError');
      default: return err.message || t('auth.error');
    }
  };

  const checkUserOnboarding = async (user) => {
    console.log("Checking onboarding for user:", user.uid);
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log("Firestore doc exists:", docSnap.exists());
      if (docSnap.exists()) {
        console.log("User data:", docSnap.data());
        if (docSnap.data().onboardingCompleted) {
          console.log("Onboarding completed, navigating to home");
          navigate('/');
        } else {
          console.log("Onboarding NOT completed, navigating to onboarding");
          navigate('/onboarding');
        }
      } else {
        console.log("No user doc found, navigating to onboarding");
        navigate('/onboarding');
      }
    } catch (err) {
      console.error("Error checking onboarding:", err);
      // If Firestore fails, we still want to let the user in
      navigate('/');
    }
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
        // Use custom action code settings to redirect to our site's reset page
        const actionCodeSettings = {
          url: window.location.origin + '/reset-password',
          handleCodeInApp: true,
        };
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        setMessage(t('auth.resetEmailSent'));
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err) {
        setError(translateError(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!isLogin) {
      if (!fullName || !phone || !country) {
        setError(t('auth.error'));
        setLoading(false);
        return;
      }
      if (passwordStrength < 2) {
        setError(t('auth.weakPassword'));
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        console.log("Attempting login for:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful, checking onboarding for:", userCredential.user.uid);
        await checkUserOnboarding(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        
        // Create initial user doc in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName,
          email,
          phone,
          country,
          createdAt: new Date().toISOString(),
          onboardingCompleted: false
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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not create basic profile
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullName: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          onboardingCompleted: false
        });
      }
      
      await checkUserOnboarding(user);
    } catch (err) {
      setError(translateError(err));
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
              {!isLogin && !isForgotPassword && (
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
