import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  increment,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * تحديث لوحة القادة العالمية للمستخدم
 * يتم استدعاء هذه الدالة عند انتهاء التحدي
 */
export async function updateGlobalLeaderboard(userId, userName, challengeData) {
  try {
    const leaderboardRef = doc(db, 'global_leaderboard', userId);
    const leaderboardDoc = await getDoc(leaderboardRef);

    if (!leaderboardDoc.exists()) {
      // إنشاء سجل جديد
      await setDoc(leaderboardRef, {
        userId,
        userName,
        totalChallenges: 1,
        passedChallenges: challengeData.passed ? 1 : 0,
        totalProfit: challengeData.profit || 0,
        totalTrades: challengeData.totalTrades || 0,
        winningTrades: challengeData.winningTrades || 0,
        averageReturn: challengeData.returnPercentage || 0,
        winRate: challengeData.winRate || 0,
        bestChallenge: {
          level: challengeData.level,
          profit: challengeData.profit || 0,
          return: challengeData.returnPercentage || 0,
          challengeId: challengeData.challengeId
        },
        rank: 0,
        updatedAt: serverTimestamp()
      });
    } else {
      // تحديث السجل الموجود
      const currentData = leaderboardDoc.data();
      const newTotalChallenges = currentData.totalChallenges + 1;
      const newPassedChallenges = currentData.passedChallenges + (challengeData.passed ? 1 : 0);
      const newTotalProfit = currentData.totalProfit + (challengeData.profit || 0);
      const newTotalTrades = currentData.totalTrades + (challengeData.totalTrades || 0);
      const newWinningTrades = currentData.winningTrades + (challengeData.winningTrades || 0);

      // حساب متوسط العائد الجديد
      const newAverageReturn = ((currentData.averageReturn * currentData.totalChallenges) + (challengeData.returnPercentage || 0)) / newTotalChallenges;

      // حساب معدل الفوز الجديد
      const newWinRate = newTotalTrades > 0 ? (newWinningTrades / newTotalTrades) * 100 : 0;

      // تحديد أفضل تحدي
      let bestChallenge = currentData.bestChallenge;
      if (!bestChallenge || (challengeData.profit || 0) > (bestChallenge.profit || 0)) {
        bestChallenge = {
          level: challengeData.level,
          profit: challengeData.profit || 0,
          return: challengeData.returnPercentage || 0,
          challengeId: challengeData.challengeId
        };
      }

      await updateDoc(leaderboardRef, {
        totalChallenges: newTotalChallenges,
        passedChallenges: newPassedChallenges,
        totalProfit: newTotalProfit,
        totalTrades: newTotalTrades,
        winningTrades: newWinningTrades,
        averageReturn: newAverageReturn,
        winRate: newWinRate,
        bestChallenge,
        updatedAt: serverTimestamp()
      });
    }

    // تحديث الترتيب
    await updateRanks();

    return true;
  } catch (error) {
    console.error('Error updating global leaderboard:', error);
    throw error;
  }
}

/**
 * تحديث ترتيب جميع المتداولين
 */
async function updateRanks() {
  try {
    const leaderboardQuery = query(
      collection(db, 'global_leaderboard')
    );
    
    const snapshot = await getDocs(leaderboardQuery);
    const traders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // ترتيب حسب إجمالي الأرباح
    traders.sort((a, b) => (b.totalProfit || 0) - (a.totalProfit || 0));

    // تحديث الترتيب
    const updatePromises = traders.map((trader, index) => {
      const rank = index + 1;
      return updateDoc(doc(db, 'global_leaderboard', trader.id), {
        rank
      });
    });

    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    console.error('Error updating ranks:', error);
    throw error;
  }
}

/**
 * الحصول على ترتيب مستخدم معين
 */
export async function getUserRank(userId) {
  try {
    const leaderboardRef = doc(db, 'global_leaderboard', userId);
    const leaderboardDoc = await getDoc(leaderboardRef);

    if (leaderboardDoc.exists()) {
      return leaderboardDoc.data().rank || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
}

/**
 * الحصول على أفضل 10 متداولين
 */
export async function getTop10Traders(levelFilter = null) {
  try {
    let q = query(
      collection(db, 'global_leaderboard')
    );

    if (levelFilter) {
      q = query(
        collection(db, 'global_leaderboard'),
        where('bestChallenge.level', '==', levelFilter)
      );
    }

    const snapshot = await getDocs(q);
    const traders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // ترتيب حسب إجمالي الأرباح
    traders.sort((a, b) => (b.totalProfit || 0) - (a.totalProfit || 0));

    return traders.slice(0, 10);
  } catch (error) {
    console.error('Error getting top 10 traders:', error);
    return [];
  }
}

/**
 * حساب إحصائيات التحدي عند انتهائه
 */
export function calculateChallengeStats(participant, trades) {
  const profit = participant.balance - participant.initialBalance;
  const returnPercentage = (profit / participant.initialBalance) * 100;
  
  const winningTrades = trades.filter(t => t.profit > 0).length;
  const losingTrades = trades.filter(t => t.profit < 0).length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    profit,
    returnPercentage,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    passed: participant.status === 'passed'
  };
}

export default {
  updateGlobalLeaderboard,
  getUserRank,
  getTop10Traders,
  calculateChallengeStats
};
