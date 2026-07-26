import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

function TradingChallengeSimple() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-black text-sm uppercase tracking-widest">
                {i18n.language === 'ar' ? 'التحديات التنافسية' : 'Trading Challenges'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-foreground uppercase tracking-tighter mb-6">
              {i18n.language === 'ar' ? 'اختبر مهاراتك' : 'Test Your Skills'}
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {i18n.language === 'ar' 
                ? 'تنافس مع متداولين آخرين في بيئة تداول حقيقية. حقق الأهداف واحصل على حساب تداول ممول.'
                : 'Compete with other traders in a real trading environment. Achieve goals and get a funded trading account.'}
            </p>
          </motion.div>

          <div className="text-center text-white">
            <p className="text-2xl font-bold mb-4">الصفحة قيد التطوير</p>
            <p className="text-gray-400">Page Under Development</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TradingChallengeSimple;
