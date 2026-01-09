import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countries = useMemo(() => [
    { code: 'DZ', name: 'Algeria' }, { code: 'BH', name: 'Bahrain' }, { code: 'EG', name: 'Egypt' },
    { code: 'IQ', name: 'Iraq' }, { code: 'JO', name: 'Jordan' }, { code: 'KW', name: 'Kuwait' },
    { code: 'LB', name: 'Lebanon' }, { code: 'LY', name: 'Libya' }, { code: 'MA', name: 'Morocco' },
    { code: 'OM', name: 'Oman' }, { code: 'PS', name: 'Palestine' }, { code: 'QA', name: 'Qatar' },
    { code: 'SA', name: 'Saudi Arabia' }, { code: 'SD', name: 'Sudan' }, { code: 'SY', name: 'Syria' },
    { code: 'TN', name: 'Tunisia' }, { code: 'AE', name: 'United Arab Emirates' }, { code: 'YE', name: 'Yemen' },
    { code: 'FR', name: 'France' }, { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' },
    { code: 'TR', name: 'Turkey' }, { code: 'DE', name: 'Germany' }, { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' }, { code: 'CA', name: 'Canada' }
  ], []);

  const translateError = (errorCode) => {
    switch (errorCode) {
      case 'auth/weak-password': return t('auth.weakPassword');
      case 'auth/invalid-email': return t('auth.invalidEmail');
      case 'auth/email-already-in-use': return t('auth.emailInUse');
      case 'auth/wrong-password': return t('auth.wrongPassword');
      case 'auth/user-not-found': return t('auth.userNotFound');
      case 'auth/too-many-requests': return t('auth.tooManyRequests');
      case 'auth/network-request-failed': return t('auth.networkError');
      default: return t('auth.error');
    }
  };

  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(pass);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!isLogin) {
      if (!fullName || !phone || !country) {
        setError(t('auth.error')); // Generic error for missing fields
        setLoading(false);
        return;
      }
      if (!validatePassword(password)) {
        setError(t('auth.weakPassword'));
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError(t('auth.verifyEmail'));
          await sendEmailVerification(userCredential.user);
          setLoading(false);
          return;
        }
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        await sendEmailVerification(userCredential.user);
        setMessage(t('auth.verifyEmail'));
        setIsLogin(true);
      }
    } catch (err) {
      setError(translateError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(translateError(err.code));
    }
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
              {isLogin ? t('auth.welcome') : t('auth.createAccount')}
            </CardTitle>
            <CardDescription className="text-gray-400 font-medium">
              {isLogin ? t('hero.description').substring(0, 60) + '...' : t('benefits.title')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
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
                    <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="phone">{t('auth.phone')}</Label>
                    <Input id="phone" type="tel" placeholder="+213 555 00 00 00" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-2">
              <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" placeholder="ahmed@example.com" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label className="text-yellow-500/80 font-bold text-xs uppercase tracking-widest" htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</motion.p>}
            {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20">{message}</motion.p>}

            <Button 
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-lg shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
            >
              {loading ? "..." : (isLogin ? t('auth.login') : t('auth.signup'))}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/40 px-4 text-gray-500 font-bold">Or</span></div>
            </div>

            <Button variant="outline" onClick={handleGoogleLogin} className="w-full h-11 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('auth.google')}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 pb-8">
            <div className="text-sm text-gray-400 font-medium">{isLogin ? t('auth.noAccount') : t('auth.hasAccount')}</div>
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-sm font-black text-yellow-500 hover:text-yellow-400 underline-offset-4 hover:underline uppercase tracking-wider">
              {isLogin ? t('auth.signup') : t('auth.login')}
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
