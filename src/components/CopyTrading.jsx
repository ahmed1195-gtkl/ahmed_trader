import { useState, useEffect } from 'react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Users, 
  TrendingUp, 
  Award, 
  Settings as SettingsIcon,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  enableCopyTrading,
  disableCopyTrading,
  getAvailableLeadersInTeam,
  getUserCopyTradingRelations,
  updateCopyTradingSettings
} from '../lib/copyTradingService';
import { getUserTeams } from '../lib/teamService';

export default function CopyTrading() {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [availableLeaders, setAvailableLeaders] = useState([]);
  const [copyRelations, setCopyRelations] = useState({ following: [], followers: [] });
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [allocationPercent, setAllocationPercent] = useState(30);
  const [settings, setSettings] = useState({
    copyStopLoss: true,
    copyTakeProfit: true,
    maxTradesPerDay: 20,
    minTradeSize: 0.01,
    maxTradeSize: 10,
    reverseMode: false
  });

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);

      // جلب الفرق
      const userTeams = await getUserTeams(currentUser.uid);
      setTeams(userTeams);

      if (userTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(userTeams[0].id);
      }

      // جلب علاقات Copy Trading
      const relations = await getUserCopyTradingRelations(currentUser.uid);
      setCopyRelations(relations);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      loadLeaders();
    }
  }, [selectedTeam]);

  const loadLeaders = async () => {
    try {
      const leaders = await getAvailableLeadersInTeam(selectedTeam, currentUser.uid);
      setAvailableLeaders(leaders);
    } catch (error) {
      console.error('Error loading leaders:', error);
    }
  };

  const handleEnableCopyTrading = async () => {
    try {
      if (!selectedLeader) return;

      await enableCopyTrading(
        currentUser.uid,
        selectedLeader.userId,
        selectedTeam,
        allocationPercent,
        settings
      );

      alert(t('copyTrading.enabled'));
      setShowSetupModal(false);
      loadData();
    } catch (error) {
      console.error('Error enabling copy trading:', error);
      alert(error.message);
    }
  };

  const handleDisableCopyTrading = async (leaderId) => {
    if (!confirm(t('copyTrading.confirmDisable'))) return;

    try {
      await disableCopyTrading(currentUser.uid, leaderId);
      alert(t('copyTrading.disabled'));
      loadData();
    } catch (error) {
      console.error('Error disabling copy trading:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground text-xl">{t('loading')}...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Copy className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t('copyTrading.title')}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t('copyTrading.description')}
        </p>
      </motion.div>

      {/* اختيار الفريق */}
      {teams.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t('copyTrading.selectTeam')}
          </label>
          <select
            value={selectedTeam || ''}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {teams.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
          <h3 className="text-xl font-bold mb-2">{t('copyTrading.noTeams')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('copyTrading.joinTeamFirst')}
          </p>
          <a
            href="/teams"
            className="inline-block bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition"
          >
            {t('copyTrading.goToTeams')}
          </a>
        </div>
      )}

      {/* المتداولون المتاحون للنسخ */}
      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">
            {t('copyTrading.availableTraders')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLeaders.map(leader => (
              <motion.div
                key={leader.userId}
                whileHover={{ scale: 1.02 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-amber-500 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  {leader.photoURL ? (
                    <img src={leader.photoURL}
                      alt={leader.displayName}
                      className="w-12 h-12 rounded-full"
                    decoding="async" loading="lazy" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
                      {leader.displayName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{leader.displayName}</h3>
                    <p className="text-sm text-gray-400">
                      {leader.statistics.followers} {t('copyTrading.followers')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('copyTrading.avgProfit')}</span>
                    <span className={leader.statistics.avgProfitPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {leader.statistics.avgProfitPercent >= 0 ? '+' : ''}
                      {leader.statistics.avgProfitPercent}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('copyTrading.winRate')}</span>
                    <span className="text-white">
                      {leader.statistics.avgWinRate}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('copyTrading.totalTrades')}</span>
                    <span className="text-white">
                      {leader.statistics.totalTrades}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('copyTrading.passedChallenges')}</span>
                    <span className="text-amber-500 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {leader.statistics.passedChallenges}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLeader(leader);
                    setShowSetupModal(true);
                  }}
                  className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {t('copyTrading.startCopying')}
                </button>
              </motion.div>
            ))}
          </div>

          {availableLeaders.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              {t('copyTrading.noTradersAvailable')}
            </div>
          )}
        </motion.div>
      )}

      {/* المتداولون الذين أتابعهم */}
      {copyRelations.following.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">
            {t('copyTrading.following')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copyRelations.following.map(relation => (
              <div
                key={relation.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {relation.leaderInfo.photoURL ? (
                      <img src={relation.leaderInfo.photoURL}
                        alt={relation.leaderInfo.displayName}
                        className="w-10 h-10 rounded-full"
                      decoding="async" loading="lazy" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
                        {relation.leaderInfo.displayName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{relation.leaderInfo.displayName}</h3>
                      <p className="text-sm text-gray-400">
                        {relation.allocationPercent}% {t('copyTrading.allocated')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDisableCopyTrading(relation.leaderId)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('copyTrading.copiedTrades')}</span>
                    <span className="text-white">{relation.statistics.totalCopiedTrades}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('copyTrading.totalProfit')}</span>
                    <span className={relation.statistics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {relation.statistics.totalProfit >= 0 ? '+' : ''}
                      ${Math.abs(relation.statistics.totalProfit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* المتابعون لي */}
      {copyRelations.followers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {t('copyTrading.myFollowers')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {copyRelations.followers.map(relation => (
              <div
                key={relation.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  {relation.followerInfo.photoURL ? (
                    <img src={relation.followerInfo.photoURL}
                      alt={relation.followerInfo.displayName}
                      className="w-10 h-10 rounded-full"
                    decoding="async" loading="lazy" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
                      {relation.followerInfo.displayName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{relation.followerInfo.displayName}</h3>
                    <p className="text-sm text-gray-400">
                      {relation.allocationPercent}% {t('copyTrading.allocation')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal إعداد Copy Trading */}
      {showSetupModal && selectedLeader && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {t('copyTrading.setupCopying')}
              </h3>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedLeader.photoURL ? (
                  <img src={selectedLeader.photoURL}
                    alt={selectedLeader.displayName}
                    className="w-12 h-12 rounded-full"
                  decoding="async" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
                    {selectedLeader.displayName[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-bold">{selectedLeader.displayName}</h4>
                  <p className="text-sm text-gray-400">
                    {selectedLeader.statistics.avgProfitPercent >= 0 ? '+' : ''}
                    {selectedLeader.statistics.avgProfitPercent}% {t('copyTrading.avgProfit')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('copyTrading.allocationPercent')}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={allocationPercent}
                  onChange={(e) => setAllocationPercent(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>1%</span>
                  <span className="text-amber-500 font-bold">{allocationPercent}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.copyStopLoss}
                    onChange={(e) => setSettings({ ...settings, copyStopLoss: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('copyTrading.copyStopLoss')}</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.copyTakeProfit}
                    onChange={(e) => setSettings({ ...settings, copyTakeProfit: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('copyTrading.copyTakeProfit')}</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.reverseMode}
                    onChange={(e) => setSettings({ ...settings, reverseMode: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{t('copyTrading.reverseMode')}</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleEnableCopyTrading}
              className="w-full bg-amber-500 text-black py-3 rounded-lg font-semibold hover:bg-amber-400 transition flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {t('copyTrading.confirm')}
            </button>
          </motion.div>
        </div>
      )}
      </div>
    </>
  );
}
