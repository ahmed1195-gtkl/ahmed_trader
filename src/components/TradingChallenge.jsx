import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Shield, Users, Clock, Target, Award, ChevronRight } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CHALLENGE_LEVELS } from '../lib/challengeEngine';
import Header from './Header';
import Footer from './Footer';

function TradingChallenge() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [topTraders, setTopTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    loadChallenges();
    loadTopTraders();
  }, []);

  const loadChallenges = async () => {
    try {
      const challengesQuery = query(
        collection(db, 'challenges'),
        where('status', 'in', ['waiting', 'active']),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      const snapshot = await getDocs(challengesQuery);
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setActiveChallenges(challenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
      // تجاهل الخطأ واستمر في عرض الصفحة
      setActiveChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTopTraders = async () => {
    try {
      const participantsQuery = query(
        collection(db, 'challenge_participants'),
        where('status', '==', 'passed'),
        orderBy('profitLossPercent', 'desc'),
        limit(5)
      );
      
      const snapshot = await getDocs(participantsQuery);
      const traders = snapshot.docs.map(doc => doc.data());
      
      setTopTraders(traders);
    } catch (error) {
      console.error('Error loading top traders:', error);
      // تجاهل الخطأ واستمر في عرض الصفحة
      setTopTraders([]);
    }
  };

  const getLevelConfig = (level) => {
    return CHALLENGE_LEVELS[level.toUpperCase()];
  };

  const handleJoinChallenge = (challengeId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/challenge/${challengeId}`);
  };

  const handleCreateChallenge = (level) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/challenge/create/${level}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-black text-sm uppercase tracking-widest">
                {i18n.language === 'ar' ? 'التحديات التنافسية' : i18n.language === 'fr' ? 'Défis Compétitifs' : 'Trading Challenges'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
              {i18n.language === 'ar' ? 'اختبر مهاراتك' : i18n.language === 'fr' ? 'Testez Vos Compétences' : 'Test Your Skills'}
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {i18n.language === 'ar' 
                ? 'تنافس مع متداولين آخرين في بيئة تداول حقيقية. حقق الأهداف واحصل على حساب تداول ممول.'
                : i18n.language === 'fr'
                ? 'Compétez avec d\'autres traders dans un environnement de trading réel. Atteignez les objectifs et obtenez un compte de trading financé.'
                : 'Compete with other traders in a real trading environment. Achieve goals and get a funded trading account.'}
            </p>
          </motion.div>

          {/* Challenge Levels */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {Object.values(CHALLENGE_LEVELS).map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 hover:border-amber-500/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${level.color}20`, border: `2px solid ${level.color}40` }}
                  >
                    <Award className="w-8 h-8" style={{ color: level.color }} />
                  </div>
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="text-2xl font-black text-green-500">✅ FREE</div>
                    <div className="text-xs text-green-400 uppercase tracking-wider">
                      {i18n.language === 'ar' ? 'مجاني 100%' : i18n.language === 'fr' ? 'Gratuit' : '100% Free'}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  {i18n.language === 'ar' ? level.nameAr : i18n.language === 'fr' ? level.nameFr : level.name}
                </h3>
                
                <p className="text-sm text-gray-400 mb-6">
                  {i18n.language === 'ar' ? level.descriptionAr : i18n.language === 'fr' ? level.descriptionFr : level.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-gray-500">
                      {i18n.language === 'ar' ? 'المدة' : i18n.language === 'fr' ? 'Durée' : 'Duration'}
                    </span>
                    <span className="text-sm font-bold text-white">{level.duration} {i18n.language === 'ar' ? 'يوم' : i18n.language === 'fr' ? 'jours' : 'days'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-gray-500">
                      {i18n.language === 'ar' ? 'هدف الربح' : i18n.language === 'fr' ? 'Objectif' : 'Profit Target'}
                    </span>
                    <span className="text-sm font-bold text-green-500">+{level.profitTargetPercent}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-gray-500">Max Drawdown</span>
                    <span className="text-sm font-bold text-red-500">{level.maxDrawdownPercent}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-sm text-gray-500">
                      {i18n.language === 'ar' ? 'الرصيد الأولي' : i18n.language === 'fr' ? 'Solde Initial' : 'Initial Balance'}
                    </span>
                    <span className="text-sm font-bold text-white">${level.initialBalance.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">
                      {i18n.language === 'ar' ? 'الحد الأدنى للصفقات' : i18n.language === 'fr' ? 'Trades Min' : 'Min Trades'}
                    </span>
                    <span className="text-sm font-bold text-white">{level.minTrades}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateChallenge(level.id)}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:gap-4"
                  style={{ 
                    backgroundColor: `${level.color}20`,
                    border: `2px solid ${level.color}40`,
                    color: level.color
                  }}
                >
                  {i18n.language === 'ar' ? 'ابدأ التحدي' : i18n.language === 'fr' ? 'Commencer' : 'Start Challenge'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20"
            >
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-amber-500" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  {i18n.language === 'ar' ? 'التحديات النشطة' : i18n.language === 'fr' ? 'Défis Actifs' : 'Active Challenges'}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {activeChallenges.map((challenge) => {
                  const config = getLevelConfig(challenge.level);
                  return (
                    <div
                      key={challenge.id}
                      className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 transition-all cursor-pointer"
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: config.color }}
                            />
                            <span className="text-sm font-bold text-white uppercase">
                              {i18n.language === 'ar' ? config.nameAr : i18n.language === 'fr' ? config.nameFr : config.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {challenge.id.substring(0, 12)}...
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          challenge.status === 'waiting' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-green-500/10 text-green-500'
                        }`}>
                          {challenge.status === 'waiting' 
                            ? (i18n.language === 'ar' ? 'في الانتظار' : i18n.language === 'fr' ? 'En Attente' : 'Waiting')
                            : (i18n.language === 'ar' ? 'نشط' : i18n.language === 'fr' ? 'Actif' : 'Active')}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">
                            {i18n.language === 'ar' ? 'المشاركون' : i18n.language === 'fr' ? 'Participants' : 'Participants'}
                          </div>
                          <div className="text-white font-bold">
                            {challenge.currentParticipants} / {challenge.maxParticipants}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Top Traders */}
          {topTraders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  {i18n.language === 'ar' ? 'أفضل المتداولين' : i18n.language === 'fr' ? 'Meilleurs Traders' : 'Top Traders'}
                </h2>
              </div>

              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {topTraders.map((trader, index) => (
                  <div
                    key={trader.id}
                    className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                        index === 0 ? 'bg-amber-500/20 text-amber-500' :
                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                        index === 2 ? 'bg-orange-600/20 text-orange-600' :
                        'bg-white/5 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div>
                        <div className="text-white font-bold">{trader.userName}</div>
                        <div className="text-xs text-gray-500">
                          {trader.totalTrades} {i18n.language === 'ar' ? 'صفقة' : i18n.language === 'fr' ? 'trades' : 'trades'} • {trader.winRate.toFixed(1)}% {i18n.language === 'ar' ? 'نسبة الفوز' : i18n.language === 'fr' ? 'win rate' : 'win rate'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-black text-green-500">
                        +{trader.profitLossPercent.toFixed(2)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        ${trader.balance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {i18n.language === 'ar' ? 'أسواق حقيقية' : i18n.language === 'fr' ? 'Marchés Réels' : 'Real Markets'}
              </h3>
              <p className="text-sm text-gray-400">
                {i18n.language === 'ar' 
                  ? 'تداول بأسعار حقيقية من الأسواق العالمية'
                  : i18n.language === 'fr'
                  ? 'Tradez avec des prix réels des marchés mondiaux'
                  : 'Trade with real prices from global markets'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {i18n.language === 'ar' ? 'إدارة مخاطر صارمة' : i18n.language === 'fr' ? 'Gestion Stricte' : 'Strict Risk Management'}
              </h3>
              <p className="text-sm text-gray-400">
                {i18n.language === 'ar' 
                  ? 'تعلم الانضباط من خلال قواعد واضحة'
                  : i18n.language === 'fr'
                  ? 'Apprenez la discipline avec des règles claires'
                  : 'Learn discipline through clear rules'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {i18n.language === 'ar' ? 'حسابات ممولة' : i18n.language === 'fr' ? 'Comptes Financés' : 'Funded Accounts'}
              </h3>
              <p className="text-sm text-gray-400">
                {i18n.language === 'ar' 
                  ? 'احصل على حساب تداول ممول عند النجاح'
                  : i18n.language === 'fr'
                  ? 'Obtenez un compte financé en cas de succès'
                  : 'Get a funded account upon success'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TradingChallenge;
