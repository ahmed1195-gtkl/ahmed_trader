/**
 * محرك التحديات التنافسية - Challenge Engine
 * يدير منطق التحديات، التداول الافتراضي، وحساب الأداء
 */

import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

/**
 * مستويات التحديات المتاحة
 */
export const CHALLENGE_LEVELS = {
  BRONZE: {
    id: 'bronze',
    name: 'Bronze Challenge',
    nameAr: 'التحدي البرونزي',
    nameFr: 'Défi Bronze',
    duration: 20, // أيام
    profitTarget: 8, // نسبة مئوية
    maxDrawdown: 12,
    dailyDrawdown: 4,
    riskPerTrade: 2,
    minTrades: 10,
    initialBalance: 10000,
    fee: 29,
    color: '#CD7F32',
    description: 'Perfect for beginners to test their skills',
    descriptionAr: 'مثالي للمبتدئين لاختبار مهاراتهم',
    descriptionFr: 'Parfait pour les débutants pour tester leurs compétences'
  },
  SILVER: {
    id: 'silver',
    name: 'Silver Challenge',
    nameAr: 'التحدي الفضي',
    nameFr: 'Défi Argent',
    duration: 15,
    profitTarget: 12,
    maxDrawdown: 10,
    dailyDrawdown: 3,
    riskPerTrade: 2,
    minTrades: 15,
    initialBalance: 25000,
    fee: 49,
    color: '#C0C0C0',
    description: 'Intermediate level with balanced risk-reward',
    descriptionAr: 'مستوى متوسط بتوازن بين المخاطرة والعائد',
    descriptionFr: 'Niveau intermédiaire avec risque-récompense équilibré'
  },
  GOLD: {
    id: 'gold',
    name: 'Gold Challenge',
    nameAr: 'التحدي الذهبي',
    nameFr: 'Défi Or',
    duration: 10,
    profitTarget: 20,
    maxDrawdown: 8,
    dailyDrawdown: 3,
    riskPerTrade: 2,
    minTrades: 20,
    initialBalance: 50000,
    fee: 99,
    color: '#FFD700',
    description: 'Elite challenge for professional traders',
    descriptionAr: 'تحدي النخبة للمتداولين المحترفين',
    descriptionFr: 'Défi d\'élite pour les traders professionnels'
  }
};

/**
 * إنشاء تحدي جديد
 */
export const createChallenge = async (level, maxParticipants = 10) => {
  const challengeConfig = CHALLENGE_LEVELS[level.toUpperCase()];
  if (!challengeConfig) throw new Error('Invalid challenge level');

  const challengeId = `${level}_${Date.now()}`;
  const challengeData = {
    id: challengeId,
    level: level.toLowerCase(),
    ...challengeConfig,
    maxParticipants,
    currentParticipants: 0,
    status: 'waiting', // waiting, active, completed
    createdAt: serverTimestamp(),
    startDate: null,
    endDate: null
  };

  await setDoc(doc(db, 'challenges', challengeId), challengeData);
  return challengeId;
};

/**
 * الانضمام إلى تحدي
 */
export const joinChallenge = async (challengeId, userId, userName) => {
  const challengeRef = doc(db, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);
  
  if (!challengeSnap.exists()) throw new Error('Challenge not found');
  
  const challenge = challengeSnap.data();
  
  if (challenge.currentParticipants >= challenge.maxParticipants) {
    throw new Error('Challenge is full');
  }
  
  if (challenge.status !== 'waiting') {
    throw new Error('Challenge already started or completed');
  }

  // إنشاء سجل المشارك
  const participantId = `${challengeId}_${userId}`;
  const participantData = {
    id: participantId,
    challengeId,
    userId,
    userName,
    balance: challenge.initialBalance,
    initialBalance: challenge.initialBalance,
    equity: challenge.initialBalance,
    profitLoss: 0,
    profitLossPercent: 0,
    maxDrawdown: 0,
    currentDrawdown: 0,
    dailyDrawdown: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    status: 'active', // active, failed, passed
    failureReason: null,
    joinedAt: serverTimestamp(),
    lastTradeAt: null
  };

  await setDoc(doc(db, 'challenge_participants', participantId), participantData);
  
  // تحديث عدد المشاركين
  await updateDoc(challengeRef, {
    currentParticipants: challenge.currentParticipants + 1
  });

  // إذا وصل العدد للحد الأقصى، بدء التحدي
  if (challenge.currentParticipants + 1 >= challenge.maxParticipants) {
    await startChallenge(challengeId);
  }

  return participantId;
};

