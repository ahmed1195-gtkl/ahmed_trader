import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { countries } from '../data/countries';
import { 
  User, 
  Globe, 
  Phone, 
  DollarSign, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  Copy, 
  Send,
  Loader2,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

const CourseRegistration = () => {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regCode, setRegCode] = useState('');
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: 'Egypt',
    countryCode: '+20',
    number: '',
    deposit: '',
    broker: '',
    experience: 'no',
    learning_goal: '',
    level: 'beginner'
  });

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, countryCode: selectedCountry.phone }));
    }
  }, [formData.country]);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'AT-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    
    const code = generateCode();
    setRegCode(code);

    // تجهيز البيانات للإرسال إلى Google Sheets باستخدام URLSearchParams لضمان التوافق
    const params = new URLSearchParams();
    params.append('name', formData.name.trim());
    params.append('number', `${formData.countryCode}${formData.number.trim()}`);
    params.append('deposit', formData.deposit.trim() || 'No Deposit');
    params.append('country', formData.country);
    params.append('broker', formData.broker.trim() || 'No Broker');
    params.append('learning_goal', formData.learning_goal.trim());
    params.append('registration_date', new Date().toLocaleString('en-GB', { timeZone: 'UTC' }));
    params.append('experience', formData.experience === 'yes' ? 'Experienced' : 'Beginner');
    params.append('activation_code', code);

    try {
      // تحديث الرابط إلى الرابط الجديد المزود من قبل المستخدم
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwoBwLPAHdMGr7Ls6VPaImIuCRGFyAh0suhlbsqGQQFefl4We8vtCnG7tMjVCTY7jVZmg/exec';
      
      // تغيير وضع الإرسال إلى cors لضمان معالجة أفضل للاستجابة
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      // ننتظر ثانية واحدة لضمان وصول البيانات قبل عرض صفحة النجاح
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(isAr ? 'عذراً، فشل إرسال البيانات. يرجى المحاولة مرة أخرى.' : 'Sorry, data submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(regCode);
    alert(isAr ? 'تم نسخ الكود!' : 'Code copied!');
  };

  const isAr = i18n.language === 'ar';

  const steps = [
    { id: 1, title: isAr ? 'المعلومات الشخصية' : 'Personal Info' },
    { id: 2, title: isAr ? 'الخبرة المالية' : 'Financial Experience' },
    { id: 3, title: isAr ? 'أهداف التعلم' : 'Learning Goals' }
  ];

  return (
    <section className="py-20 min-h-screen bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4"
          >
            {isAr ? 'التسجيل في' : 'Register for'} <span className="text-yellow-500">{isAr ? 'الكورس' : 'The Course'}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-bold uppercase tracking-widest text-xs"
          >
            {isAr ? 'ابدأ رحلتك في عالم التداول الاحترافي' : 'Start your journey in professional trading'}
          </motion.p>
        </div>

        {!submitted ? (
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 p-8">
              <div className="flex justify-between items-center">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= s.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${step >= s.id ? 'text-white' : 'text-gray-600'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-xs font-bold mb-6"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}
                  
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                          <input 
                            required
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                            placeholder={isAr ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البلد' : 'Country'}</label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 z-10" />
                            <select 
                              required
                              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer"
                              value={formData.country}
                              onChange={(e) => setFormData({...formData, country: e.target.value})}
                            >
                              {countries.map((c) => (
                                <option key={c.code} value={c.name} className="bg-zinc-900 text-white">
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                          <div className="flex gap-2">
                            <div className="relative w-24 shrink-0">
                              <input 
                                readOnly
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-3 text-center text-yellow-500 font-bold outline-none"
                                value={formData.countryCode}
                              />
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                              <input 
                                required
                                type="tel"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                placeholder="123456789"
                                value={formData.number}
                                onChange={(e) => setFormData({...formData, number: e.target.value.replace(/\D/g, '')})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'أول إيداع (إن وجد)' : 'Initial Deposit (if any)'}</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder="e.g. $500"
                              value={formData.deposit}
                              onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البروكر المستعمل' : 'Broker Used'}</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder="e.g. Exness, XM"
                              value={formData.broker}
                              onChange={(e) => setFormData({...formData, broker: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'هل تداولت من قبل؟' : 'Have you traded before?'}</label>
                        <div className="grid grid-cols-2 gap-4">
                          {['yes', 'no'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setFormData({...formData, experience: opt})}
                              className={`py-4 rounded-2xl font-black uppercase text-xs transition-all border ${formData.experience === opt ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {opt === 'yes' ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isAr ? -20 : 20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'هدفك من التعلم' : 'Learning Goal'}</label>
                        <div className="relative">
                          <Target className="absolute left-4 top-4 w-4 h-4 text-yellow-500/50" />
                          <textarea 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all min-h-[100px] resize-none"
                            placeholder={isAr ? 'ماذا تريد أن تحقق؟' : 'What do you want to achieve?'}
                            value={formData.learning_goal}
                            onChange={(e) => setFormData({...formData, learning_goal: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'مستواك الحالي' : 'Current Level'}</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'beginner', ar: 'مبتدئ', en: 'Beginner' },
                            { id: 'intermediate', ar: 'متوسط', en: 'Intermediate' },
                            { id: 'pro', ar: 'محترف', en: 'Pro' }
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => setFormData({...formData, level: lvl.id})}
                              className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all border ${formData.level === lvl.id ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {isAr ? lvl.ar : lvl.en}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>

            <CardFooter className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-between">
              {step > 1 ? (
                <Button 
                  onClick={() => setStep(step - 1)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white font-black uppercase tracking-widest gap-2"
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  {isAr ? 'السابق' : 'Back'}
                </Button>
              ) : <div />}

              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!formData.name || !formData.country || !formData.number)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest px-8 h-12 rounded-xl gap-2"
                >
                  {isAr ? 'التالي' : 'Next'}
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.learning_goal}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-widest px-10 h-12 rounded-xl gap-2 shadow-lg shadow-yellow-500/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? 'إرسال الطلب' : 'Submit Request')}
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-zinc-900/40 border-yellow-500/20 backdrop-blur-xl rounded-[3rem] overflow-hidden text-center p-12 shadow-2xl">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-500/20">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                {isAr ? 'تم استلام طلبك!' : 'Request Received!'}
              </h3>
              <p className="text-gray-400 mb-10 font-medium">
                {isAr 
                  ? 'شكراً لتسجيلك. يرجى حفظ الكود التالي وإرساله لنا عبر قنوات التواصل لتأكيد تسجيلك.' 
                  : 'Thank you for registering. Please save the following code and send it to us via our contact channels to confirm your registration.'}
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-10 relative group">
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-2">
                  {isAr ? 'كود التسجيل الخاص بك' : 'YOUR REGISTRATION CODE'}
                </p>
                <p className="text-4xl md:text-5xl font-black text-white tracking-widest font-mono">
                  {regCode}
                </p>
                <Button 
                  onClick={copyCode}
                  variant="ghost"
                  className="absolute top-4 right-4 text-gray-500 hover:text-yellow-500"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  {isAr ? 'تواصل معنا الآن' : 'CONTACT US NOW'}
                </p>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => window.open('https://t.me/ahmed_trader_123', '_blank')}
                    className="bg-[#0088cc] hover:bg-[#0088cc]/80 text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl gap-2"
                  >
                    <Send className="w-4 h-4" /> Telegram
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CourseRegistration;
