import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, TrendingDown, DollarSign, Trophy } from 'lucide-react';
import { calculateVirtualBankStats } from '../lib/balanceMonitoringService';

function VirtualBankStatus({ challengeId }) {
  const { i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    
    // تحديث كل 30 ثانية
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [challengeId]);

  const loadStats = async () => {
    try {
      const bankStats = await calculateVirtualBankStats(challengeId);
      setStats(bankStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bank stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const isProfitable = stats.totalProfitLoss >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/10 rounded-3xl p-8 mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
          <Building2 className="w-8 h-8 text-black" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase">
            {i18n.language === 'ar' ? '🏦 حالة البنك الافتراضي' : '🏦 Virtual Bank Status'}
          </h2>
          <p className="text-gray-400 text-sm">
            {i18n.language === 'ar' 
              ? 'مجموع أرصدة جميع المشاركين من حساباتهم التجريبية'
              : 'Total balance from all participants\' demo accounts'}
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Total Bank Balance */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-yellow-500" />
              <div className="text-sm font-bold text-gray-400 uppercase">
                {i18n.language === 'ar' ? 'رصيد البنك الكلي' : 'Total Bank Balance'}
              </div>
            </div>
          </div>
          <div className="text-4xl font-black text-white mb-2">
            ${stats.totalCurrentBalance?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {i18n.language === 'ar' ? 'الرصيد الأولي: ' : 'Initial: '}
            ${stats.totalInitialBalance?.toLocaleString()}
          </div>
        </div>

        {/* Total Profit/Loss */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isProfitable ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
              <div className="text-sm font-bold text-gray-400 uppercase">
                {i18n.language === 'ar' ? 'الأرباح/الخسائر الكلية' : 'Total Profit/Loss'}
              </div>
            </div>
          </div>
          <div className={`text-4xl font-black mb-2 ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitable ? '+' : ''}${stats.totalProfitLoss?.toLocaleString()}
          </div>
          <div className={`text-sm font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}{stats.totalProfitLossPercent?.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Active Participants */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div className="text-xs font-bold text-gray-500 uppercase">
              {i18n.language === 'ar' ? 'المشاركون النشطون' : 'Active Participants'}
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalParticipants}
          </div>
        </div>

        {/* Average Balance */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <div className="text-xs font-bold text-gray-500 uppercase">
              {i18n.language === 'ar' ? 'متوسط الرصيد' : 'Average Balance'}
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ${stats.totalParticipants > 0 
              ? Math.floor(stats.totalCurrentBalance / stats.totalParticipants).toLocaleString()
              : 0}
          </div>
        </div>

        {/* Status */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div className="text-xs font-bold text-gray-500 uppercase">
              {i18n.language === 'ar' ? 'الحالة' : 'Status'}
            </div>
          </div>
          <div className="text-lg font-black text-yellow-500">
            {i18n.language === 'ar' ? 'نشط' : 'Active'}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-black">ℹ</span>
          </div>
          <div className="text-sm text-blue-400">
            {i18n.language === 'ar'
              ? 'يتم تحديث الأرصدة تلقائياً كل 30 ثانية من الحسابات التجريبية الحقيقية للمشاركين. جميع البيانات حقيقية ومتزامنة مباشرة من الوسطاء.'
              : 'Balances are automatically updated every 30 seconds from participants\' real demo accounts. All data is real and synced directly from brokers.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default VirtualBankStatus;
