import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Bell, UserCheck, Mail, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-amber-500" />,
      title: t('privacy.collection.title'),
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">{t('privacy.collection.desc')}</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 rtl:mr-4 rtl:ml-0">
            <li>{t('privacy.collection.item1')}</li>
            <li>{t('privacy.collection.item2')}</li>
            <li>{t('privacy.collection.item3')}</li>
            <li>{t('privacy.collection.item4')}</li>
            <li>{t('privacy.collection.item5')}</li>
            <li>{t('privacy.collection.item6')}</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      title: t('privacy.usage.title'),
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">{t('privacy.usage.desc')}</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 rtl:mr-4 rtl:ml-0">
            <li>{t('privacy.usage.item1')}</li>
            <li>{t('privacy.usage.item2')}</li>
            <li>{t('privacy.usage.item3')}</li>
            <li>{t('privacy.usage.item4')}</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-500" />,
      title: t('privacy.sharing.title'),
      content: <p className="text-gray-400 leading-relaxed">{t('privacy.sharing.desc')}</p>
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-500" />,
      title: t('privacy.protection.title'),
      content: (
        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 rtl:mr-4 rtl:ml-0">
          <li>{t('privacy.protection.item1')}</li>
          <li>{t('privacy.protection.item2')}</li>
          <li>{t('privacy.protection.item3')}</li>
        </ul>
      )
    },
    {
      icon: <UserCheck className="w-6 h-6 text-amber-500" />,
      title: t('privacy.rights.title'),
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">{t('privacy.rights.desc')}</p>
          <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 rtl:mr-4 rtl:ml-0">
            <li>{t('privacy.rights.item1')}</li>
            <li>{t('privacy.rights.item2')}</li>
            <li>{t('privacy.rights.item3')}</li>
          </ul>
        </div>
      )
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-500" />,
      title: t('privacy.cookies.title'),
      content: <p className="text-gray-400 leading-relaxed">{t('privacy.cookies.desc')}</p>
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
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
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shukritrade Security</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              {t('privacy.title')}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>{t('privacy.lastUpdated')}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-800" />
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>mchokri100@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-amber-500/20 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-white group-hover:text-amber-500 transition-colors">
                      {section.title}
                    </h2>
                    <div className="text-gray-400 leading-relaxed text-sm md:text-base">
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
            className="mt-16 p-12 rounded-[3rem] bg-gradient-to-br from-amber-500 to-amber-600 text-black text-center relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{t('privacy.contact')}</h3>
              <p className="font-bold mb-8 opacity-80">{t('privacy.updates.desc')}</p>
              <a 
                href="mailto:mchokri100@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
