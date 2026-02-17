import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

/**
 * ═══════════════════════════════════════════════════════════════
 * Achievements & Gamification System
 * ═══════════════════════════════════════════════════════════════
 * نظام المكافآت والإنجازات لتحفيز المستخدمين
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * قائمة جميع الإنجازات المتاحة
 */
export const ACHIEVEMENTS = {
  // إنجازات المبتدئين
  FIRST_BLOOD: {
    id: 'first_blood',
    name: {
      en: 'First Blood',
      ar: 'الدم الأول',
      fr: 'Premier Sang'
    },
    description: {
      en: 'Win your first trade',
      ar: 'اربح أول صفقة لك',
      fr: 'Gagnez votre premier trade'
    },
    icon: '🥉',
    rarity: 'common',
    points: 10,
    condition: (stats) => stats.winningTrades >= 1
  },

  FIRST_CHALLENGE: {
    id: 'first_challenge',
    name: {
      en: 'Challenge Accepted',
      ar: 'التحدي مقبول',
      fr: 'Défi Accepté'
    },
    description: {
      en: 'Join your first trading challenge',
      ar: 'انضم لأول تحدي تداول',
      fr: 'Rejoignez votre premier défi'
    },
    icon: '🎯',
    rarity: 'common',
    points: 10,
    condition: (stats) => stats.totalChallenges >= 1
  },

  // إنجازات التداول
  HOT_STREAK: {
    id: 'hot_streak',
    name: {
      en: 'Hot Streak',
      ar: 'سلسلة ساخنة',
      fr: 'Série Chaude'
    },
    description: {
      en: 'Win 5 trades in a row',
      ar: 'اربح 5 صفقات متتالية',
      fr: 'Gagnez 5 trades consécutifs'
    },
    icon: '🔥',
    rarity: 'rare',
    points: 50,
    condition: (stats) => stats.maxWinStreak >= 5
  },

  DIAMOND_HANDS: {
    id: 'diamond_hands',
    name: {
      en: 'Diamond Hands',
      ar: 'أيدي الماس',
      fr: 'Mains de Diamant'
    },
    description: {
      en: 'Hold a trade for more than 3 days',
      ar: 'احتفظ بصفقة لأكثر من 3 أيام',
      fr: 'Gardez un trade pendant plus de 3 jours'
    },
    icon: '💎',
    rarity: 'rare',
    points: 40,
    condition: (stats) => stats.longestTradeDays >= 3
  },

  SNIPER: {
    id: 'sniper',
    name: {
      en: 'Sniper',
      ar: 'قناص',
      fr: 'Tireur d\'élite'
    },
    description: {
      en: '90%+ win rate in 20+ trades',
      ar: 'نسبة فوز 90%+ في 20+ صفقة',
      fr: 'Taux de réussite de 90%+ en 20+ trades'
    },
    icon: '🎯',
    rarity: 'epic',
    points: 100,
    condition: (stats) => stats.totalTrades >= 20 && stats.winRate >= 90
  },

  CENTURY: {
    id: 'century',
    name: {
      en: 'Century',
      ar: 'المئوية',
      fr: 'Centenaire'
    },
    description: {
      en: 'Complete 100 trades',
      ar: 'أكمل 100 صفقة',
      fr: 'Complétez 100 trades'
    },
    icon: '💯',
    rarity: 'rare',
    points: 50,
    condition: (stats) => stats.totalTrades >= 100
  },

  // إنجازات التحديات
  CHALLENGE_MASTER: {
    id: 'challenge_master',
    name: {
      en: 'Challenge Master',
      ar: 'سيد التحديات',
      fr: 'Maître des Défis'
    },
    description: {
      en: 'Pass 10 challenges',
      ar: 'اجتاز 10 تحديات',
      fr: 'Réussissez 10 défis'
    },
    icon: '👑',
    rarity: 'epic',
    points: 200,
    condition: (stats) => stats.passedChallenges >= 10
  },

  ROCKET: {
    id: 'rocket',
    name: {
      en: 'Rocket',
      ar: 'صاروخ',
      fr: 'Fusée'
    },
    description: {
      en: 'Achieve 100%+ profit in a single challenge',
      ar: 'حقق ربح 100%+ في تحدي واحد',
      fr: 'Réalisez un profit de 100%+ dans un seul défi'
    },
    icon: '🚀',
    rarity: 'legendary',
    points: 300,
    condition: (stats) => stats.maxProfitPercent >= 100
  },

  RISK_MANAGER: {
    id: 'risk_manager',
    name: {
      en: 'Risk Manager',
      ar: 'مدير المخاطر',
      fr: 'Gestionnaire de Risques'
    },
    description: {
      en: 'Complete a challenge without exceeding 5% drawdown',
      ar: 'أكمل تحدي دون تجاوز 5% انخفاض',
      fr: 'Complétez un défi sans dépasser 5% de drawdown'
    },
    icon: '🛡️',
    rarity: 'epic',
    points: 150,
    condition: (stats) => stats.minDrawdownChallenge <= 5 && stats.passedChallenges >= 1
  },

  BRONZE_CHAMPION: {
    id: 'bronze_champion',
    name: {
      en: 'Bronze Champion',
      ar: 'بطل البرونز',
      fr: 'Champion de Bronze'
    },
    description: {
      en: 'Pass Bronze challenge',
      ar: 'اجتاز تحدي البرونز',
      fr: 'Réussissez le défi Bronze'
    },
    icon: '🥉',
    rarity: 'common',
    points: 20,
    condition: (stats) => stats.passedBronze >= 1
  },

  SILVER_CHAMPION: {
    id: 'silver_champion',
    name: {
      en: 'Silver Champion',
      ar: 'بطل الفضة',
      fr: 'Champion d\'Argent'
    },
    description: {
      en: 'Pass Silver challenge',
      ar: 'اجتاز تحدي الفضة',
      fr: 'Réussissez le défi Argent'
    },
    icon: '🥈',
    rarity: 'rare',
    points: 50,
    condition: (stats) => stats.passedSilver >= 1
  },

  GOLD_CHAMPION: {
    id: 'gold_champion',
    name: {
      en: 'Gold Champion',
      ar: 'بطل الذهب',
      fr: 'Champion d\'Or'
    },
    description: {
      en: 'Pass Gold challenge',
      ar: 'اجتاز تحدي الذهب',
      fr: 'Réussissez le défi Or'
    },
    icon: '🥇',
    rarity: 'epic',
    points: 100,
    condition: (stats) => stats.passedGold >= 1
  },

  // إنجازات اجتماعية
  TEAM_PLAYER: {
    id: 'team_player',
    name: {
      en: 'Team Player',
      ar: 'لاعب فريق',
      fr: 'Joueur d\'Équipe'
    },
    description: {
      en: 'Join a team',
      ar: 'انضم لفريق',
      fr: 'Rejoignez une équipe'
    },
    icon: '👥',
    rarity: 'common',
    points: 10,
    condition: (stats) => stats.teamsJoined >= 1
  },

  LEADER: {
    id: 'leader',
    name: {
      en: 'Leader',
      ar: 'قائد',
      fr: 'Leader'
    },
    description: {
      en: 'Create a team',
      ar: 'أنشئ فريق',
      fr: 'Créez une équipe'
    },
    icon: '⭐',
    rarity: 'rare',
    points: 30,
    condition: (stats) => stats.teamsCreated >= 1
  },

  INFLUENCER: {
    id: 'influencer',
    name: {
      en: 'Influencer',
      ar: 'مؤثر',
      fr: 'Influenceur'
    },
    description: {
      en: 'Have 10+ copy trading followers',
      ar: 'احصل على 10+ متابعين ينسخون تداولك',
      fr: 'Ayez 10+ abonnés en copy trading'
    },
    icon: '🌟',
    rarity: 'epic',
    points: 150,
    condition: (stats) => stats.copyTradingFollowers >= 10
  },

  // إنجازات خاصة
  PERFECT_WEEK: {
    id: 'perfect_week',
    name: {
      en: 'Perfect Week',
      ar: 'أسبوع مثالي',
      fr: 'Semaine Parfaite'
    },
    description: {
      en: 'Win all trades in a week (min 10 trades)',
      ar: 'اربح جميع الصفقات في أسبوع (10 صفقات على الأقل)',
      fr: 'Gagnez tous les trades en une semaine (min 10 trades)'
    },
    icon: '🏆',
    rarity: 'legendary',
    points: 500,
    condition: (stats) => stats.perfectWeeks >= 1
  },

  MILLIONAIRE: {
    id: 'millionaire',
    name: {
      en: 'Millionaire',
      ar: 'مليونير',
      fr: 'Millionnaire'
    },
    description: {
      en: 'Reach $1,000,000 in total profits',
      ar: 'اوصل إلى $1,000,000 في الأرباح الإجمالية',
      fr: 'Atteignez 1 000 000 $ de profits totaux'
    },
    icon: '💰',
    rarity: 'legendary',
    points: 1000,
    condition: (stats) => stats.totalProfit >= 1000000
  },

  LEGEND: {
    id: 'legend',
    name: {
      en: 'Legend',
      ar: 'أسطورة',
      fr: 'Légende'
    },
    description: {
      en: 'Reach #1 on global leaderboard',
      ar: 'اوصل للمركز #1 في القائمة العالمية',
      fr: 'Atteignez la 1ère place du classement mondial'
    },
    icon: '👑',
    rarity: 'legendary',
    points: 2000,
    condition: (stats) => stats.globalRank === 1
  }
};

