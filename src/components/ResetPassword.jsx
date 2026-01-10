import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();
  
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or missing reset code.');
      setVerifying(false);
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => {
        setIsCodeValid(true);
        setVerifying(false);
      })
      .catch((err) => {
        console.error(err);
        setError(t('auth.tooManyRequests'));
        setVerifying(false);
      });
  }, [oobCode, t]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.weakPassword'));
      return;
    }

    setError('');
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage(t('auth.success'));
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <p className="text-yellow-500 font-black uppercase tracking-widest text-xs">Verifying Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-zinc-900/80 backdrop-blur-2xl border-white/5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
              <Lock className="w-8 h-8 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
              {t('auth.resetPassword')}
            </CardTitle>
            <CardDescription className="text-gray-500 font-medium">
              {isCodeValid ? 'Secure your account with a new password' : 'This link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <AnimatePresence mode="wait">
              {isCodeValid ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleReset} 
                  className="grid gap-6"
                >
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.password')}</Label>
                    <Input 
                      type="password" 
                      className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{t('auth.confirmPassword')}</Label>
                    <Input 
                      type="password" 
                      className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 transition-all font-bold" 
                      placeholder="••••••••"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                    />
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {message && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {message}
                    </motion.div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-14 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.resetPassword')}
                  </Button>
                </motion.form>
              ) : (
                <motion.div 
                  key="invalid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold mb-8">
                    {error || 'The password reset link is no longer valid.'}
                  </div>
                  <Button asChild className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10">
                    <Link to="/auth">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
