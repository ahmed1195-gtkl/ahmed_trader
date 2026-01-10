import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle2, ChevronRight, Loader2, GraduationCap, Briefcase, BarChart3 } from 'lucide-react';

const Onboarding = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    level: '',
    tradedBefore: '',
    brokers: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/auth');
      } else {
        setUser(currentUser);
        // Check if user already completed onboarding
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().onboardingCompleted) {
            navigate('/');
          }
        } catch (err) {
          console.error("Error checking onboarding status:", err);
        }
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        email: user.email,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      navigate('/');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Fallback to home to not block user
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
    </div>
  );

  const steps = [
    {
      id: 1,
      title: t('onboarding.level'),
      icon: <GraduationCap className="w-8 h-8 text-yellow-500" />,
      options: [
        { id: 'beginner', label: t('onboarding.level.beginner'), desc: 'New to the world of trading' },
        { id: 'intermediate', label: t('onboarding.level.intermediate'), desc: 'Have some basic knowledge' },
        { id: 'professional', label: t('onboarding.level.professional'), desc: 'Experienced trader' }
      ],
      field: 'level'
    },
    {
      id: 2,
      title: t('onboarding.tradedBefore'),
      icon: <BarChart3 className="w-8 h-8 text-yellow-500" />,
      options: [
        { id: 'yes', label: t('onboarding.yes'), desc: 'I have live trading experience' },
        { id: 'no', label: t('onboarding.no'), desc: 'I have never traded before' }
      ],
      field: 'tradedBefore'
    },
    {
      id: 3,
      title: t('onboarding.brokers'),
      icon: <Briefcase className="w-8 h-8 text-yellow-500" />,
      field: 'brokers'
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-yellow-500' : 'w-6 bg-white/10'}`} />
            ))}
          </div>
        </div>

        <Card className="bg-zinc-900/80 backdrop-blur-2xl border-white/5 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-10 md:p-16">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto border border-yellow-500/20 mb-6">
                    {currentStepData.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight">{currentStepData.title}</h2>
                </div>

                {currentStepData.options ? (
                  <div className="grid gap-4">
                    {currentStepData.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFormData({ ...formData, [currentStepData.field]: opt.id });
                          if (step < 3) setStep(step + 1);
                        }}
                        className={`group flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                          formData[currentStepData.field] === opt.id 
                          ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                          : 'bg-white/5 border-white/10 text-white hover:border-yellow-500/50'
                        }`}
                      >
                        <div>
                          <p className="font-black uppercase tracking-widest text-sm mb-1">{opt.label}</p>
                          <p className={`text-xs font-medium ${formData[currentStepData.field] === opt.id ? 'text-black/60' : 'text-gray-500'}`}>{opt.desc}</p>
                        </div>
                        {formData[currentStepData.field] === opt.id && <CheckCircle2 className="w-6 h-6" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid gap-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500/50 ml-1">Your Experience</Label>
                      <Input
                        placeholder="Ex: Exness, XM, IC Markets..."
                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-yellow-500/50 transition-all"
                        value={formData.brokers}
                        onChange={(e) => setFormData({ ...formData, brokers: e.target.value })}
                      />
                    </div>
                    <Button 
                      onClick={handleFinish} 
                      disabled={loading || !formData.brokers}
                      className="w-full h-16 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 shadow-xl shadow-yellow-500/20 transition-all active:scale-95"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          {t('onboarding.finish')}
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {step > 1 && !loading && (
                  <button onClick={() => setStep(step - 1)} className="w-full text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">
                    Go Back
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
