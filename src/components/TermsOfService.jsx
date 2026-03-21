import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Shield, Zap, Users, Scale, Clock, Mail } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { termsOfServiceAr } from '../data/terms/ar';
import { termsOfServiceEn } from '../data/terms/en';
import { termsOfServiceFr } from '../data/terms/fr';
import { termsOfServiceEs } from '../data/terms/es';

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const [termsContent, setTermsContent] = useState(termsOfServiceAr);
  const [currentLang, setCurrentLang] = useState('ar');
  const isRTL = i18n.language?.startsWith('ar');

  useEffect(() => {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : 
                 i18n.language?.startsWith('en') ? 'en' : 
                 i18n.language?.startsWith('fr') ? 'fr' : 
                 i18n.language?.startsWith('es') ? 'es' : 'ar';
    
    setCurrentLang(lang);
    
    switch (lang) {
      case 'en':
        setTermsContent(termsOfServiceEn);
        break;
      case 'fr':
        setTermsContent(termsOfServiceFr);
        break;
      case 'es':
        setTermsContent(termsOfServiceEs);
        break;
      case 'ar':
      default:
        setTermsContent(termsOfServiceAr);
        break;
    }
  }, [i18n.language]);

  const iconMap = {
    0: <FileText className="w-6 h-6 text-amber-500" />,
    1: <Shield className="w-6 h-6 text-amber-500" />,
    2: <AlertCircle className="w-6 h-6 text-amber-500" />,
    3: <Users className="w-6 h-6 text-amber-500" />,
    4: <Zap className="w-6 h-6 text-amber-500" />,
    5: <Scale className="w-6 h-6 text-amber-500" />,
  };

  const getIcon = (index) => {
    return iconMap[index % 6] || iconMap[0];
  };

  const translations = {
    ar: {
      title: 'شروط الخدمة',
      subtitle: 'الشروط والأحكام الخاصة بمنصة ShukriTrade',
      badge: 'الشروط والأحكام',
      lastUpdated: 'آخر تحديث',
      contact: 'للتواصل معنا',
      contactDesc: 'إذا كان لديك أي استفسارات حول شروط الخدمة، يرجى التواصل معنا'
    },
    en: {
      title: 'Terms of Service',
      subtitle: 'Terms and conditions for ShukriTrade platform',
      badge: 'Terms & Conditions',
      lastUpdated: 'Last Updated',
      contact: 'Contact Us',
      contactDesc: 'If you have any questions about our terms of service, please contact us'
    },
    fr: {
      title: 'Conditions d\'Utilisation',
      subtitle: 'Conditions générales de la plateforme ShukriTrade',
      badge: 'Conditions d\'Utilisation',
      lastUpdated: 'Dernière mise à jour',
      contact: 'Nous Contacter',
      contactDesc: 'Si vous avez des questions sur nos conditions d\'utilisation, veuillez nous contacter'
    },
    es: {
      title: 'Términos de Servicio',
      subtitle: 'Términos y condiciones de la plataforma ShukriTrade',
      badge: 'Términos y Condiciones',
      lastUpdated: 'Última actualización',
      contact: 'Contáctenos',
      contactDesc: 'Si tiene alguna pregunta sobre nuestros términos de servicio, contáctenos'
    }
  };

  const labels = translations[currentLang] || translations.ar;

  return (
    <div className={`min-h-screen flex flex-col bg-black text-white overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="flex-1 pt-32 pb-20 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-6"
            >
              <FileText className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{labels.badge}</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              {labels.title}
            </h1>
            
            <p className="text-gray-400 text-lg mb-6">{labels.subtitle}</p>
            
            <div className="flex items-center justify-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-widest flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>{labels.lastUpdated}: {termsContent.lastUpdated}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-800" />
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>mchokri100@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 mb-16">
            {termsContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-amber-500/20 transition-all duration-500"
              >
                <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    {getIcon(index)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-white group-hover:text-amber-500 transition-colors">
                      {section.title}
                    </h2>
                    <div className="text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-12 rounded-[3rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black text-center relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{labels.contact}</h3>
              <p className="font-bold mb-8 opacity-80">{labels.contactDesc}</p>
              <a 
                href="mailto:mchokri100@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
              >
                <Mail className="w-4 h-4" />
                {currentLang === 'ar' ? 'تواصل معنا' : currentLang === 'en' ? 'Contact Support' : currentLang === 'fr' ? 'Contactez le support' : 'Contacte al soporte'}
              </a>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-12 p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center"
          >
            <p className="text-red-400 text-sm leading-relaxed">
              {currentLang === 'ar' ? '⚠️ تنويه: جميع المعلومات والأدوات المقدمة على هذه المنصة هي لأغراض تعليمية فقط. التداول ينطوي على مخاطر عالية.' : 
               currentLang === 'en' ? '⚠️ Disclaimer: All information and tools provided on this platform are for educational purposes only. Trading involves high risks.' :
               currentLang === 'fr' ? '⚠️ Avertissement: Toutes les informations et outils fournis sur cette plateforme sont à titre éducatif uniquement. Le trading comporte des risques élevés.' :
               '⚠️ Aviso: Toda la información y herramientas proporcionadas en esta plataforma son solo con fines educativos. El trading implica altos riesgos.'}
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
