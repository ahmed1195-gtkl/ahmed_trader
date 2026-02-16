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

function TradingChallengeTest() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [topTraders, setTopTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const init = async () => {
      try {
        await loadChallenges();
        await loadTopTraders();
      } catch (err) {
        console.error('Init error:', err);
        setError(err.message);
      }
    };
    init();
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
      setTopTraders([]);
    }
  };

  const getLevelConfig = (level) => {
    return CHALLENGE_LEVELS[level?.toUpperCase()] || CHALLENGE_LEVELS.BRONZE;
  };

  const handleJoinChallenge = (challengeId) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/challenge/${challengeId}`);
  };

  const handleCreateChallenge = async (level) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      // Import challengeEngine functions
      const { createChallenge, joinChallenge } = await import('../lib/challengeEngine');
      
      // Create a new challenge (level, maxParticipants)
      const challengeId = await createChallenge(level, 10);
      
      // Join the challenge (challengeId, userId, userName)
      const userName = user.displayName || user.email || 'User';
      const participantId = await joinChallenge(challengeId, user.uid, userName);
      
      // Navigate to challenge dashboard
      navigate(`/challenge/${participantId}`);
    } catch (error) {
      console.error('Error creating challenge:', error);
      const errorMessage = i18n.language === 'ar' 
        ? `فشل إنشاء التحدي: ${error.message}`
        : `Failed to create challenge: ${error.message}`;
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold">
            {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-red-500 mb-4">خطأ / Error</h2>
              <p className="text-white">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-black text-sm uppercase tracking-widest">
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
                className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 hover:border-yellow-500/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${level.color}20` }}
                  >
                    <Trophy className="w-6 h-6" style={{ color: level.color }} />
                  </div>
                  
                  <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="text-green-500 font-black text-xs uppercase tracking-wider">
                      FREE
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                  {i18n.language === 'ar' ? level.nameAr : i18n.language === 'fr' ? level.nameFr : level.name}
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  {i18n.language === 'ar' ? level.descriptionAr : i18n.language === 'fr' ? level.descriptionFr : level.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {i18n.language === 'ar' ? 'هدف الربح' : i18n.language === 'fr' ? 'Objectif' : 'Profit Target'}
                    </span>
                    <span className="text-white font-bold">+{level.profitTargetPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {i18n.language === 'ar' ? 'أقصى خسارة' : i18n.language === 'fr' ? 'Drawdown Max' : 'Max Drawdown'}
                    </span>
                    <span className="text-white font-bold">{level.maxDrawdownPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {i18n.language === 'ar' ? 'المدة' : i18n.language === 'fr' ? 'Durée' : 'Duration'}
                    </span>
                    <span className="text-white font-bold">
                      {level.duration} {i18n.language === 'ar' ? 'يوم' : i18n.language === 'fr' ? 'jours' : 'days'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCreateChallenge(level.id)}
                  className="w-full bg-white hover:bg-yellow-500 text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all group-hover:scale-105"
                >
                  {i18n.language === 'ar' ? 'انضم الآن' : i18n.language === 'fr' ? 'Rejoindre' : 'Join Challenge'}
                </button>
              </motion.div>
            ))}
          </div>


        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TradingChallengeTest;
