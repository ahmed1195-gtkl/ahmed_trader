import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
        setError(t('auth.tooManyRequests')); // Generic error for invalid link
        setVerifying(false);
      });
  }, [oobCode, t]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('auth.wrongPassword')); // Or a specific "passwords don't match" key
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
      setMessage(t('auth.resetPassword') + ' ' + t('auth.success') || 'Password reset successful!');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-500">Verifying link...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black/60 backdrop-blur-2xl border-yellow-500/30 text-white shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black text-yellow-500 uppercase tracking-tighter">
              {t('auth.resetPassword')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isCodeValid ? 'Enter your new password below' : 'This link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isCodeValid ? (
              <form onSubmit={handleReset} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-white/5 border-white/10" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="bg-white/5 border-white/10" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                {message && <p className="text-green-400 text-xs font-bold">{message}</p>}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black font-black hover:bg-yellow-400"
                >
                  {loading ? '...' : t('auth.resetPassword')}
                </Button>
              </form>
            ) : (
              <Button onClick={() => navigate('/auth')} className="w-full bg-white/10 text-white">
                Back to Login
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
