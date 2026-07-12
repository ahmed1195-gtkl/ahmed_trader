import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { joinTeam, getTeam } from '../lib/teamService';

function JoinTeam() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadTeamInfo();
  }, [inviteCode]);

  const loadTeamInfo = async () => {
    try {
      // في التطبيق الحقيقي، سنحتاج إلى endpoint للحصول على معلومات الفريق من كود الدعوة
      // هنا نستخدم محاكاة بسيطة
      setLoading(false);
    } catch (error) {
      console.error('Error loading team info:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setJoining(true);

    try {
      const result = await joinTeam(
        inviteCode,
        user.uid,
        user.displayName || 'Anonymous'
      );

      // الانتقال إلى صفحة التحدي
      navigate(`/challenge/${result.teamId}`);
    } catch (error) {
      console.error('Error joining team:', error);
      setError(error.message);
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card border border-red-500/20 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-foreground uppercase mb-4">
            {i18n.language === 'ar' ? 'خطأ' : 'Error'}
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/challenges')}
            className="px-8 py-4 bg-amber-500 text-black rounded-xl font-black text-sm uppercase hover:bg-amber-400 transition-all"
          >
            {i18n.language === 'ar' ? 'العودة للتحديات' : 'Back to Challenges'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full glass-card border border-border rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-border p-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Users className="w-10 h-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-foreground text-center mb-2">
            {i18n.language === 'ar' ? 'انضم إلى الفريق' : 'Join Team'}
          </h1>
          <p className="text-muted-foreground text-center">
            {i18n.language === 'ar'
              ? 'لقد تمت دعوتك للانضمام إلى فريق تداول'
              : 'You have been invited to join a trading team'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Invite Code */}
          <div className="bg-secondary border border-border rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase mb-2">
                {i18n.language === 'ar' ? 'كود الدعوة' : 'Invite Code'}
              </div>
              <div className="text-4xl font-black text-amber-500 tracking-wider">
                {inviteCode}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-black text-foreground uppercase mb-4">
              {i18n.language === 'ar' ? 'مميزات الانضمام' : 'Benefits of Joining'}
            </h3>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {i18n.language === 'ar'
                  ? 'تداول جماعي مع أعضاء الفريق'
                  : 'Trade together with team members'}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {i18n.language === 'ar'
                  ? 'دردشة فورية لمشاركة الأفكار والتحليلات'
                  : 'Live chat to share ideas and analysis'}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {i18n.language === 'ar'
                  ? 'مشاهدة أداء الفريق والمنافسة معاً'
                  : 'View team performance and compete together'}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {i18n.language === 'ar'
                  ? 'تنبيهات عند فتح أو إغلاق صفقات الأعضاء'
                  : 'Alerts when members open or close trades'}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-5 bg-amber-500 text-black rounded-xl font-black text-lg uppercase hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {joining ? (
              <>
                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                {i18n.language === 'ar' ? 'جاري الانضمام...' : 'Joining...'}
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6" />
                {i18n.language === 'ar' ? 'انضم الآن' : 'Join Now'}
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            {i18n.language === 'ar'
              ? 'بالانضمام، أنت توافق على مشاركة بيانات أدائك مع أعضاء الفريق'
              : 'By joining, you agree to share your performance data with team members'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default JoinTeam;
