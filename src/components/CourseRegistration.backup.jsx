import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Globe, MapPin, Calendar, Briefcase, 
  TrendingUp, DollarSign, Clock, Target, Activity, 
  ChevronRight, ChevronLeft, Send, CheckCircle2, AlertCircle,
  Loader2, Copy, Search, ChevronDown, MessageCircle, Edit3, Languages
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
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [brokerSearch, setBrokerSearch] = useState('');
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const brokerRef = useRef(null);
  const langRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    otherCity: '',
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
    otherBroker: '',
    monthlyTrades: '',
    tradingStyle: '',
    availability: '',
    availabilityDetails: '',
    level: '',
    learning_goal: ''
  });

  const countries = [
    { name: 'Afghanistan', code: '+93', cities: ['Kabul', 'Herat', 'Kandahar', 'Mazar-i-Sharif'] },
    { name: 'Albania', code: '+355', cities: ['Tirana', 'Durres', 'Vlore', 'Elbasan'] },
    { name: 'Algeria', code: '+213', cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida'] },
    { name: 'Argentina', code: '+54', cities: ['Buenos Aires', 'Cordoba', 'Rosario', 'Mendoza'] },
    { name: 'Australia', code: '+61', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
    { name: 'Austria', code: '+43', cities: ['Vienna', 'Graz', 'Linz', 'Salzburg'] },
    { name: 'Bahrain', code: '+973', cities: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town'] },
    { name: 'Belgium', code: '+32', cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi'] },
    { name: 'Brazil', code: '+55', cities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'] },
    { name: 'Canada', code: '+1', cities: ['Toronto', 'Montreal', 'Vancouver', 'Ottawa', 'Calgary'] },
    { name: 'China', code: '+86', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'] },
    { name: 'Egypt', code: '+20', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Mansoura'] },
    { name: 'France', code: '+33', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'] },
    { name: 'Germany', code: '+49', cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'] },
    { name: 'India', code: '+91', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad'] },
    { name: 'Indonesia', code: '+62', cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'] },
    { name: 'Iraq', code: '+964', cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Kirkuk'] },
    { name: 'Italy', code: '+39', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'] },
    { name: 'Japan', code: '+81', cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'] },
    { name: 'Jordan', code: '+962', cities: ['Amman', 'Zarqa', 'Irbid', 'Aqaba'] },
    { name: 'Kuwait', code: '+965', cities: ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Salmiya'] },
    { name: 'Lebanon', code: '+961', cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre'] },
    { name: 'Libya', code: '+218', cities: ['Tripoli', 'Benghazi', 'Misrata', 'Bayda'] },
    { name: 'Malaysia', code: '+60', cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Kuching'] },
    { name: 'Morocco', code: '+212', cities: ['Casablanca', 'Rabat', 'Fes', 'Marrakesh', 'Tangier', 'Agadir'] },
    { name: 'Netherlands', code: '+31', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'] },
    { name: 'Oman', code: '+968', cities: ['Muscat', 'Salalah', 'Seeb', 'Sohar'] },
    { name: 'Pakistan', code: '+92', cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi'] },
    { name: 'Palestine', code: '+970', cities: ['Gaza City', 'Jerusalem', 'Hebron', 'Nablus', 'Ramallah'] },
    { name: 'Qatar', code: '+974', cities: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor'] },
    { name: 'Russia', code: '+7', cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg'] },
    { name: 'Saudi Arabia', code: '+966', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Abha', 'Tabuk'] },
    { name: 'Singapore', code: '+65', cities: ['Singapore'] },
    { name: 'South Africa', code: '+27', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'] },
    { name: 'Spain', code: '+34', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville'] },
    { name: 'Sudan', code: '+249', cities: ['Khartoum', 'Omdurman', 'Nyala', 'Port Sudan'] },
    { name: 'Switzerland', code: '+41', cities: ['Zurich', 'Geneva', 'Basel', 'Bern'] },
    { name: 'Syria', code: '+963', cities: ['Damascus', 'Aleppo', 'Homs', 'Latakia'] },
    { name: 'Tunisia', code: '+216', cities: ['Tunis', 'Sfax', 'Sousse', 'Ettadhamen'] },
    { name: 'Turkey', code: '+90', cities: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'] },
    { name: 'UAE', code: '+971', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman'] },
    { name: 'UK', code: '+44', cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool'] },
    { name: 'USA', code: '+1', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
    { name: 'Yemen', code: '+967', cities: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah'] }
  ].sort((a, b) => a.name.localeCompare(b.name));

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
    { label: isAr ? 'كتابياً' : 'written' }
  ];

  const allBrokers = [
    'None', 'Other', 'One Royal', 'Equiti', 'Exness', 'XM', 'IC Markets', 'Pepperstone', 'FBS', 'HotForex', 
    'AvaTrade', 'OctaFX', 'Tickmill', 'Admiral Markets', 'FXTM', 'ThinkMarkets', 'FP Markets',
    'Axi', 'Saxo Bank', 'Interactive Brokers', 'Swissquote', 'IG', 'CMC Markets', 'Plus500',
    'eToro', 'XTB', 'OANDA', 'Forex.com', 'City Index', 'Markets.com', 'IronFX', 'NordFX',
    'InstaForex', 'RoboForex', 'Vantage Markets', 'BlackBull Markets', 'Dukascopy', 'LMAX',
    'FXCM', 'Windsor Brokers', 'Orbex', 'BDSwiss', 'HYCM', 'Amana Capital', 'MultiBank Group'
  ];

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) setShowCountryDropdown(false);
      if (cityRef.current && !cityRef.current.contains(event.target)) setShowCityDropdown(false);
      if (brokerRef.current && !brokerRef.current.contains(event.target)) setShowBrokerDropdown(false);
      if (langRef.current && !langRef.current.contains(event.target)) setShowLangDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.country);
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, countryCode: selectedCountry.code, city: '', otherCity: '' }));
    }
  }, [formData.country]);

  const generateCode = () => 'AT-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      const cityValid = formData.city === 'Other' ? formData.otherCity : formData.city;
      return formData.name && formData.email && formData.number && formData.age && cityValid && formData.country !== 'Select Country';
    }
    if (currentStep === 2) {
      if (formData.hasExperience === 'No') return formData.job && formData.annualIncome && formData.hasExperience;
      const brokerValid = formData.broker === 'Other' ? formData.otherBroker : formData.broker;
      const baseValid = formData.job && formData.annualIncome && formData.hasExperience && formData.deposit && formData.accountType && brokerValid;
      if (formData.hasExperience === 'Yes') return baseValid && formData.experienceYears && formData.losses;
      return baseValid;
    }
    if (currentStep === 3) {
      const baseValid = formData.tradingStyle && formData.availability && formData.learning_goal;
      if (formData.hasExperience === 'Yes' && !formData.monthlyTrades) return false;
      if (formData.availability === 'written' && !formData.availabilityDetails) return false;
      return baseValid;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setError(null);
    setLoading(true);
    const code = generateCode();
    setRegCode(code);
    
    const finalCity = formData.city === 'Other' ? formData.otherCity : formData.city;
    const finalBroker = formData.broker === 'Other' ? formData.otherBroker : formData.broker;

    const payload = {
      name: formData.name || 'None',
      email: formData.email || 'None',
      phone: `${formData.countryCode}${formData.number}` || 'None',
      age: formData.age || 'None',
      country: formData.country || 'None',
      city: finalCity || 'None',
      job: formData.job || 'None',
      annualIncome: formData.annualIncome || 'None',
      hasExperience: formData.hasExperience || 'None',
      experienceYears: formData.hasExperience === 'Yes' ? (formData.experienceYears || 'None') : 'None',
      losses: formData.hasExperience === 'Yes' ? (formData.losses || 'None') : 'None',
      deposit: formData.hasExperience === 'Yes' ? (formData.deposit || 'None') : 'None',
      accountType: formData.hasExperience === 'Yes' ? (formData.accountType || 'None') : 'None',
      broker: formData.hasExperience === 'Yes' ? (finalBroker || 'None') : 'None',
      monthlyTrades: formData.hasExperience === 'Yes' ? (formData.monthlyTrades || 'None') : 'None',
      tradingStyle: formData.tradingStyle || 'None',
      availability: formData.availability || 'None',
      availabilityDetails: formData.availability === 'written' ? (formData.availabilityDetails || 'None') : 'None',
      learning_goal: formData.learning_goal || 'None',
      date: new Date().toLocaleString(),
      code: code
    };

    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzU7giZJy_k4nWfvkU1k3qrA8TjRoWFmk23q6dHsbDfZ8WabiBvArtl4tIQAwtvdAPPqQ/exec';
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
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
      navigator.clipboard.writeText(regCode).then(() => alert(isAr ? 'تم نسخ الكود!' : 'Code copied!'));
    } else {
      alert(isAr ? `كود التسجيل: ${regCode}` : `Registration Code: ${regCode}`);
    }
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLangDropdown(false);
  };

  const steps = [
    { id: 1, title: isAr ? 'المعلومات الشخصية' : 'Personal Info' },
    { id: 2, title: isAr ? 'الخبرة والمالية' : 'Experience & Finance' },
    { id: 3, title: isAr ? 'العادات والأهداف' : 'Habits & Goals' }
  ];

  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  const currentCountryObj = countries.find(c => c.name === formData.country);
  const availableCities = currentCountryObj ? [...currentCountryObj.cities, 'Other'] : ['Other'];
  const filteredCities = availableCities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  const filteredBrokers = allBrokers.filter(b => b.toLowerCase().includes(brokerSearch.toLowerCase()));

  return (
    <section className="min-h-screen bg-black pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Language Toggle Button */}
      <div className="absolute top-8 right-8 z-50" ref={langRef}>
        <button 
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-yellow-500 hover:text-black transition-all duration-300 backdrop-blur-xl group"
        >
          <Languages className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {languages.find(l => l.code === i18n.language)?.label || 'Language'}
          </span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showLangDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-colors ${i18n.language === lang.code ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'التسجيل في الكورس الاحترافي' : 'Professional Course Registration'}</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{isAr ? 'ابدأ رحلتك' : 'Start Your'} <span className="text-yellow-500">{isAr ? 'الآن' : 'Journey'}</span></h2>
        </div>

        {!submitted ? (
          <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center justify-between mb-8">
                {steps.map((s, idx) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center gap-3 relative">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                        {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.title}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex-1 h-[2px] bg-white/5 mx-4 mb-8">
                        <motion.div className="h-full bg-yellow-500" initial={{ width: '0%' }} animate={{ width: step > s.id ? '100%' : '0%' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"><AlertCircle className="w-4 h-4" />{error}</motion.div>}
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="name@example.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                          <div className="flex gap-2">
                            <div className="w-24 bg-white/5 border border-white/10 rounded-2xl py-4 px-3 text-white text-sm font-bold text-center">{formData.countryCode}</div>
                            <div className="flex-1 relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                              <input type="tel" value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="000 000 000" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'العمر' : 'Age'}</label>
                          <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="25" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الدولة' : 'Country'}</label>
                          <div className="relative" ref={countryRef}>
                            <button type="button" onClick={() => setShowCountryDropdown(!showCountryDropdown)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm font-bold flex items-center justify-between focus:outline-none focus:border-yellow-500/50 transition-all">
                              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500" /><span>{formData.country === 'Select Country' ? (isAr ? 'اختر الدولة' : 'Select Country') : formData.country}</span></div>
                              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>{showCountryDropdown && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                                <div className="p-2 border-b border-white/5"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" /><input type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-yellow-500/30" placeholder={isAr ? 'ابحث عن دولة...' : 'Search country...'} /></div></div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">{filteredCountries.map((c) => (<button key={c.name} type="button" onClick={() => { setFormData({ ...formData, country: c.name }); setShowCountryDropdown(false); }} className="w-full px-4 py-3 text-left text-xs font-bold text-gray-400 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-between"><span>{c.name}</span><span className="opacity-50">{c.code}</span></button>))}</div>
                              </motion.div>
                            )}</AnimatePresence>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'المدينة' : 'City'}</label>
                          <div className="relative" ref={cityRef}>
                            <button type="button" onClick={() => setShowCityDropdown(!showCityDropdown)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm font-bold flex items-center justify-between focus:outline-none focus:border-yellow-500/50 transition-all">
                              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /><span>{formData.city || (isAr ? 'اختر المدينة' : 'Select City')}</span></div>
                              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>{showCityDropdown && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                                <div className="p-2 border-b border-white/5"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" /><input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-yellow-500/30" placeholder={isAr ? 'ابحث عن مدينة...' : 'Search city...'} /></div></div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">{filteredCities.map((c) => (<button key={c} type="button" onClick={() => { setFormData({ ...formData, city: c }); setShowCityDropdown(false); }} className="w-full px-4 py-3 text-left text-xs font-bold text-gray-400 hover:bg-yellow-500 hover:text-black transition-colors">{c}</button>))}</div>
                              </motion.div>
                            )}</AnimatePresence>
                          </div>
                        </div>
                        {formData.city === 'Other' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'اسم المدينة' : 'City Name'}</label>
                            <div className="relative group">
                              <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                              <input type="text" value={formData.otherCity} onChange={(e) => setFormData({...formData, otherCity: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder={isAr ? 'اكتب اسم مدينتك' : 'Type your city name'} />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الوظيفة الحالية' : 'Current Job'}</label>
                          <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <input type="text" value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder={isAr ? 'أدخل وظيفتك' : 'Enter your job'} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الدخل السنوي التقريبي' : 'Approx. Annual Income'}</label>
                          <div className="grid grid-cols-1 gap-2">{incomeOptions.map((opt) => (<button key={opt.value} type="button" onClick={() => setFormData({...formData, annualIncome: opt.value})} className={`px-3 py-3 rounded-xl text-[10px] font-black border transition-all ${formData.annualIncome === opt.value ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{opt.label}</button>))}</div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'هل لديك خبرة سابقة في التداول؟' : 'Do you have trading experience?'}</label>
                          <div className="flex gap-4">{[{ label: isAr ? 'نعم' : 'Yes', value: 'Yes' }, { label: isAr ? 'لا' : 'No', value: 'No' }].map((opt) => (<button key={opt.value} type="button" onClick={() => setFormData({...formData, hasExperience: opt.value})} className={`flex-1 py-4 rounded-2xl text-sm font-black border transition-all ${formData.hasExperience === opt.value ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{opt.label}</button>))}</div>
                        </div>
                        {formData.hasExperience === 'Yes' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'سنوات الخبرة' : 'Years of Experience'}</label>
                              <div className="relative group">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                                <input type="number" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="0" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'إجمالي الخسائر التقريبية' : 'Approx. Total Losses'}</label>
                              <div className="relative group">
                                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                                <input type="text" value={formData.losses} onChange={(e) => setFormData({...formData, losses: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="0.00" />
                              </div>
                            </div>
                          </>
                        )}
                        {formData.hasExperience === 'Yes' && (
                          <>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'مبلغ الإيداع المتوقع' : 'Expected Deposit'}</label>
                              <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                                <input type="text" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="0.00" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'نوع الحساب' : 'Account Type'}</label>
                              <div className="grid grid-cols-2 gap-2">{accountTypes.map((opt) => (<button key={opt.value} type="button" onClick={() => setFormData({...formData, accountType: opt.value})} className={`px-3 py-3 rounded-xl text-[10px] font-black border transition-all ${formData.accountType === opt.value ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{opt.label}</button>))}</div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'شركة الوساطة (البروكر)' : 'Broker'}</label>
                              <div className="relative" ref={brokerRef}>
                                <button type="button" onClick={() => setShowBrokerDropdown(!showBrokerDropdown)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm font-bold flex items-center justify-between focus:outline-none focus:border-yellow-500/50 transition-all">
                                  <span>{formData.broker || (isAr ? 'اختر البروكر' : 'Select Broker')}</span>
                                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showBrokerDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>{showBrokerDropdown && (
                                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 top-full mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                                    <div className="p-2 border-b border-white/5"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" /><input type="text" value={brokerSearch} onChange={(e) => setBrokerSearch(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-yellow-500/30" placeholder={isAr ? 'ابحث عن بروكر...' : 'Search broker...'} /></div></div>
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">{filteredBrokers.map((b) => (<button key={b} type="button" onClick={() => { setFormData({ ...formData, broker: b }); setShowBrokerDropdown(false); }} className="w-full px-4 py-3 text-left text-xs font-bold text-gray-400 hover:bg-yellow-500 hover:text-black transition-colors">{b}</button>))}</div>
                                  </motion.div>
                                )}</AnimatePresence>
                              </div>
                            </div>
                            {formData.broker === 'Other' && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'اسم البروكر' : 'Broker Name'}</label>
                                <div className="relative group">
                                  <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                                  <input type="text" value={formData.otherBroker} onChange={(e) => setFormData({...formData, otherBroker: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder={isAr ? 'اكتب اسم البروكر' : 'Type broker name'} />
                                </div>
                              </motion.div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isAr ? -20 : 20 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.hasExperience === 'Yes' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'متوسط عدد الصفقات شهرياً' : 'Avg. Monthly Trades'}</label>
                            <div className="relative group">
                              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                              <input type="number" value={formData.monthlyTrades} onChange={(e) => setFormData({...formData, monthlyTrades: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="0" />
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'طريقة التداول' : 'Trading Style'}</label>
                          <div className="flex gap-2">{[{ label: isAr ? 'وحدي' : 'Alone', value: 'Alone' }, { label: isAr ? 'قناة توصيات' : 'Signals', value: 'Signals' }].map((opt) => (<button key={opt.value} type="button" onClick={() => setFormData({...formData, tradingStyle: opt.value})} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${formData.tradingStyle === opt.value ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{opt.label}</button>))}</div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الوقت المفضل للمتابعة' : 'Preferred Follow-up Time'}</label>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">{availabilityOptions.map((opt) => (<button key={opt.value} type="button" onClick={() => setFormData({...formData, availability: opt.value})} className={`px-2 py-3 rounded-xl text-[10px] font-black border transition-all ${formData.availability === opt.value ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{opt.label}</button>))}</div>
                        </div>
                        {formData.availability === 'written' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'تفاصيل التواصل الكتابي' : 'Written Contact Details'}</label>
                            <textarea value={formData.availabilityDetails} onChange={(e) => setFormData({...formData, availabilityDetails: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all min-h-[100px]" placeholder={isAr ? 'أدخل وسيلة التواصل المفضلة (واتساب، تليجرام...)' : 'Enter preferred contact method (WhatsApp, Telegram...)'} />
                          </motion.div>
                        )}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">{isAr ? 'الهدف من التداول' : 'Trading Goal'}</label>
                          <div className="relative group">
                            <Target className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <textarea value={formData.learning_goal} onChange={(e) => setFormData({...formData, learning_goal: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all min-h-[100px]" placeholder={isAr ? 'ماذا تريد أن تحقق من هذا الكورس؟' : 'What do you want to achieve from this course?'} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>

            <CardFooter className="p-8 border-t border-white/5 flex flex-col gap-6">
              <div className="flex justify-between w-full gap-4">
                {step > 1 && <Button onClick={() => setStep(step - 1)} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl py-6 font-black uppercase tracking-widest text-xs"><ChevronLeft className={`w-4 h-4 ${isAr ? 'ml-2 rotate-180' : 'mr-2'}`} />{isAr ? 'السابق' : 'Back'}</Button>}
                <Button onClick={() => { if (validateStep(step)) { setError(null); if (step < 3) setStep(step + 1); else handleSubmit(); } else { setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة قبل الانتقال' : 'Please fill in all required fields before proceeding'); } }} disabled={loading} className="flex-[2] bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{step === 3 ? (isAr ? 'إرسال الطلب' : 'Submit Request') : (isAr ? 'التالي' : 'Next')}{step !== 3 && <ChevronRight className={`w-4 h-4 ${isAr ? 'mr-2 rotate-180' : 'ml-2'}`} />}{step === 3 && <Send className={`w-4 h-4 ${isAr ? 'mr-2' : 'ml-2'}`} />}</>}</Button>
              </div>
              <div className="text-center space-y-2"><p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{isAr ? 'يرجى التأكد من صحة جميع المعلومات المدخلة' : 'Please ensure all entered information is correct'}</p><p className="text-[9px] font-bold text-yellow-500/50 uppercase tracking-widest">{isAr ? 'خطوتك الأولى نحو الاحتراف تبدأ ببيانات دقيقة' : 'Your first step towards professionalism starts with accurate data'}</p></div>
            </CardFooter>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/60 border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-12 text-center border shadow-2xl">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-500/20"><CheckCircle2 className="w-10 h-10 text-black" /></div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{isAr ? 'تم استلام طلبك!' : 'Request Received!'}</h3>
            <p className="text-gray-400 font-bold text-sm mb-8 leading-relaxed">{isAr ? 'شكراً لتسجيلك. لقد تم إرسال بياناتك بنجاح. يرجى الانضمام لقناة التلجرام، وسيتم التواصل معك فور الانضمام.' : 'Thank you for registering. Your data has been sent successfully. Please join the Telegram channel, and you will be contacted after joining.'}</p>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 mb-8 relative group overflow-hidden"><div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" /><span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">{isAr ? 'كود التسجيل الخاص بك' : 'Your Registration Code'}</span><div className="flex items-center justify-center gap-4"><span className="text-4xl font-black text-yellow-500 tracking-[0.2em]">{regCode}</span><button onClick={copyCode} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-yellow-500"><Copy className="w-5 h-5" /></button></div></div>
            <div className="space-y-4">
              <Button onClick={() => window.open('https://t.me/+CADMeIVdMDQ2Nzg0', '_blank')} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" />{isAr ? 'انضم لقناة الكورس' : 'Join Course Channel'}</Button>
              <Button onClick={() => window.open('https://t.me/Ahmed_trader_support', '_blank')} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl py-6 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"><User className="w-5 h-5" />{isAr ? 'تواصل مع الكوتش أحمد' : 'Contact Coach Ahmed'}</Button>
              <Button onClick={() => window.location.href = '/'} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl py-6 font-black uppercase tracking-widest text-xs">{isAr ? 'العودة للرئيسية' : 'Back to Home'}</Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CourseRegistration;