/**
 * بدء التحدي
 */
export const startChallenge = async (challengeId) => {
  const challengeRef = doc(db, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);
  
  if (!challengeSnap.exists()) throw new Error('Challenge not found');
  
  const challenge = challengeSnap.data();
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + challenge.duration * 24 * 60 * 60 * 1000);

  await updateDoc(challengeRef, {
    status: 'active',
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate)
  });
};

/**
 * فتح صفقة جديدة
 */
export const openTrade = async (participantId, tradeData) => {
  const { symbol, type, size, entryPrice, stopLoss, takeProfit } = tradeData;
  
  // التحقق من صحة البيانات
  if (!symbol || !type || !size || !entryPrice) {
    throw new Error('Missing required trade data');
  }

  // الحصول على بيانات المشارك
  const participantRef = doc(db, 'challenge_participants', participantId);
  const participantSnap = await getDoc(participantRef);
  
  if (!participantSnap.exists()) throw new Error('Participant not found');
  
  const participant = participantSnap.data();
  
  if (participant.status !== 'active') {
    throw new Error('Participant is not active');
  }

  // حساب المخاطرة
  const riskAmount = Math.abs(entryPrice - stopLoss) * size;
  const riskPercent = (riskAmount / participant.balance) * 100;

  // الحصول على إعدادات التحدي
  const challengeRef = doc(db, 'challenges', participant.challengeId);
  const challengeSnap = await getDoc(challengeRef);
  const challenge = challengeSnap.data();

  // التحقق من المخاطرة لكل صفقة
  if (riskPercent > challenge.riskPerTrade) {
    throw new Error(`Risk per trade exceeds ${challenge.riskPerTrade}%`);
  }

  // إنشاء الصفقة
  const tradeId = `${participantId}_${Date.now()}`;
  const trade = {
    id: tradeId,
    participantId,
    challengeId: participant.challengeId,
    userId: participant.userId,
    symbol,
    type, // 'buy' or 'sell'
    size,
    entryPrice,
    currentPrice: entryPrice,
    stopLoss,
    takeProfit,
    profitLoss: 0,
    profitLossPercent: 0,
    status: 'open', // open, closed
    openedAt: serverTimestamp(),
    closedAt: null,
    closePrice: null
  };

  await setDoc(doc(db, 'challenge_trades', tradeId), trade);
  
  // تحديث عدد الصفقات
  await updateDoc(participantRef, {
    totalTrades: participant.totalTrades + 1,
    lastTradeAt: serverTimestamp()
  });

  return tradeId;
};

/**
 * إغلاق صفقة
 */
export const closeTrade = async (tradeId, closePrice) => {
  const tradeRef = doc(db, 'challenge_trades', tradeId);
  const tradeSnap = await getDoc(tradeRef);
  
  if (!tradeSnap.exists()) throw new Error('Trade not found');
  
  const trade = tradeSnap.data();
  
  if (trade.status !== 'open') {
    throw new Error('Trade is already closed');
  }

  // حساب الربح/الخسارة
  let profitLoss;
  if (trade.type === 'buy') {
    profitLoss = (closePrice - trade.entryPrice) * trade.size;
  } else {
    profitLoss = (trade.entryPrice - closePrice) * trade.size;
  }

  const profitLossPercent = (profitLoss / trade.entryPrice) * 100;

  // تحديث الصفقة
  await updateDoc(tradeRef, {
    status: 'closed',
    closePrice,
    currentPrice: closePrice,
    profitLoss,
    profitLossPercent,
    closedAt: serverTimestamp()
  });

  // تحديث رصيد المشارك
  await updateParticipantBalance(trade.participantId, profitLoss);

  return { profitLoss, profitLossPercent };
};

