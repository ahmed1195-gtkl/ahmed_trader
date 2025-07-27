import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ExternalLink, CheckCircle, Gift, Phone, MessageCircle, Mail, Loader2 } from 'lucide-react';
import { useBrokers } from '../hooks/useBrokers';

const Brokers = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const { brokers, loading, error } = useBrokers(currentLanguage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('brokers.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            {t('brokers.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            <span className="ml-2 text-white text-lg">
              {currentLanguage === 'ar' ? 'جاري التحميل...' : currentLanguage === 'fr' ? 'Chargement...' : 'Loading...'}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-300">
                {currentLanguage === 'ar' ? 'حدث خطأ في تحميل البيانات' : currentLanguage === 'fr' ? 'Erreur de chargement des données' : 'Error loading data'}
              </p>
            </div>
          </div>
        )}

        {/* Brokers Content */}
        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
          {brokers.map((broker, index) => (
            <motion.div
              key={broker.id}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
                {/* Broker Header */}
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                  <img 
                    src={broker.logo} 
                    alt={`${broker.name} Logo`} 
                    className=" rounded-x1 object-cover"
                  />
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {broker.name}
                    </h3>
                    <p className="text-gray-300 mt-2">
                      {broker.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    {currentLanguage === 'ar' ? 'المميزات' : currentLanguage === 'fr' ? 'Caractéristiques' : 'Features'}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {broker.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-200 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bonuses */}
                {broker.bonuses && broker.bonuses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                      <Gift className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      {currentLanguage === 'ar' ? 'العروض والمكافآت' : currentLanguage === 'fr' ? 'Bonus et Offres' : 'Bonuses & Offers'}
                    </h4>
                    <div className="space-y-2">
                      {broker.bonuses.map((bonus, idx) => (
                        <div key={idx} className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
                          <span className="text-yellow-200 text-sm font-medium">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-4">
                    {currentLanguage === 'ar' ? 'معلومات التواصل' : currentLanguage === 'fr' ? 'Contact' : 'Contact Info'}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-300">
                      <Phone className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{broker.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-300">
                      <MessageCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{broker.contact.telegram}</span>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-300">
                      <Mail className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{broker.contact.email}</span>
                    </div>
                  </div>
                </div>

                {/* Register Button */}
                <Button 
                  onClick={() => window.open(broker.registerUrl, '_blank')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105 border-0"
                >
                  <ExternalLink className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('brokers.register')}
                </Button>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Additional Info */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-4xl mx-auto">
              <p className="text-gray-300 text-lg leading-relaxed">
                {currentLanguage === 'ar' 
                  ? 'إذا كان لديك حساب مفعل وترغب في الانضمام للتوصيات، تواصل معنا عبر الطرق المذكورة أعلاه.'
                  : currentLanguage === 'fr'
                  ? 'Si vous avez un compte actif et souhaitez rejoindre nos signaux, contactez-nous via les méthodes mentionnées ci-dessus.'
                  : 'If you have an active account and want to join our trading signals, contact us through the methods mentioned above.'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Brokers;

