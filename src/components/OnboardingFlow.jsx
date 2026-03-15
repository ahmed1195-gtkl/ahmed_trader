import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import DemoAccountSetup from './DemoAccountSetup';
import JoinChallengeWithCode from './JoinChallengeWithCode';

/**
 * مكون تدفق التسجيل الموحد
 * يوجه المستخدم خلال الخطوات التالية بالترتيب:
 * 1. ربط الحساب التجريبي (إلزامي)
 * 2. الانضمام للتحدي بكود الدعوة (اختياري)
 */
function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasDemoAccount, setHasDemoAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // فحص حالة الحساب التجريبي عند التحميل
  useEffect(() => {
    const checkDemoAccountStatus = async () => {
      if (!currentUser) {
        navigate('/auth');
        return;
      }

      try {
        // فحص إذا كان المستخدم لديه حساب تجريبي مربوط
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        
        if (userData?.demoAccountId) {
          setHasDemoAccount(true);
          setCurrentStep(2); // الانتقال للخطوة الثانية
        }
      } catch (error) {
        console.error('Error checking demo account:', error);
      } finally {
        setLoading(false);
      }
    };

    checkDemoAccountStatus();
  }, [currentUser, navigate]);

  const steps = [
    {
      id: 1,
      title: 'ربط الحساب التجريبي',
      description: 'قم بربط حساب MT4/MT5 التجريبي الخاص بك',
      required: true
    },
    {
      id: 2,
      title: 'الانضمام للتحدي',
      description: 'أدخل كود الدعوة للانضمام إلى تحدي (اختياري)',
      required: false
    }
  ];

  const handleDemoAccountComplete = () => {
    setHasDemoAccount(true);
    setCurrentStep(2);
  };

  const handleSkipChallenge = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="bg-gray-900 border-b border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            إعداد حسابك
          </h2>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      currentStep > step.id
                        ? 'bg-green-500 border-green-500'
                        : currentStep === step.id
                        ? 'bg-amber-500 border-amber-500'
                        : 'bg-gray-800 border-gray-700'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{step.id}</span>
                    )}
                  </motion.div>
                  
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {step.required ? '(إلزامي)' : '(اختياري)'}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DemoAccountSetup onComplete={handleDemoAccountComplete} />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2">هل لديك كود دعوة للانضمام إلى تحدي؟</h3>
              <p className="text-gray-400 mb-4">
                إذا كان لديك كود دعوة من أحد المنظمين، يمكنك الانضمام الآن. أو تخطي هذه الخطوة والانضمام لاحقاً.
              </p>
            </div>

            <JoinChallengeWithCode />

            <div className="mt-6 text-center">
              <button
                onClick={handleSkipChallenge}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
              >
                تخطي والذهاب للصفحة الرئيسية
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default OnboardingFlow;
