import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Medal, Crown, Star, Filter } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function GlobalLeaderboard() {
  const { t, i18n } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, bronze, silver, gold

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = () => {
    setLoading(true);

    // استعلام لجلب أفضل 10 متداولين
    let q = query(
      collection(db, 'global_leaderboard'),
      orderBy('totalProfit', 'desc'),
      limit(10)
    );

    if (filter !== 'all') {
      q = query(
        collection(db, 'global_leaderboard'),
        where('bestChallenge.level', '==', filter),
        orderBy('totalProfit', 'desc'),
        limit(10)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setLeaderboard(data);
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-amber-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-600" />;
      default:
        return <span className="text-2xl font-black text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-500 to-amber-600';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-500 to-orange-600';
      default:
        return 'bg-zinc-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      default:
        return '#888888';
    }
  };

  const getLevelName = (level) => {
    if (i18n.language === 'ar') {
      return level === 'bronze' ? 'برونزي' : level === 'silver' ? 'فضي' : 'ذهبي';
    }
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 to-black border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Trophy className="w-16 h-16 text-amber-500" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
              {i18n.language === 'ar' ? 'قادة المنصة' : i18n.language === 'fr' ? 'Leaders de la Plateforme' : 'Platform Leaders'}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {i18n.language === 'ar' 
                ? 'أفضل 10 متداولين على مستوى المنصة بناءً على الأداء الإجمالي'
                : i18n.language === 'fr'
                ? 'Top 10 des traders de la plateforme basé sur la performance globale'
                : 'Top 10 traders on the platform based on overall performance'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-black text-sm uppercase transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {i18n.language === 'ar' ? 'الكل' : i18n.language === 'fr' ? 'Tous' : 'All'}
          </button>
          <button
            onClick={() => setFilter('bronze')}
            className={`px-6 py-3 rounded-xl font-black text-sm uppercase transition-all ${
              filter === 'bronze'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {i18n.language === 'ar' ? 'برونزي' : i18n.language === 'fr' ? 'Bronze' : 'Bronze'}
          </button>
          <button
            onClick={() => setFilter('silver')}
            className={`px-6 py-3 rounded-xl font-black text-sm uppercase transition-all ${
              filter === 'silver'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {i18n.language === 'ar' ? 'فضي' : i18n.language === 'fr' ? 'Argent' : 'Silver'}
          </button>
          <button
            onClick={() => setFilter('gold')}
            className={`px-6 py-3 rounded-xl font-black text-sm uppercase transition-all ${
              filter === 'gold'
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {i18n.language === 'ar' ? 'ذهبي' : i18n.language === 'fr' ? 'Or' : 'Gold'}
          </button>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-1"
            >
              <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-2 border-gray-400 rounded-3xl p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <Medal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-4xl font-black text-white mb-2">
                    {leaderboard[1].userName}
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    {i18n.language === 'ar' ? 'المركز الثاني' : '2nd Place'}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-black text-green-500 mb-1">
                      ${leaderboard[1].totalProfit?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'إجمالي الأرباح' : 'Total Profit'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-black text-white">
                        {leaderboard[1].passedChallenges}/{leaderboard[1].totalChallenges}
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'النجاحات' : 'Passed'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {leaderboard[1].averageReturn?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'متوسط العائد' : 'Avg Return'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 md:order-2"
            >
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-500 rounded-3xl p-8 text-center h-full flex flex-col justify-between transform md:scale-110">
                <div>
                  <Crown className="w-20 h-20 text-amber-500 mx-auto mb-4" />
                  <div className="text-5xl font-black text-white mb-2">
                    {leaderboard[0].userName}
                  </div>
                  <div className="text-sm text-amber-500 mb-6 font-black uppercase">
                    {i18n.language === 'ar' ? '🏆 البطل' : '🏆 Champion'}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-4xl font-black text-green-500 mb-1">
                      ${leaderboard[0].totalProfit?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'إجمالي الأرباح' : 'Total Profit'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-black text-white">
                        {leaderboard[0].passedChallenges}/{leaderboard[0].totalChallenges}
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'النجاحات' : 'Passed'}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">
                        {leaderboard[0].averageReturn?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'متوسط العائد' : 'Avg Return'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3"
            >
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500 rounded-3xl p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <Award className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <div className="text-4xl font-black text-white mb-2">
                    {leaderboard[2].userName}
                  </div>
                  <div className="text-sm text-gray-400 mb-6">
                    {i18n.language === 'ar' ? 'المركز الثالث' : '3rd Place'}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-black text-green-500 mb-1">
                      ${leaderboard[2].totalProfit?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'إجمالي الأرباح' : 'Total Profit'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-black text-white">
                        {leaderboard[2].passedChallenges}/{leaderboard[2].totalChallenges}
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'النجاحات' : 'Passed'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">
                        {leaderboard[2].averageReturn?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {i18n.language === 'ar' ? 'متوسط العائد' : 'Avg Return'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rest of Leaderboard (4-10) */}
        {leaderboard.length > 3 && (
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'المركز' : 'Rank'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'المتداول' : 'Trader'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'إجمالي الأرباح' : 'Total Profit'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'النجاحات' : 'Passed'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'متوسط العائد' : 'Avg Return'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'معدل الفوز' : 'Win Rate'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      {i18n.language === 'ar' ? 'أفضل تحدي' : 'Best Challenge'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(3).map((trader) => (
                    <motion.tr
                      key={trader.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="text-2xl font-black text-gray-400">
                          #{trader.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-white">
                          {trader.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-black text-green-500">
                          ${trader.totalProfit?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-white">
                          {trader.passedChallenges} / {trader.totalChallenges}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-amber-500">
                          {trader.averageReturn?.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue-500">
                          {trader.winRate?.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getLevelColor(trader.bestChallenge?.level) }}
                          />
                          <span className="text-sm text-gray-400">
                            {getLevelName(trader.bestChallenge?.level)}
                          </span>
                          <span className="text-sm font-bold text-green-500">
                            +{trader.bestChallenge?.return?.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <div className="text-2xl font-black text-gray-600 uppercase mb-2">
              {i18n.language === 'ar' ? 'لا توجد بيانات بعد' : 'No Data Yet'}
            </div>
            <div className="text-gray-500">
              {i18n.language === 'ar' 
                ? 'ابدأ تحدياً لتظهر في القائمة'
                : 'Start a challenge to appear on the leaderboard'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalLeaderboard;