/**
 * تحديث رصيد المشارك بعد إغلاق صفقة
 */
export const updateParticipantBalance = async (participantId, profitLoss) => {
  const participantRef = doc(db, 'challenge_participants', participantId);
  const participantSnap = await getDoc(participantRef);
  
  if (!participantSnap.exists()) throw new Error('Participant not found');
  
  const participant = participantSnap.data();
  const newBalance = participant.balance + profitLoss;
  const newEquity = newBalance;
  const totalProfitLoss = newBalance - participant.initialBalance;
  const profitLossPercent = (totalProfitLoss / participant.initialBalance) * 100;

  // حساب Drawdown
  const peakBalance = Math.max(participant.balance, participant.initialBalance);
  const currentDrawdown = ((peakBalance - newBalance) / peakBalance) * 100;
  const maxDrawdown = Math.max(participant.maxDrawdown, currentDrawdown);

  // تحديث إحصائيات الفوز/الخسارة
  const isWinningTrade = profitLoss > 0;
  const winningTrades = participant.winningTrades + (isWinningTrade ? 1 : 0);
  const losingTrades = participant.losingTrades + (isWinningTrade ? 0 : 1);
  const winRate = (winningTrades / (winningTrades + losingTrades)) * 100;

  // الحصول على إعدادات التحدي للتحقق من الفشل
  const challengeRef = doc(db, 'challenges', participant.challengeId);
  const challengeSnap = await getDoc(challengeRef);
  const challenge = challengeSnap.data();

  let status = participant.status;
  let failureReason = null;

  // التحقق من تجاوز Max Drawdown
  if (maxDrawdown > challenge.maxDrawdown) {
    status = 'failed';
    failureReason = `Max Drawdown exceeded: ${maxDrawdown.toFixed(2)}% > ${challenge.maxDrawdown}%`;
  }

  // تحديث البيانات
  await updateDoc(participantRef, {
    balance: newBalance,
    equity: newEquity,
    profitLoss: totalProfitLoss,
    profitLossPercent,
    currentDrawdown,
    maxDrawdown,
    winningTrades,
    losingTrades,
    winRate,
    status,
    failureReason
  });

  // تحديث لوحة الصدارة
  await updateLeaderboard(participant.challengeId);

  return { newBalance, profitLossPercent, status, failureReason };
};

/**
 * تحديث أسعار الصفقات المفتوحة
 */
export const updateOpenTrades = async (participantId, marketPrices) => {
  const tradesQuery = query(
    collection(db, 'challenge_trades'),
    where('participantId', '==', participantId),
    where('status', '==', 'open')
  );

  const tradesSnap = await getDocs(tradesQuery);
  
  for (const tradeDoc of tradesSnap.docs) {
    const trade = tradeDoc.data();
    const currentPrice = marketPrices[trade.symbol];
    
    if (currentPrice) {
      let unrealizedPL;
      if (trade.type === 'buy') {
        unrealizedPL = (currentPrice - trade.entryPrice) * trade.size;
      } else {
        unrealizedPL = (trade.entryPrice - currentPrice) * trade.size;
      }

      await updateDoc(doc(db, 'challenge_trades', trade.id), {
        currentPrice,
        profitLoss: unrealizedPL,
        profitLossPercent: (unrealizedPL / (trade.entryPrice * trade.size)) * 100
      });

      // التحقق من Stop Loss و Take Profit
      if (trade.type === 'buy') {
        if (currentPrice <= trade.stopLoss) {
          await closeTrade(trade.id, trade.stopLoss);
        } else if (currentPrice >= trade.takeProfit) {
          await closeTrade(trade.id, trade.takeProfit);
        }
      } else {
        if (currentPrice >= trade.stopLoss) {
          await closeTrade(trade.id, trade.stopLoss);
        } else if (currentPrice <= trade.takeProfit) {
          await closeTrade(trade.id, trade.takeProfit);
        }
      }
    }
  }
};

