import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';

const Onboarding = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({
    level: '',
    tradedBefore: '',
    brokers: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if already completed
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().onboardingCompleted) {
          navigate('/');
        }
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          ...answers,
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        });
        navigate('/');
      } catch (err) {
        console.error("Error saving onboarding data:", err);
        // Fallback to home even if firestore fails to not block user
        navigate('/');
      }
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !answers.level;
    if (step === 2) return !answers.tradedBefore;
    if (step === 3) return !answers.brokers;
    return false;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-500">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-black/60 backdrop-blur-2xl border-yellow-500/30 text-white shadow-2xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-yellow-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-yellow-500/60 uppercase tracking-widest">Step {step} of 3</span>
            </div>
            <CardTitle className="text-2xl font-black text-center uppercase tracking-tight">
              {t('onboarding.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Label className="text-lg font-bold text-yellow-500/90">{t('onboarding.level')}</Label>
                  <RadioGroup onValueChange={(val) => setAnswers({...answers, level: val})} value={answers.level} className="grid gap-4">
                    {['beginner', 'intermediate', 'professional'].map((lvl) => (
                      <div key={lvl} className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl border transition-all ${answers.level === lvl ? 'bg-yellow-500/10 border-yellow-500' : 'bg-white/5 border-white/10'}`}>
                        <RadioGroupItem value={lvl} id={lvl} className="border-yellow-500 text-yellow-500" />
                        <Label htmlFor={lvl} className="flex-1 cursor-pointer font-bold">{t(`onboarding.level.${lvl}`)}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Label className="text-lg font-bold text-yellow-500/90">{t('onboarding.tradedBefore')}</Label>
                  <RadioGroup onValueChange={(val) => setAnswers({...answers, tradedBefore: val})} value={answers.tradedBefore} className="grid grid-cols-2 gap-4">
                    {['yes', 'no'].map((opt) => (
                      <div key={opt} className={`flex items-center space-x-3 space-x-reverse p-4 rounded-xl border transition-all ${answers.tradedBefore === opt ? 'bg-yellow-500/10 border-yellow-500' : 'bg-white/5 border-white/10'}`}>
                        <RadioGroupItem value={opt} id={opt} className="border-yellow-500 text-yellow-500" />
                        <Label htmlFor={opt} className="flex-1 cursor-pointer font-bold">{t(`onboarding.${opt}`)}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Label className="text-lg font-bold text-yellow-500/90">{t('onboarding.brokers')}</Label>
                  <Input 
                    placeholder="e.g. MetaTrader, IC Markets, Exness..." 
                    className="bg-white/5 border-white/10 focus:border-yellow-500/50 h-14 text-lg"
                    value={answers.brokers}
                    onChange={(e) => setAnswers({...answers, brokers: e.target.value})}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex gap-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12 border-white/10 bg-white/5 text-white font-bold">
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="flex-[2] h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-lg shadow-lg shadow-yellow-500/20 transition-all"
              >
                {step === 3 ? t('onboarding.finish') : t('onboarding.next')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