/**
 * الحصول على إحصائيات المستخدم لفحص الإنجازات
 */
export async function getUserStats(userId) {
  try {
    // جلب بيانات المستخدم
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const user = userDoc.data();

    // جلب جميع مشاركات المستخدم في التحديات
    const participantsQuery = query(
      collection(db, 'challenge_participants'),
      where('userId', '==', userId)
    );
    const participantsSnap = await getDocs(participantsQuery);

    let totalTrades = 0;
    let winningTrades = 0;
    let passedChallenges = 0;
    let maxProfitPercent = 0;
    let minDrawdownChallenge = 100;
    let passedBronze = 0;
    let passedSilver = 0;
    let passedGold = 0;
    let totalProfit = 0;
    let maxWinStreak = 0;
    let longestTradeDays = 0;

    for (const participantDoc of participantsSnap.docs) {
      const participant = participantDoc.data();
      
      totalTrades += participant.totalTrades || 0;
      winningTrades += participant.winningTrades || 0;

      if (participant.status === 'passed') {
        passedChallenges++;
        
        const profitPercent = ((participant.currentBalance - participant.initialBalance) / participant.initialBalance) * 100;
        maxProfitPercent = Math.max(maxProfitPercent, profitPercent);
        
        minDrawdownChallenge = Math.min(minDrawdownChallenge, participant.maxDrawdown || 100);

        // تحديد نوع التحدي
        if (participant.challengeLevel === 'bronze') passedBronze++;
        if (participant.challengeLevel === 'silver') passedSilver++;
        if (participant.challengeLevel === 'gold') passedGold++;

        totalProfit += (participant.currentBalance - participant.initialBalance);
      }

      // حساب أطول سلسلة انتصارات
      maxWinStreak = Math.max(maxWinStreak, participant.currentWinStreak || 0);
    }

    // جلب جميع الصفقات لحساب أطول مدة صفقة
    const tradesQuery = query(
      collection(db, 'challenge_trades'),
      where('userId', '==', userId),
      where('status', '==', 'closed')
    );
    const tradesSnap = await getDocs(tradesQuery);

    tradesSnap.docs.forEach(tradeDoc => {
      const trade = tradeDoc.data();
      if (trade.openTime && trade.closeTime) {
        const duration = (trade.closeTime.toDate() - trade.openTime.toDate()) / (1000 * 60 * 60 * 24);
        longestTradeDays = Math.max(longestTradeDays, duration);
      }
    });

    // جلب بيانات الفرق
    const teamsQuery = query(
      collection(db, 'teams'),
      where('members', 'array-contains', userId)
    );
    const teamsSnap = await getDocs(teamsQuery);
    const teamsJoined = teamsSnap.docs.length;
    const teamsCreated = teamsSnap.docs.filter(doc => doc.data().leaderId === userId).length;

    // جلب متابعي Copy Trading
    const followersQuery = query(
      collection(db, 'copy_trading'),
      where('leaderId', '==', userId),
      where('status', '==', 'active')
    );
    const followersSnap = await getDocs(followersQuery);
    const copyTradingFollowers = followersSnap.docs.length;

    // حساب نسبة الفوز
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // جلب الترتيب العالمي
    const leaderboardQuery = query(
      collection(db, 'global_leaderboard')
    );
    const leaderboardSnap = await getDocs(leaderboardQuery);
    const leaderboard = leaderboardSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.totalProfit - a.totalProfit);
    
    const globalRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;

    return {
      totalTrades,
      winningTrades,
      winRate,
      passedChallenges,
      totalChallenges: participantsSnap.docs.length,
      maxProfitPercent,
      minDrawdownChallenge,
      passedBronze,
      passedSilver,
      passedGold,
      totalProfit,
      maxWinStreak,
      longestTradeDays,
      teamsJoined,
      teamsCreated,
      copyTradingFollowers,
      globalRank,
      perfectWeeks: 0 // TODO: تنفيذ حساب الأسابيع المثالية
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

/**
 * فحص وتحديث إنجازات المستخدم
 */
export async function checkAndUpdateAchievements(userId) {
  try {
    // جلب الإحصائيات
    const stats = await getUserStats(userId);

    // جلب الإنجازات الحالية
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentAchievements = userDoc.data()?.achievements || [];

    const newAchievements = [];

    // فحص كل إنجاز
    for (const achievement of Object.values(ACHIEVEMENTS)) {
      // تخطي إذا كان المستخدم حصل عليه بالفعل
      if (currentAchievements.includes(achievement.id)) {
        continue;
      }

      // فحص الشرط
      if (achievement.condition(stats)) {
        newAchievements.push(achievement);
        
        // إضافة الإنجاز للمستخدم
        await updateDoc(userRef, {
          achievements: arrayUnion(achievement.id),
          totalPoints: (userDoc.data()?.totalPoints || 0) + achievement.points,
          lastAchievementAt: serverTimestamp()
        });

        // إنشاء سجل للإنجاز
        const achievementRef = doc(collection(db, 'user_achievements'));
        await setDoc(achievementRef, {
          userId,
          achievementId: achievement.id,
          achievementName: achievement.name,
          achievementIcon: achievement.icon,
          points: achievement.points,
          rarity: achievement.rarity,
          unlockedAt: serverTimestamp()
        });

        // إرسال إشعار
        await sendAchievementNotification(userId, achievement);
      }
    }

    return {
      newAchievements,
      totalAchievements: currentAchievements.length + newAchievements.length,
      totalPoints: (userDoc.data()?.totalPoints || 0) + newAchievements.reduce((sum, a) => sum + a.points, 0)
    };
  } catch (error) {
    console.error('Error checking achievements:', error);
    throw error;
  }
}

/**
 * إرسال إشعار بالإنجاز الجديد
 */
async function sendAchievementNotification(userId, achievement) {
  try {
    const notificationRef = doc(collection(db, 'notifications'));
    await setDoc(notificationRef, {
      userId,
      type: 'achievement',
      title: '🎉 Achievement Unlocked!',
      message: `You've earned: ${achievement.icon} ${achievement.name.en} (+${achievement.points} points)`,
      achievementId: achievement.id,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending achievement notification:', error);
  }
}

/**
 * الحصول على جميع إنجازات المستخدم
 */
export async function getUserAchievements(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { achievements: [], totalPoints: 0 };
    }

    const achievementIds = userDoc.data()?.achievements || [];
    const totalPoints = userDoc.data()?.totalPoints || 0;

    const achievements = achievementIds.map(id => ACHIEVEMENTS[id.toUpperCase()]).filter(Boolean);

    return {
      achievements,
      totalPoints,
      totalAchievements: achievements.length,
      progress: (achievements.length / Object.keys(ACHIEVEMENTS).length) * 100
    };
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return { achievements: [], totalPoints: 0 };
  }
}

/**
 * الحصول على قائمة أفضل اللاعبين حسب النقاط
 */
export async function getTopPlayersByPoints(limit = 10) {
  try {
    const usersQuery = query(collection(db, 'users'));
    const usersSnap = await getDocs(usersQuery);

    const players = usersSnap.docs
      .map(doc => ({
        userId: doc.id,
        displayName: doc.data().displayName,
        photoURL: doc.data().photoURL,
        totalPoints: doc.data().totalPoints || 0,
        achievements: doc.data().achievements || []
      }))
      .filter(p => p.totalPoints > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);

    return players;
  } catch (error) {
    console.error('Error getting top players:', error);
    return [];
  }
}

export default {
  ACHIEVEMENTS,
  getUserStats,
  checkAndUpdateAchievements,
  getUserAchievements,
  getTopPlayersByPoints
};
