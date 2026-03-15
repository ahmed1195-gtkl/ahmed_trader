import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Plus, Users, Activity, DollarSign, TrendingUp, Eye, Trash2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { createChallenge, CHALLENGE_LEVELS } from '../lib/challengeEngine';

function ChallengeAdmin() {
  const { t, i18n } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipants: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('silver');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // تحميل التحديات
      const challengesQuery = query(
        collection(db, 'challenges'),
        orderBy('createdAt', 'desc')
      );
      const challengesSnap = await getDocs(challengesQuery);
      const challengesData = challengesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChallenges(challengesData);

      // تحميل المشاركين
      const participantsSnap = await getDocs(collection(db, 'challenge_participants'));
      const participantsData = participantsSnap.docs.map(doc => doc.data());
      setParticipants(participantsData);

      // حساب الإحصائيات
      const activeChallenges = challengesData.filter(c => c.status === 'active').length;
      const totalRevenue = participantsData.reduce((sum, p) => {
        const challenge = challengesData.find(c => c.id === p.challengeId);
        return sum + (challenge ? challenge.fee : 0);
      }, 0);

      setStats({
        totalChallenges: challengesData.length,
        activeChallenges,
        totalParticipants: participantsData.length,
        totalRevenue
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const result = await createChallenge(selectedLevel, maxParticipants);
      const message = i18n.language === 'ar' 
        ? `تم إنشاء التحدي بنجاح!\n\nكود الدعوة: ${result.inviteCode}\n\nشارك هذا الكود مع المتداولين للانضمام`
        : `Challenge created successfully!\n\nInvite Code: ${result.inviteCode}\n\nShare this code with traders to join`;
      alert(message);
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!confirm(i18n.language === 'ar' ? 'هل تريد حذف هذا التحدي؟' : 'Delete this challenge?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'challenges', challengeId));
      alert(i18n.language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert(error.message);
    }
  };

  const getLevelConfig = (level) => {
    return CHALLENGE_LEVELS[level.toUpperCase()];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
              {i18n.language === 'ar' ? 'إدارة التحديات' : 'Challenge Management'}
            </h1>
            <p className="text-gray-400">
              {i18n.language === 'ar' ? 'إنشاء وإدارة التحديات التنافسية' : 'Create and manage trading challenges'}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-xl font-black text-sm uppercase hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {i18n.language === 'ar' ? 'تحدي جديد' : 'New Challenge'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalChallenges}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {i18n.language === 'ar' ? 'إجمالي التحديات' : 'Total Challenges'}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.activeChallenges}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {i18n.language === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalParticipants}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {i18n.language === 'ar' ? 'إجمالي المشاركين' : 'Total Participants'}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              ${stats.totalRevenue}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {i18n.language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-black text-white uppercase">
              {i18n.language === 'ar' ? 'جميع التحديات' : 'All Challenges'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'المعرف' : 'ID'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'المستوى' : 'Level'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'المشاركون' : 'Participants'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'الرسوم' : 'Fee'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {i18n.language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((challenge) => {
                  const config = getLevelConfig(challenge.level);
                  return (
                    <tr key={challenge.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 font-mono">
                          {challenge.id.substring(0, 12)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="text-sm font-bold text-white">
                            {i18n.language === 'ar' ? config.nameAr : config.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          challenge.status === 'waiting' ? 'bg-amber-500/10 text-amber-500' :
                          challenge.status === 'active' ? 'bg-green-500/10 text-green-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {challenge.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-bold">
                          {challenge.currentParticipants} / {challenge.maxParticipants}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-bold">
                          ${challenge.fee}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(`/challenge/${challenge.id}`, '_blank')}
                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Challenge Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black text-white uppercase mb-6">
                {i18n.language === 'ar' ? 'إنشاء تحدي جديد' : 'Create New Challenge'}
              </h2>

              <form onSubmit={handleCreateChallenge} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-4 uppercase">
                    {i18n.language === 'ar' ? 'المستوى' : 'Level'}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.values(CHALLENGE_LEVELS).map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSelectedLevel(level.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedLevel === level.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-white/10 bg-black hover:border-white/20'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: `${level.color}40` }}
                        />
                        <div className="text-sm font-bold text-white">
                          {i18n.language === 'ar' ? level.nameAr : level.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ${level.fee}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                    {i18n.language === 'ar' ? 'الحد الأقصى للمشاركين' : 'Max Participants'}
                  </label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                    min="2"
                    max="100"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase hover:bg-white/10 transition-all"
                  >
                    {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-4 bg-amber-500 text-black rounded-xl font-bold uppercase hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {creating 
                      ? (i18n.language === 'ar' ? 'جاري الإنشاء...' : 'Creating...')
                      : (i18n.language === 'ar' ? 'إنشاء' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengeAdmin;
