import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ExternalLink, CheckCircle, Gift, Phone, MessageCircle, Mail, Loader2, TrendingUp, Shield, Zap, Award, Instagram, Send } from 'lucide-react';
import { useBrokers } from '../hooks/useBrokers';

const BrokersPage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const { brokers, loading, error } = useBrokers(currentLanguage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-6">
            {currentLanguage === 'ar' ? 'الوسطاء' : currentLanguage === 'fr' ? 'Courtiers' : 'Brokers'} <span className="text-amber-500">{currentLanguage === 'ar' ? 'الموصى بهم' : currentLanguage === 'fr' ? 'Recommandés' : 'Recommended'}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {currentLanguage === 'ar' 
              ? 'شركاؤنا الموثوقون في عالم التداول - اختر الوسيط المناسب لك وابدأ رحلتك نحو النجاح'
              : currentLanguage === 'fr'
              ? 'Nos partenaires de confiance dans le monde du trading - Choisissez le courtier qui vous convient et commencez votre voyage vers le succès'
              : 'Our trusted partners in the trading world - Choose the right broker for you and start your journey to success'
            }
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mx-auto rounded-full shadow-lg shadow-amber-500/50"></div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            <span className="ml-3 text-foreground text-lg font-bold">
              {currentLanguage === 'ar' ? 'جاري التحميل...' : currentLanguage === 'fr' ? 'Chargement...' : 'Loading...'}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-8 max-w-md mx-auto">
              <p className="text-red-400 font-bold">
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
            animate="visible"
            className="space-y-12 max-w-7xl mx-auto"
          >
            {brokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                variants={itemVariants}
                className="group"
              >
                <div className="glass-card border border-border rounded-[3rem] p-8 md:p-12 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
                  {/* Broker Header */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-white/5 p-4 flex items-center justify-center border border-border group-hover:border-amber-500/30 transition-all duration-500">
                      <img src={broker.logo} 
                        alt={`${broker.name} Logo`} 
                        className="w-full h-full object-contain"
                      decoding="async" loading="lazy" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground group-hover:text-amber-500 transition-colors duration-300 mb-4">
                        {broker.name}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {broker.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Features */}
                    <div className="bg-card rounded-[2rem] p-6 border border-border">
                      <h3 className="text-xl font-black uppercase tracking-tight text-amber-500 mb-6 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6" />
                        {currentLanguage === 'ar' ? 'المميزات' : currentLanguage === 'fr' ? 'Caractéristiques' : 'Features'}
                      </h3>
                      <div className="space-y-3">
                        {broker.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bonuses & Contact */}
                    <div className="space-y-6">
                      {/* Bonuses */}
                      {broker.bonuses && broker.bonuses.length > 0 && (
                        <div className="bg-card rounded-[2rem] p-6 border border-border">
                          <h3 className="text-xl font-black uppercase tracking-tight text-amber-500 mb-6 flex items-center gap-3">
                            <Gift className="w-6 h-6" />
                            {currentLanguage === 'ar' ? 'العروض والمكافآت' : currentLanguage === 'fr' ? 'Bonus et Offres' : 'Bonuses & Offers'}
                          </h3>
                          <div className="space-y-3">
                            {broker.bonuses.map((bonus, idx) => (
                              <div key={idx} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                <span className="text-amber-300 text-sm font-bold">{bonus}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="bg-card rounded-[2rem] p-6 border border-border">
                        <h3 className="text-xl font-black uppercase tracking-tight text-amber-500 mb-6">
                          {currentLanguage === 'ar' ? 'تواصل مع الكوتش أحمد' : currentLanguage === 'fr' ? 'Contactez le Coach Ahmed' : 'Contact Coach Ahmed'}
                        </h3>
                        <div className="space-y-4">
                          <a href={`tel:${broker.contact.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-amber-500 transition-colors group/link">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover/link:bg-amber-500/20 transition-colors">
                              <Phone className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold">{broker.contact.phone}</span>
                          </a>
                          <a href={`https://t.me/${broker.contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-amber-500 transition-colors group/link">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover/link:bg-amber-500/20 transition-colors">
                              <Send className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold">{broker.contact.telegram}</span>
                          </a>
                          <a href={`mailto:${broker.contact.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-amber-500 transition-colors group/link">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover/link:bg-amber-500/20 transition-colors">
                              <Mail className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold">{broker.contact.email}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Button 
                    onClick={() => window.open(broker.registerUrl, '_blank')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest py-6 rounded-[1.5rem] text-lg shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/40"
                  >
                    <ExternalLink className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                    {currentLanguage === 'ar' ? 'افتح حساب الآن' : currentLanguage === 'fr' ? 'Ouvrir un compte maintenant' : 'Open Account Now'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Social Media Links */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="glass-card border border-border rounded-[3rem] p-10 max-w-4xl mx-auto">
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground mb-6">
                {currentLanguage === 'ar' ? 'تابعنا على وسائل التواصل' : currentLanguage === 'fr' ? 'Suivez-nous sur les réseaux sociaux' : 'Follow Us on Social Media'}
              </h3>
              <div className="flex justify-center gap-6 mb-8">
                <a 
                  href="https://www.instagram.com/ahmed_trader_support/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-pink-500/50"
                >
                  <Instagram className="w-8 h-8 text-white" />
                </a>
                <a 
                  href="https://t.me/Ahmed_trader_support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  <Send className="w-8 h-8 text-white" />
                </a>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentLanguage === 'ar' 
                  ? 'إذا كان لديك حساب مفعل وترغب في الانضمام للتوصيات، تواصل معنا عبر الطرق المذكورة أعلاه. نحن هنا لدعمك في رحلتك نحو النجاح المالي!'
                  : currentLanguage === 'fr'
                  ? 'Si vous avez un compte actif et souhaitez rejoindre nos signaux, contactez-nous via les méthodes mentionnées ci-dessus. Nous sommes là pour vous soutenir dans votre voyage vers le succès financier!'
                  : 'If you have an active account and want to join our trading signals, contact us through the methods mentioned above. We are here to support you on your journey to financial success!'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrokersPage;