/**
 * تحديث لوحة الصدارة
 */
export const updateLeaderboard = async (challengeId) => {
  const participantsQuery = query(
    collection(db, 'challenge_participants'),
    where('challengeId', '==', challengeId),
    orderBy('profitLossPercent', 'desc')
  );

  const participantsSnap = await getDocs(participantsQuery);
  const leaderboard = [];
  
  let rank = 1;
  participantsSnap.forEach((doc) => {
    const participant = doc.data();
    leaderboard.push({
      rank: rank++,
      userId: participant.userId,
      userName: participant.userName,
      profitLossPercent: participant.profitLossPercent,
      balance: participant.balance,
      totalTrades: participant.totalTrades,
      winRate: participant.winRate,
      status: participant.status
    });
  });

  await setDoc(doc(db, 'challenge_leaderboards', challengeId), {
    challengeId,
    leaderboard,
    updatedAt: serverTimestamp()
  });

  return leaderboard;
};

/**
 * التحقق من انتهاء التحدي
 */
export const checkChallengeCompletion = async (challengeId) => {
  const challengeRef = doc(db, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);
  
  if (!challengeSnap.exists()) return;
  
  const challenge = challengeSnap.data();
  
  if (challenge.status !== 'active') return;

  const now = new Date();
  const endDate = challenge.endDate.toDate();

  if (now >= endDate) {
    await updateDoc(challengeRef, {
      status: 'completed'
    });

    // تحديث حالة المشاركين
    await finalizeParticipants(challengeId, challenge);
  }
};

/**
 * تحديد الفائزين والناجحين
 */
export const finalizeParticipants = async (challengeId, challenge) => {
  const participantsQuery = query(
    collection(db, 'challenge_participants'),
    where('challengeId', '==', challengeId)
  );

  const participantsSnap = await getDocs(participantsQuery);
  
  for (const participantDoc of participantsSnap.docs) {
    const participant = participantDoc.data();
    
    if (participant.status === 'active') {
      // التحقق من تحقيق الشروط
      const passedProfitTarget = participant.profitLossPercent >= challenge.profitTarget;
      const passedMinTrades = participant.totalTrades >= challenge.minTrades;
      
      if (passedProfitTarget && passedMinTrades) {
        await updateDoc(doc(db, 'challenge_participants', participant.id), {
          status: 'passed'
        });
      } else {
        let reason = 'Did not meet challenge requirements: ';
        if (!passedProfitTarget) reason += `Profit target not reached (${participant.profitLossPercent.toFixed(2)}% < ${challenge.profitTarget}%). `;
        if (!passedMinTrades) reason += `Minimum trades not reached (${participant.totalTrades} < ${challenge.minTrades}).`;
        
        await updateDoc(doc(db, 'challenge_participants', participant.id), {
          status: 'failed',
          failureReason: reason
        });
      }
    }
  }

  // تحديث لوحة الصدارة النهائية
  await updateLeaderboard(challengeId);
};

/**
 * الحصول على بيانات المشارك
 */
export const getParticipantData = async (participantId) => {
  const participantSnap = await getDoc(doc(db, 'challenge_participants', participantId));
  if (!participantSnap.exists()) throw new Error('Participant not found');
  return participantSnap.data();
};

/**
 * الحصول على صفقات المشارك
 */
export const getParticipantTrades = async (participantId) => {
  const tradesQuery = query(
    collection(db, 'challenge_trades'),
    where('participantId', '==', participantId),
    orderBy('openedAt', 'desc')
  );

  const tradesSnap = await getDocs(tradesQuery);
  return tradesSnap.docs.map(doc => doc.data());
};
