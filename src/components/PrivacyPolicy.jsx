import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { Shield, Lock, Eye, FileText, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('privacy.collection.title'),
      icon: <Eye className="w-6 h-6 text-yellow-400" />,
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
      title: t('privacy.usage.title'),
      icon: <FileText className="w-6 h-6 text-yellow-400" />,
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
      title: t('privacy.sharing.title'),
      icon: <Shield className="w-6 h-6 text-yellow-400" />,
      content: <p className="text-gray-400 leading-relaxed">{t('privacy.sharing.desc')}</p>
    },
    {
      title: t('privacy.protection.title'),
      icon: <Lock className="w-6 h-6 text-yellow-400" />,
      content: (
        <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4 rtl:mr-4 rtl:ml-0">
          <li>{t('privacy.protection.item1')}</li>
          <li>{t('privacy.protection.item2')}</li>
          <li>{t('privacy.protection.item3')}</li>
        </ul>
      )
    },
    {
      title: t('privacy.rights.title'),
      icon: <Shield className="w-6 h-6 text-yellow-400" />,
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
      title: t('privacy.cookies.title'),
      icon: <Eye className="w-6 h-6 text-yellow-400" />,
      content: <p className="text-gray-400 leading-relaxed">{t('privacy.cookies.desc')}</p>
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
              {t('privacy.title')}
            </h1>
            <p className="text-gray-500">{t('privacy.lastUpdated')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
          >
            <p className="text-lg text-gray-300 mb-12 leading-relaxed">
              {t('privacy.intro')}
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="pl-12 rtl:pr-12 rtl:pl-0">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <span>{t('privacy.contact')}</span>
                </div>
                <p className="text-sm text-gray-500 italic">
                  {t('privacy.updates.desc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
