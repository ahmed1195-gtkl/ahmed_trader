import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Copy, Check, UserPlus, UserMinus, Crown, Share2, QrCode } from 'lucide-react';
import { auth } from '../lib/firebase';
import { createTeam, getUserTeam, getTeamStats, removeMember } from '../lib/teamService';
import TeamChat from './TeamChat';

function TeamManagement({ challengeId, participantId }) {
  const { i18n } = useTranslation();
  const [team, setTeam] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    loadTeam();
  }, [challengeId]);

  const loadTeam = async () => {
    if (!user || !challengeId) return;

    try {
      const userTeam = await getUserTeam(user.uid, challengeId);
      setTeam(userTeam);

      if (userTeam) {
        const stats = await getTeamStats(userTeam.id);
        setTeamStats(stats);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading team:', error);
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const result = await createTeam(
        challengeId,
        user.uid,
        user.displayName || 'Anonymous',
        teamName || `${user.displayName}'s Team`
      );

      alert(i18n.language === 'ar' 
        ? `تم إنشاء الفريق! كود الدعوة: ${result.inviteCode}`
        : `Team created! Invite code: ${result.inviteCode}`
      );

      setShowCreateModal(false);
      loadTeam();
    } catch (error) {
      console.error('Error creating team:', error);
      alert(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (!team) return;

    const inviteLink = `${window.location.origin}/#/join-team/${team.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(i18n.language === 'ar' 
      ? `هل تريد طرد ${memberName} من الفريق؟`
      : `Remove ${memberName} from the team?`
    )) {
      return;
    }

    try {
      await removeMember(team.id, user.uid, memberId, memberName);
      alert(i18n.language === 'ar' ? 'تم الطرد بنجاح' : 'Member removed successfully');
      loadTeam();
    } catch (error) {
      console.error('Error removing member:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white uppercase mb-2">
            {i18n.language === 'ar' ? 'انضم إلى فريق' : 'Join a Team'}
          </h3>
          <p className="text-gray-400 mb-6">
            {i18n.language === 'ar'
              ? 'أنشئ فريقك الخاص أو انضم إلى فريق موجود باستخدام كود الدعوة'
              : 'Create your own team or join an existing one with an invite code'}
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-amber-500 text-black rounded-xl font-black text-sm uppercase hover:bg-amber-400 transition-all"
          >
            {i18n.language === 'ar' ? 'إنشاء فريق' : 'Create Team'}
          </button>
        </div>

        {/* Create Team Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-black text-white uppercase mb-6">
                {i18n.language === 'ar' ? 'إنشاء فريق جديد' : 'Create New Team'}
              </h2>

              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">
                    {i18n.language === 'ar' ? 'اسم الفريق' : 'Team Name'}
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder={i18n.language === 'ar' ? 'أدخل اسم الفريق' : 'Enter team name'}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
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
    );
  }

  const isLeader = team.leaderId === user?.uid;

  return (
    <div className="space-y-6">
      {/* Team Info */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{team.name}</h3>
              <p className="text-sm text-gray-500">
                {team.totalMembers} {i18n.language === 'ar' ? 'أعضاء' : 'members'}
              </p>
            </div>
          </div>

          {isLeader && (
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-amber-500">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-black uppercase">
                  {i18n.language === 'ar' ? 'القائد' : 'Leader'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Invite Code */}
        <div className="bg-black border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase mb-1">
                {i18n.language === 'ar' ? 'كود الدعوة' : 'Invite Code'}
              </div>
              <div className="text-2xl font-black text-amber-500 tracking-wider">
                {team.inviteCode}
              </div>
            </div>
            <button
              onClick={handleCopyInviteCode}
              className="px-4 py-2 bg-amber-500 text-black rounded-lg font-bold text-sm hover:bg-amber-400 transition-all flex items-center gap-2"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4" />
                  {i18n.language === 'ar' ? 'تم النسخ' : 'Copied'}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {i18n.language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Team Stats */}
        {teamStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-1">
                {i18n.language === 'ar' ? 'الرصيد الإجمالي' : 'Total Balance'}
              </div>
              <div className="text-xl font-black text-white">
                ${teamStats.totalBalance?.toLocaleString()}
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-1">
                {i18n.language === 'ar' ? 'الأرباح الإجمالية' : 'Total Profit'}
              </div>
              <div className={`text-xl font-black ${teamStats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${teamStats.totalProfit?.toLocaleString()}
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-1">
                {i18n.language === 'ar' ? 'إجمالي الصفقات' : 'Total Trades'}
              </div>
              <div className="text-xl font-black text-white">
                {teamStats.totalTrades}
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase mb-1">
                {i18n.language === 'ar' ? 'متوسط الانخفاض' : 'Avg Drawdown'}
              </div>
              <div className="text-xl font-black text-orange-500">
                {teamStats.avgDrawdown?.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Members List */}
        <div>
          <h4 className="text-sm font-black text-gray-500 uppercase mb-4">
            {i18n.language === 'ar' ? 'الأعضاء' : 'Members'}
          </h4>
          <div className="space-y-2">
            {team.members.map((memberId, index) => {
              const memberName = team.memberNames[index];
              const isCurrentUser = memberId === user?.uid;
              const memberIsLeader = memberId === team.leaderId;

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between bg-black border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-black font-black">
                      {memberName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {memberName}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({i18n.language === 'ar' ? 'أنت' : 'You'})
                          </span>
                        )}
                      </div>
                      {memberIsLeader && (
                        <div className="flex items-center gap-1 text-xs text-amber-500">
                          <Crown className="w-3 h-3" />
                          {i18n.language === 'ar' ? 'قائد الفريق' : 'Team Leader'}
                        </div>
                      )}
                    </div>
                  </div>

                  {isLeader && !memberIsLeader && (
                    <button
                      onClick={() => handleRemoveMember(memberId, memberName)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Chat */}
      <TeamChat teamId={team.id} teamName={team.name} />
    </div>
  );
}

export default TeamManagement;
