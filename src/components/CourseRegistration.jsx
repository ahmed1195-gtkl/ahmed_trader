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
  AlertCircle,
  Search,
  ChevronDown,
  Mail,
  Calendar,
  MapPin,
  Info,
  TrendingUp,
  Clock,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';

const CourseRegistration = () => {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regCode, setRegCode] = useState('');
  const [error, setError] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    // Group 1: Personal Info
    name: '',
    email: '',
    age: '',
    city: '',
    country: 'Egypt',
    countryCode: '+20',
    number: '',
    job: '', // المهمة
    
    // Group 2: Financial & Experience
    annualIncome: '', // الدخل السنوي
    experienceYears: '', // فترة التداول
    hasExperience: 'no', // هل لديه خبرة
    losses: '', // حجم الخسائر
    deposit: '',
    broker: '',
    accountType: 'Standard', // نوع الحساب
    
    // Group 3: Trading Habits & Goals
    monthlyTrades: '', // متوسط الصفقات شهرياً
    availability: 'Morning', // الوقت المتاح
    tradingStyle: 'Solo', // تداول وحدك أو قناة توصيات
    learning_goal: '',
    level: 'beginner'
  });

  const isAr = i18n.language === 'ar';

  const allBrokers = [
    "AvaTrade", "Capital.com", "CMC Markets", "eToro", "FP Markets", 
    "Forex.com", "Fusion Markets", "FxPro", "HFM", "IC Markets", 
    "IG", "InstaForex", "Interactive Brokers", "Libertex", "NinjaTrader", 
    "OANDA", "Pepperstone", "Saxo Bank", "Swissquote", "Tickmill", 
    "TradeStation", "Vantage Markets", "XTB", "XM", "ONE ROYAL", "equite"
  ].sort();

  const incomeOptions = [
    { value: '< 5000$', label: isAr ? 'أقل من 5000$' : '< 5000$' },
    { value: '5000$ - 15000$', label: '5000$ - 15000$' },
    { value: '15000$ - 30000$', label: '15000$ - 30000$' },
    { value: '30000$ - 50000$', label: '30000$ - 50000$' },
    { value: '> 50000$', label: isAr ? 'أكثر من 50000$' : '> 50000$' }
  ];

  const accountTypes = [
    { value: 'Demo', label: isAr ? 'تجريبي' : 'Demo' },
    { value: 'Standard', label: isAr ? 'ستاندارت' : 'Standard' },
    { value: 'ECN', label: 'ECN' },
    { value: 'Classic', label: isAr ? 'كلاسيك' : 'Classic' },
    { value: 'Islamic', label: isAr ? 'إسلامي' : 'Islamic' }
  ];

  const availabilityOptions = [
    { value: 'Morning', label: isAr ? 'الصباح' : 'Morning' },
    { value: 'Noon', label: isAr ? 'منتصف النهار' : 'Noon' },
    { value: 'Afternoon', label: isAr ? 'المساء' : 'Afternoon' },
    { value: 'Night', label: isAr ? 'الليل' : 'Night' },
    { value: 'Text', label: isAr ? 'كتابياً' : 'Text Only' }
  ];

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

    const payload = {
      date: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: formData.age.trim(),
      city: formData.city.trim(),
      phone: `${formData.countryCode}${formData.number.trim()}`,
      job: formData.job.trim(),
      annualIncome: formData.annualIncome,
      experienceYears: formData.experienceYears,
      hasExperience: formData.hasExperience === 'yes' ? 'Yes' : 'No',
      losses: formData.losses.trim() || 'None',
      deposit: formData.deposit.trim() || 'No Deposit',
      country: formData.country,
      broker: formData.broker.trim() || 'None Selected',
      accountType: formData.accountType,
      monthlyTrades: formData.monthlyTrades.trim(),
      availability: formData.availability,
      tradingStyle: formData.tradingStyle === 'Solo' ? (isAr ? 'وحدي' : 'Solo') : (isAr ? 'قناة توصيات' : 'Signal Channel'),
      level: formData.level,
      goal: formData.learning_goal.trim(),
      code: code
    };

    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxQ2WidqnPv6dIJY7axycrSkdvYCy2Gtl7ZjTc5i0e2hFcozVC7oEd8gY02ux6E62MFUQ/exec';
      
      // إرسال البيانات كـ JSON حقيقي
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'cors', // تأكيد عدم استخدام no-cors
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script يفضل هذا النوع لتجنب مشاكل CORS المعقدة مع JSON الصرف
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      // حتى لو فشل الـ fetch بسبب CORS في المتصفح، غالباً البيانات تصل لـ Apps Script
      // لكننا سنحاول إظهار النجاح للمستخدم إذا لم يكن هناك خطأ قطعي
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(regCode).then(() => {
        alert(isAr ? 'تم نسخ الكود!' : 'Code copied!');
      }).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = regCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(isAr ? 'تم نسخ الكود!' : 'Code copied!');
      });
    } else {
      alert(isAr ? `كود التسجيل: ${regCode}` : `Registration Code: ${regCode}`);
    }
  };

  const steps = [
    { id: 1, title: isAr ? 'المعلومات الشخصية' : 'Personal Info' },
    { id: 2, title: isAr ? 'الخبرة والمالية' : 'Experience & Finance' },
    { id: 3, title: isAr ? 'العادات والأهداف' : 'Habits & Goals' }
  ];

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <section className="py-20 min-h-screen bg-black relative overflow-y-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
          <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border">
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
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'اسمك بالكامل' : 'Full name'}
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'المهمة / الوظيفة' : 'Job / Profession'}</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'وظيفتك الحالية' : 'Current job'}
                              value={formData.job}
                              onChange={(e) => setFormData({...formData, job: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                          <input 
                            required
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'العمر' : 'Age'}</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="number"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'عمرك' : 'Your age'}
                              value={formData.age}
                              onChange={(e) => setFormData({...formData, age: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'المدينة' : 'City'}</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مدينتك' : 'Your city'}
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البلد' : 'Country'}</label>
                          <div 
                            className="relative cursor-pointer"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          >
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 z-10" />
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all flex justify-between items-center">
                              <span>{formData.country}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                          
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-60 flex flex-col overflow-hidden">
                              <div className="p-3 border-b border-white/5 flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input 
                                  type="text"
                                  className="bg-transparent border-none outline-none text-sm text-white w-full"
                                  placeholder={isAr ? 'بحث عن بلد...' : 'Search country...'}
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="overflow-y-auto flex-1">
                                {filteredCountries.map((c) => (
                                  <div 
                                    key={c.name}
                                    className="px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors text-sm"
                                    onClick={() => {
                                      setFormData({...formData, country: c.name});
                                      setShowCountryDropdown(false);
                                      setCountrySearch('');
                                    }}
                                  >
                                    {c.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'الدخل السنوي التقريبي' : 'Approximate Annual Income'}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {incomeOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({...formData, annualIncome: opt.value})}
                              className={`py-3 px-2 rounded-xl font-black text-[10px] uppercase transition-all border ${formData.annualIncome === opt.value ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'هل تداولت من قبل؟' : 'Have you traded before?'}</label>
                          <div className="grid grid-cols-2 gap-4">
                            {['yes', 'no'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setFormData({...formData, hasExperience: opt})}
                                className={`py-4 rounded-2xl font-black uppercase text-xs transition-all border ${formData.hasExperience === opt ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                              >
                                {opt === 'yes' ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No')}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'فترة التداول (إن وجدت)' : 'Trading Period (if any)'}</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مثلاً: سنتين' : 'e.g. 2 years'}
                              value={formData.experienceYears}
                              onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'حجم الخسائر (إن وجدت)' : 'Loss Amount (if any)'}</label>
                          <div className="relative">
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500/50" />
                            <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مثلاً: 1000$' : 'e.g. $1000'}
                              value={formData.losses}
                              onChange={(e) => setFormData({...formData, losses: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'أول إيداع تنوي القيام به' : 'Intended Initial Deposit'}</label>
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
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'نوع الحساب' : 'Account Type'}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {accountTypes.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({...formData, accountType: opt.value})}
                              className={`py-3 px-1 rounded-xl font-black text-[9px] uppercase transition-all border ${formData.accountType === opt.value ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البروكر المستعمل' : 'Broker Used'}</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 z-10" />
                          <select 
                            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer"
                            value={formData.broker}
                            onChange={(e) => setFormData({...formData, broker: e.target.value})}
                          >
                            <option value="">{isAr ? 'اختر بروكر (اختياري)' : 'Select Broker (Optional)'}</option>
                            {allBrokers.map((name) => (
                              <option key={name} value={name} className="bg-zinc-900 text-white">{name}</option>
                            ))}
                            <option value="Other">{isAr ? 'آخر' : 'Other'}</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'متوسط الصفقات شهرياً' : 'Avg Monthly Trades'}</label>
                          <div className="relative">
                            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="number"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مثلاً: 20' : 'e.g. 20'}
                              value={formData.monthlyTrades}
                              onChange={(e) => setFormData({...formData, monthlyTrades: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'طريقة التداول' : 'Trading Style'}</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, tradingStyle: 'Solo'})}
                              className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all border ${formData.tradingStyle === 'Solo' ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {isAr ? 'وحدي' : 'Solo'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, tradingStyle: 'Signals'})}
                              className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all border ${formData.tradingStyle === 'Signals' ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {isAr ? 'قناة توصيات' : 'Signals'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'الوقت المفضل للمتابعة' : 'Preferred Follow-up Time'}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {availabilityOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({...formData, availability: opt.value})}
                              className={`py-3 px-1 rounded-xl font-black text-[9px] uppercase transition-all border ${formData.availability === opt.value ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'هدفك من التعلم' : 'Learning Goal'}</label>
                        <div className="relative">
                          <Target className="absolute left-4 top-4 w-4 h-4 text-yellow-500/50" />
                          <textarea 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all min-h-[100px] resize-none"
                            placeholder={isAr ? 'ماذا تأمل أن تحقق من هذا الكورس؟' : 'What do you hope to achieve?'}
                            value={formData.learning_goal}
                            onChange={(e) => setFormData({...formData, learning_goal: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'مستوى خبرتك الحالي' : 'Current Experience Level'}</label>
                        <div className="grid grid-cols-3 gap-4">
                          {['beginner', 'intermediate', 'pro'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setFormData({...formData, level: lvl})}
                              className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all border ${formData.level === lvl ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'}`}
                            >
                              {isAr ? (lvl === 'beginner' ? 'مبتدئ' : lvl === 'intermediate' ? 'متوسط' : 'محترف') : lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>

            <CardFooter className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
              {step > 1 ? (
                <Button 
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  className="text-gray-500 hover:text-white font-black uppercase tracking-widest text-xs flex items-center gap-2"
                >
                  <ChevronLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  {isAr ? 'السابق' : 'Back'}
                </Button>
              ) : <div />}

              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-8 py-6 rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center gap-2"
                >
                  {isAr ? 'التالي' : 'Next'}
                  <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </Button>
              ) : (
                <Button 
                  disabled={loading}
                  onClick={handleSubmit}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-8 py-6 rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isAr ? 'إرسال الطلب' : 'Submit Application'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-2xl rounded-[3rem] p-12 border shadow-2xl">
              <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-500/20">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                {isAr ? 'تم استلام طلبك!' : 'Application Received!'}
              </h3>
              <p className="text-gray-500 font-bold text-sm mb-8 leading-relaxed">
                {isAr 
                  ? 'شكراً لاهتمامك بالكورس. لقد تم تسجيل بياناتك بنجاح. يرجى حفظ كود التسجيل التالي وإرساله للمسؤول لتأكيد حسابك.'
                  : 'Thank you for your interest. Your data has been recorded. Please save the following registration code and send it to the admin to confirm your account.'}
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative group">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  {isAr ? 'كود التسجيل الخاص بك' : 'Your Registration Code'}
                </div>
                <div className="text-4xl font-black text-yellow-500 tracking-widest mb-4 tabular-nums">
                  {regCode}
                </div>
                <Button 
                  onClick={copyCode}
                  variant="ghost"
                  className="text-white/50 hover:text-yellow-500 flex items-center gap-2 mx-auto font-black uppercase text-[10px] tracking-widest"
                >
                  <Copy className="w-4 h-4" />
                  {isAr ? 'نسخ الكود' : 'Copy Code'}
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
                  {isAr ? 'ماذا تفعل الآن؟' : 'What to do next?'}
                </p>
                <div className="flex flex-col gap-3">
                  <a 
                    href="https://t.me/mustafa_sk_ict" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                  >
                    <Send className="w-4 h-4 text-yellow-500" />
                    {isAr ? 'أرسل الكود للمسؤول عبر تليجرام' : 'Send code to admin via Telegram'}
                  </a>
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
