import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Globe, MapPin, Calendar, Briefcase, 
  TrendingUp, DollarSign, Clock, Target, Activity, 
  ChevronRight, ChevronLeft, Send, CheckCircle2, AlertCircle,
  Loader2, Copy, Search, ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const CourseRegistration = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [regCode, setRegCode] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryRef = useRef(null);
  const brokerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    country: 'Select Country',
    countryCode: '+1',
    number: '',
    job: '',
    annualIncome: '',
    hasExperience: '',
    experienceYears: '',
    losses: '',
    deposit: '',
    accountType: '',
    broker: '',
    monthlyTrades: '',
    tradingStyle: '',
    availability: '',
    availabilityDetails: '',
    level: '',
    learning_goal: ''
  });

  const countries = [
    { name: 'Algeria', code: '+213' },
    { name: 'Egypt', code: '+20' },
    { name: 'Morocco', code: '+212' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'UAE', code: '+971' },
    { name: 'Jordan', code: '+962' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Qatar', code: '+974' },
    { name: 'Oman', code: '+968' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Tunisia', code: '+216' },
    { name: 'Libya', code: '+218' },
    { name: 'Iraq', code: '+964' },
    { name: 'Lebanon', code: '+961' },
    { name: 'Palestine', code: '+970' },
    { name: 'Syria', code: '+963' },
    { name: 'Yemen', code: '+967' },
    { name: 'Sudan', code: '+249' },
    { name: 'Mauritania', code: '+222' },
    { name: 'Somalia', code: '+252' },
    { name: 'Djibouti', code: '+253' },
    { name: 'Comoros', code: '+269' },
    { name: 'Turkey', code: '+90' },
    { name: 'USA', code: '+1' },
    { name: 'UK', code: '+44' },
    { name: 'France', code: '+33' },
    { name: 'Germany', code: '+49' },
    { name: 'Spain', code: '+34' },
    { name: 'Italy', code: '+39' },
    { name: 'Canada', code: '+1' },
    { name: 'Australia', code: '+61' }
  ];

  const incomeOptions = [
    { label: isAr ? 'أقل من 5000$' : '< $5,000', value: 'under_5k' },
    { label: '$5,000 - $15,000', value: '5k_15k' },
    { label: '$15,000 - $30,000', value: '15k_30k' },
    { label: '$30,000 - $60,000', value: '30k_60k' },
    { label: isAr ? 'أكثر من 60,000$' : '> $60,000', value: 'over_60k' }
  ];

  const accountTypes = [
    { label: isAr ? 'تجريبي' : 'Demo', value: 'Demo' },
    { label: isAr ? 'ستاندارت' : 'Standard', value: 'Standard' },
    { label: 'ECN', value: 'ECN' },
    { label: isAr ? 'كلاسيك' : 'Classic', value: 'Classic' },
    { label: isAr ? 'إسلامي' : 'Islamic', value: 'Islamic' }
  ];

  const availabilityOptions = [
    { label: isAr ? 'الصباح' : 'Morning', value: 'morning' },
    { label: isAr ? 'منتصف النهار' : 'Noon', value: 'noon' },
    { label: isAr ? 'المساء' : 'Evening', value: 'evening' },
    { label: isAr ? 'الليل' : 'Night', value: 'night' },
    { label: isAr ? 'كتابياً' : 'Written', value: 'written' }
  ];

  const allBrokers = [
    'Exness', 'XM', 'IC Markets', 'Pepperstone', 'FBS', 'HotForex', 'AvaTrade', 'OctaFX'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (brokerRef.current && !brokerRef.current.contains(event.target)) {
        setShowBrokerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, countryCode: selectedCountry.code }));
    }
  }, [formData.country]);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    
    const code = generateCode();
    setRegCode(code);
    
    const payload = {
      ...formData,
      phone: `${formData.countryCode}${formData.number}`,
      date: new Date().toLocaleString(),
      code: code
    };

    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzU7giZJy_k4nWfvkU1k3qrA8TjRoWFmk23q6dHsbDfZ8WabiBvArtl4tIQAwtvdAPPqQ/exec';
      
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
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
                        <div className="space-y-2 relative" ref={countryRef}>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البلد' : 'Country'}</label>
                          <div 
                            className="relative cursor-pointer"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          >
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 z-10" />
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all flex justify-between items-center">
                              <span className="text-sm font-bold">{formData.country}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {showCountryDropdown && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[100] max-h-60 flex flex-col overflow-hidden backdrop-blur-xl"
                              >
                                <div className="p-3 border-b border-white/5 flex items-center gap-2 sticky top-0 bg-zinc-900/90 backdrop-blur-md">
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
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                  {filteredCountries.map((c) => (
                                    <div 
                                      key={c.name}
                                      className="px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors text-sm font-bold"
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
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مثلاً: 500$' : 'e.g. $500'}
                              value={formData.losses}
                              onChange={(e) => setFormData({...formData, losses: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'مبلغ الإيداع المتوقع' : 'Expected Deposit'}</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                            <input 
                              required
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                              placeholder={isAr ? 'مثلاً: 1000$' : 'e.g. $1000'}
                              value={formData.deposit}
                              onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'نوع الحساب المفضل' : 'Preferred Account Type'}</label>
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

                      <div className="space-y-2 relative" ref={brokerRef}>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{isAr ? 'البروكر المستعمل' : 'Broker Used'}</label>
                        <div 
                          className="relative cursor-pointer"
                          onClick={() => setShowBrokerDropdown(!showBrokerDropdown)}
                        >
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50 z-10" />
                          <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all flex justify-between items-center">
                            <span className="text-sm font-bold">{formData.broker || (isAr ? 'اختر بروكر' : 'Select Broker')}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showBrokerDropdown ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {showBrokerDropdown && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto backdrop-blur-xl custom-scrollbar"
                            >
                              {allBrokers.map((name) => (
                                <div 
                                  key={name}
                                  className="px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors text-sm font-bold"
                                  onClick={() => {
                                    setFormData({...formData, broker: name});
                                    setShowBrokerDropdown(false);
                                  }}
                                >
                                  {name}
                                </div>
                              ))}
                              <div 
                                className="px-4 py-3 hover:bg-yellow-500 hover:text-black cursor-pointer transition-colors text-sm font-bold border-t border-white/5"
                                onClick={() => {
                                  setFormData({...formData, broker: 'Other'});
                                  setShowBrokerDropdown(false);
                                }}
                              >
                                {isAr ? 'آخر' : 'Other'}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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

                      {formData.availability === 'written' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            {isAr ? 'تفاصيل التواصل الكتابي' : 'Written Contact Details'}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-4 w-4 h-4 text-yellow-500/50" />
                            <textarea 
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-yellow-500/50 outline-none transition-all min-h-[80px] resize-none"
                              placeholder={isAr ? 'اكتب وسيلة التواصل المفضلة (تليجرام، واتساب...)' : 'Write preferred contact method...'}
                              value={formData.availabilityDetails}
                              onChange={(e) => setFormData({...formData, availabilityDetails: e.target.value})}
                            />
                          </div>
                        </motion.div>
                      )}

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

            <CardFooter className="p-8 border-t border-white/5 bg-white/[0.02] flex flex-col gap-6">
              <div className="flex justify-between items-center w-full">
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
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">
                  {isAr 
                    ? "* يرجى التأكد من صحة جميع المعلومات المدخلة لضمان تواصل الفريق معك بنجاح." 
                    : "* Please ensure all entered information is correct to ensure the team can contact you successfully."}
                </p>
                <p className="text-xs font-black text-yellow-500/80 uppercase tracking-tighter">
                  {isAr 
                    ? "خطوة واحدة تفصلك عن احتراف التداول، أكمل بياناتك وانضم إلينا الآن." 
                    : "One step separates you from professional trading, complete your data and join us now."}
                </p>
              </div>
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
                  ? 'شكراً لاهتمامك بالكورس. سيقوم فريقنا بمراجعة بياناتك والتواصل معك قريباً عبر الواتساب أو البريد الإلكتروني.' 
                  : 'Thank you for your interest. Our team will review your data and contact you soon via WhatsApp or Email.'}
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-8">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  {isAr ? 'كود التسجيل الخاص بك' : 'Your Registration Code'}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-4xl font-black text-yellow-500 tracking-widest">{regCode}</span>
                  <button 
                    onClick={copyCode}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-yellow-500"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-white text-black hover:bg-gray-200 font-black uppercase tracking-widest py-6 rounded-2xl"
              >
                {isAr ? 'العودة للرئيسية' : 'Back to Home'}
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CourseRegistration;
