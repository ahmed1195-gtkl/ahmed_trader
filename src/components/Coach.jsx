import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { ExternalLink, Award, Users, TrendingUp } from 'lucide-react';
import coachImage from '../assets/coach_mustafa.jpg';

const Coach = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Users, value: "5000+", label: "Students Helped" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" }
  ];

  return (
    <section className="py-20 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('coach.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Coach Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src={coachImage} 
                  alt="Coach Mustafa" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Floating badge */}
                <div className="absolute top-6 left-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm">
                  Expert Trader
                </div>
              </div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-4 mt-6"
              >
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                      <IconComponent className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Coach Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Coach Mustafa
                </h3>
                
                <p className="text-lg text-gray-200 leading-relaxed mb-8">
                  {t('coach.description')}
                </p>

                {/* Key Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-200">AI-Powered Trading Strategies</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-200">Forex & Crypto Expertise</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-200">Proven Track Record</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-200">Personalized Mentorship</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105"
                >
                  <ExternalLink className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('coach.learnMore')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coach;

