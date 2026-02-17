import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';

/**
 * ═══════════════════════════════════════════════════════════════
 * Copy Trading Service
 * ═══════════════════════════════════════════════════════════════
 * نظام نسخ التداول داخل الفرق - ميزة نادرة ومميزة
 * يسمح لأعضاء الفريق بنسخ صفقات بعضهم تلقائياً
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * تفعيل نسخ التداول
 * @param {string} followerId - معرف المتابع (الذي سينسخ)
 * @param {string} leaderId - معرف القائد (الذي سيتم نسخه)
 * @param {string} teamId - معرف الفريق
 * @param {number} allocationPercent - نسبة الرصيد المخصصة للنسخ (1-100)
 * @param {object} settings - إعدادات إضافية
 */
export async function enableCopyTrading(followerId, leaderId, teamId, allocationPercent, settings = {}) {
  try {
    // التحقق من صحة البيانات
    if (!followerId || !leaderId || !teamId) {
      throw new Error('Missing required parameters');
    }

    if (followerId === leaderId) {
      throw new Error('Cannot copy your own trades');
    }

    if (allocationPercent < 1 || allocationPercent > 100) {
      throw new Error('Allocation percent must be between 1 and 100');
    }

    // التحقق من أن كلاهما في نفس الفريق
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();
    if (!team.members.includes(followerId) || !team.members.includes(leaderId)) {
      throw new Error('Both users must be members of the same team');
    }

    // إنشاء علاقة Copy Trading
    const copyTradingRef = doc(db, 'copy_trading', `${followerId}_${leaderId}`);
    
    await setDoc(copyTradingRef, {
      followerId,
      leaderId,
      teamId,
      allocationPercent,
      status: 'active',
      settings: {
        copyStopLoss: settings.copyStopLoss !== false, // افتراضياً true
        copyTakeProfit: settings.copyTakeProfit !== false, // افتراضياً true
        maxTradesPerDay: settings.maxTradesPerDay || 20,
        minTradeSize: settings.minTradeSize || 0.01,
        maxTradeSize: settings.maxTradeSize || 10,
        allowedSymbols: settings.allowedSymbols || [], // فارغ = كل الرموز
        blockedSymbols: settings.blockedSymbols || [],
        reverseMode: settings.reverseMode || false, // نسخ معكوس
        ...settings
      },
      statistics: {
        totalCopiedTrades: 0,
        successfulTrades: 0,
        failedTrades: 0,
        totalProfit: 0,
        totalLoss: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // تحديث إحصائيات المستخدمين
    await updateDoc(doc(db, 'users', followerId), {
      'copyTrading.following': increment(1),
      'copyTrading.lastUpdated': serverTimestamp()
    });

    await updateDoc(doc(db, 'users', leaderId), {
      'copyTrading.followers': increment(1),
      'copyTrading.lastUpdated': serverTimestamp()
    });

    console.log(`Copy trading enabled: ${followerId} -> ${leaderId}`);

    return {
      success: true,
      copyTradingId: copyTradingRef.id,
      message: 'Copy trading enabled successfully'
    };
  } catch (error) {
    console.error('Error enabling copy trading:', error);
    throw error;
  }
}

/**
 * إيقاف نسخ التداول
 */
export async function disableCopyTrading(followerId, leaderId) {
  try {
    const copyTradingRef = doc(db, 'copy_trading', `${followerId}_${leaderId}`);
    const copyTradingDoc = await getDoc(copyTradingRef);

    if (!copyTradingDoc.exists()) {
      throw new Error('Copy trading relationship not found');
    }

    // حذف العلاقة
    await deleteDoc(copyTradingRef);

    // تحديث إحصائيات المستخدمين
    await updateDoc(doc(db, 'users', followerId), {
      'copyTrading.following': increment(-1),
      'copyTrading.lastUpdated': serverTimestamp()
    });

    await updateDoc(doc(db, 'users', leaderId), {
      'copyTrading.followers': increment(-1),
      'copyTrading.lastUpdated': serverTimestamp()
    });

    console.log(`Copy trading disabled: ${followerId} -> ${leaderId}`);

    return {
      success: true,
      message: 'Copy trading disabled successfully'
    };
  } catch (error) {
    console.error('Error disabling copy trading:', error);
    throw error;
  }
}

/**
 * نسخ صفقة تلقائياً عند فتح القائد لصفقة
 * يتم استدعاء هذه الدالة من challengeEngine عند فتح صفقة
 */
export async function copyTradeToFollowers(leaderTrade) {
  try {
    const { userId: leaderId, participantId, ...tradeData } = leaderTrade;

    // جلب جميع المتابعين النشطين
    const followersQuery = query(
      collection(db, 'copy_trading'),
      where('leaderId', '==', leaderId),
      where('status', '==', 'active')
    );
    const followersSnap = await getDocs(followersQuery);

    if (followersSnap.empty) {
      return { copied: 0, message: 'No active followers' };
    }

    const copyPromises = [];

    for (const followerDoc of followersSnap.docs) {
      const copyRelation = followerDoc.data();
      const { followerId, allocationPercent, settings } = copyRelation;

      // التحقق من الإعدادات
      if (!shouldCopyTrade(tradeData, settings)) {
        console.log(`Trade not copied to ${followerId}: filtered by settings`);
        continue;
      }

      // جلب بيانات المشارك المتابع
      const followerParticipantQuery = query(
        collection(db, 'challenge_participants'),
        where('userId', '==', followerId),
        where('status', '==', 'active')
      );
      const followerParticipantSnap = await getDocs(followerParticipantQuery);

      if (followerParticipantSnap.empty) {
        console.log(`Follower ${followerId} has no active challenge`);
        continue;
      }

      const followerParticipant = followerParticipantSnap.docs[0].data();
      const followerParticipantId = followerParticipantSnap.docs[0].id;

      // حساب حجم الصفقة المنسوخة بناءً على نسبة التخصيص
      const followerBalance = followerParticipant.currentBalance;
      const allocatedBalance = (followerBalance * allocationPercent) / 100;
      
      // حساب حجم الصفقة بنسبة من الرصيد المخصص
      const leaderBalanceRatio = tradeData.positionSize / leaderTrade.currentBalance;
      let copiedPositionSize = allocatedBalance * leaderBalanceRatio;

      // تطبيق حدود الحجم
      copiedPositionSize = Math.max(copiedPositionSize, settings.minTradeSize || 0.01);
      copiedPositionSize = Math.min(copiedPositionSize, settings.maxTradeSize || 10);
      copiedPositionSize = parseFloat(copiedPositionSize.toFixed(2));

      // إنشاء صفقة منسوخة
      const copiedTrade = {
        ...tradeData,
        userId: followerId,
        participantId: followerParticipantId,
        positionSize: copiedPositionSize,
        isCopiedTrade: true,
        copiedFrom: leaderId,
        originalTradeId: leaderTrade.id,
        copyAllocationPercent: allocationPercent,
        reversed: settings.reverseMode || false
      };

      // إذا كان الوضع معكوس، عكس نوع الصفقة
      if (settings.reverseMode) {
        copiedTrade.type = tradeData.type === 'buy' ? 'sell' : 'buy';
      }

      // فتح الصفقة المنسوخة
      copyPromises.push(
        openCopiedTrade(copiedTrade, followerDoc.id)
      );
    }

    const results = await Promise.allSettled(copyPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Trade copied to ${successful} followers, ${failed} failed`);

    return {
      copied: successful,
      failed,
      total: followersSnap.docs.length
    };
  } catch (error) {
    console.error('Error copying trade to followers:', error);
    return { copied: 0, error: error.message };
  }
}

/**
 * فتح صفقة منسوخة
 */
async function openCopiedTrade(copiedTrade, copyRelationId) {
  try {
    // استيراد دالة فتح الصفقة من challengeEngine
    const { openTrade } = await import('./challengeEngine.js');
    
    const result = await openTrade(
      copiedTrade.userId,
      copiedTrade.participantId,
      copiedTrade
    );

    // تحديث إحصائيات Copy Trading
    await updateDoc(doc(db, 'copy_trading', copyRelationId), {
      'statistics.totalCopiedTrades': increment(1),
      'updatedAt': serverTimestamp()
    });

    return result;
  } catch (error) {
    console.error('Error opening copied trade:', error);
    
    // تحديث إحصائيات الفشل
    await updateDoc(doc(db, 'copy_trading', copyRelationId), {
      'statistics.failedTrades': increment(1),
      'updatedAt': serverTimestamp()
    });

    throw error;
  }
}

/**
 * التحقق من أنه يجب نسخ الصفقة حسب الإعدادات
 */
function shouldCopyTrade(trade, settings) {
  // التحقق من الرموز المسموحة
  if (settings.allowedSymbols && settings.allowedSymbols.length > 0) {
    if (!settings.allowedSymbols.includes(trade.symbol)) {
      return false;
    }
  }

  // التحقق من الرموز المحظورة
  if (settings.blockedSymbols && settings.blockedSymbols.length > 0) {
    if (settings.blockedSymbols.includes(trade.symbol)) {
      return false;
    }
  }

  return true;
}

/**
 * إغلاق الصفقات المنسوخة عند إغلاق القائد لصفقته
 */
export async function closeCopiedTrades(originalTradeId, closePrice, closeReason = 'leader_closed') {
  try {
    // جلب جميع الصفقات المنسوخة من هذه الصفقة
    const copiedTradesQuery = query(
      collection(db, 'challenge_trades'),
      where('originalTradeId', '==', originalTradeId),
      where('status', '==', 'open')
    );
    const copiedTradesSnap = await getDocs(copiedTradesQuery);

    if (copiedTradesSnap.empty) {
      return { closed: 0, message: 'No copied trades to close' };
    }

    const closePromises = [];

    for (const tradeDoc of copiedTradesSnap.docs) {
      const trade = tradeDoc.data();
      
      // استيراد دالة إغلاق الصفقة
      const { closeTrade } = await import('./challengeEngine.js');
      
      closePromises.push(
        closeTrade(trade.userId, trade.participantId, tradeDoc.id, closePrice, closeReason)
      );
    }

    const results = await Promise.allSettled(closePromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;

    console.log(`Closed ${successful} copied trades`);

    return {
      closed: successful,
      total: copiedTradesSnap.docs.length
    };
  } catch (error) {
    console.error('Error closing copied trades:', error);
    return { closed: 0, error: error.message };
  }
}

/**
 * الحصول على قائمة المتداولين المتاحين للنسخ في الفريق
 */
export async function getAvailableLeadersInTeam(teamId, currentUserId) {
  try {
    // جلب بيانات الفريق
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();
    const members = team.members.filter(m => m !== currentUserId);

    // جلب إحصائيات كل عضو
    const leadersData = [];

    for (const memberId of members) {
      // جلب بيانات المستخدم
      const userRef = doc(db, 'users', memberId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) continue;

      const user = userDoc.data();

      // جلب إحصائيات التداول
      const participantsQuery = query(
        collection(db, 'challenge_participants'),
        where('userId', '==', memberId)
      );
      const participantsSnap = await getDocs(participantsQuery);

      let totalProfitPercent = 0;
      let totalTrades = 0;
      let winRate = 0;
      let passedChallenges = 0;

      participantsSnap.docs.forEach(doc => {
        const participant = doc.data();
        if (participant.status === 'passed') passedChallenges++;
        
        const profitPercent = ((participant.currentBalance - participant.initialBalance) / participant.initialBalance) * 100;
        totalProfitPercent += profitPercent;
        totalTrades += participant.totalTrades || 0;
        
        if (participant.winningTrades && participant.totalTrades) {
          winRate += (participant.winningTrades / participant.totalTrades) * 100;
        }
      });

      const avgProfitPercent = participantsSnap.docs.length > 0 
        ? totalProfitPercent / participantsSnap.docs.length 
        : 0;

      const avgWinRate = participantsSnap.docs.length > 0
        ? winRate / participantsSnap.docs.length
        : 0;

      leadersData.push({
        userId: memberId,
        displayName: user.displayName || 'Unknown',
        photoURL: user.photoURL || null,
        statistics: {
          avgProfitPercent: parseFloat(avgProfitPercent.toFixed(2)),
          totalTrades,
          avgWinRate: parseFloat(avgWinRate.toFixed(2)),
          passedChallenges,
          followers: user.copyTrading?.followers || 0
        }
      });
    }

    // ترتيب حسب الأداء
    leadersData.sort((a, b) => b.statistics.avgProfitPercent - a.statistics.avgProfitPercent);

    return leadersData;
  } catch (error) {
    console.error('Error getting available leaders:', error);
    return [];
  }
}

/**
 * الحصول على علاقات Copy Trading للمستخدم
 */
export async function getUserCopyTradingRelations(userId) {
  try {
    // المتابعين (أنا أتابع)
    const followingQuery = query(
      collection(db, 'copy_trading'),
      where('followerId', '==', userId),
      where('status', '==', 'active')
    );
    const followingSnap = await getDocs(followingQuery);

    const following = await Promise.all(
      followingSnap.docs.map(async doc => {
        const data = doc.data();
        const leaderRef = await getDoc(doc(db, 'users', data.leaderId));
        const leader = leaderRef.data();

        return {
          id: doc.id,
          ...data,
          leaderInfo: {
            displayName: leader?.displayName || 'Unknown',
            photoURL: leader?.photoURL || null
          }
        };
      })
    );

    // المتابعون (يتابعونني)
    const followersQuery = query(
      collection(db, 'copy_trading'),
      where('leaderId', '==', userId),
      where('status', '==', 'active')
    );
    const followersSnap = await getDocs(followersQuery);

    const followers = await Promise.all(
      followersSnap.docs.map(async doc => {
        const data = doc.data();
        const followerRef = await getDoc(doc(db, 'users', data.followerId));
        const follower = followerRef.data();

        return {
          id: doc.id,
          ...data,
          followerInfo: {
            displayName: follower?.displayName || 'Unknown',
            photoURL: follower?.photoURL || null
          }
        };
      })
    );

    return {
      following,
      followers
    };
  } catch (error) {
    console.error('Error getting user copy trading relations:', error);
    return { following: [], followers: [] };
  }
}

/**
 * تحديث إعدادات Copy Trading
 */
export async function updateCopyTradingSettings(followerId, leaderId, newSettings) {
  try {
    const copyTradingRef = doc(db, 'copy_trading', `${followerId}_${leaderId}`);
    const copyTradingDoc = await getDoc(copyTradingRef);

    if (!copyTradingDoc.exists()) {
      throw new Error('Copy trading relationship not found');
    }

    await updateDoc(copyTradingRef, {
      'settings': {
        ...copyTradingDoc.data().settings,
        ...newSettings
      },
      'updatedAt': serverTimestamp()
    });

    return {
      success: true,
      message: 'Settings updated successfully'
    };
  } catch (error) {
    console.error('Error updating copy trading settings:', error);
    throw error;
  }
}

export default {
  enableCopyTrading,
  disableCopyTrading,
  copyTradeToFollowers,
  closeCopiedTrades,
  getAvailableLeadersInTeam,
  getUserCopyTradingRelations,
  updateCopyTradingSettings
};
