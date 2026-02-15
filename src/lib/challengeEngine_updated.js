/**
 * الانضمام للتحدي مع ربط الحساب التجريبي
 * @param {string} challengeId - معرف التحدي
 * @param {string} userId - معرف المستخدم
 * @param {string} userName - اسم المستخدم
 * @param {number} demoAccountBalance - الرصيد من الحساب التجريبي الحقيقي
 */
export const joinChallenge = async (challengeId, userId, userName, demoAccountBalance) => {
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

  // ✅ التحقق من ربط الحساب التجريبي
  if (!demoAccountBalance || demoAccountBalance <= 0) {
    throw new Error('Demo account must be connected with valid balance');
  }

  // إنشاء سجل المشارك
  const participantId = `${challengeId}_${userId}`;
  const participantData = {
    id: participantId,
    challengeId,
    userId,
    userName,
    // ✅ الرصيد من الحساب التجريبي الحقيقي
    initialBalance: demoAccountBalance,
    currentBalance: demoAccountBalance,
    verifiedBalance: demoAccountBalance,
    equity: demoAccountBalance,
    profitLoss: 0,
    profitLossPercent: 0,
    maxDrawdown: 0,
    maxDrawdownPercent: 0,
    currentDrawdown: 0,
    currentDrawdownPercent: 0,
    dailyDrawdown: 0,
    dailyDrawdownPercent: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    consecutiveLosses: 0,
    winRate: 0,
    // ✅ مراقبة التلاعب
    balanceDiscrepancies: 0,
    lastBalanceCheck: serverTimestamp(),
    lastDiscrepancyAt: null,
    warnings: [],
    status: 'active', // active, failed, passed, disqualified
    failureReason: null,
    disqualificationReason: null,
    joinedAt: serverTimestamp(),
    lastTradeAt: null,
    completedAt: null
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
 * التحقق من قواعد التحدي باستخدام النسب المئوية
 */
export const checkChallengeRules = async (participantId) => {
  const participantRef = doc(db, 'challenge_participants', participantId);
  const participantSnap = await getDoc(participantRef);
  
  if (!participantSnap.exists()) throw new Error('Participant not found');
  
  const participant = participantSnap.data();
  const challengeSnap = await getDoc(doc(db, 'challenges', participant.challengeId));
  
  if (!challengeSnap.exists()) throw new Error('Challenge not found');
  
  const challenge = challengeSnap.data();
  
  // حساب النسب
  const profitLossPercent = ((participant.currentBalance - participant.initialBalance) / participant.initialBalance) * 100;
  const maxDrawdownPercent = participant.maxDrawdownPercent || 0;
  const dailyDrawdownPercent = participant.dailyDrawdownPercent || 0;
  
  // ✅ التحقق من Max Drawdown
  if (maxDrawdownPercent > challenge.maxDrawdownPercent) {
    await updateDoc(participantRef, {
      status: 'failed',
      failureReason: `Max Drawdown exceeded: ${maxDrawdownPercent.toFixed(2)}% > ${challenge.maxDrawdownPercent}%`,
      completedAt: serverTimestamp()
    });
    return { passed: false, reason: 'Max Drawdown exceeded' };
  }
  
  // ✅ التحقق من Daily Drawdown
  if (dailyDrawdownPercent > challenge.dailyDrawdownPercent) {
    await updateDoc(participantRef, {
      status: 'failed',
      failureReason: `Daily Drawdown exceeded: ${dailyDrawdownPercent.toFixed(2)}% > ${challenge.dailyDrawdownPercent}%`,
      completedAt: serverTimestamp()
    });
    return { passed: false, reason: 'Daily Drawdown exceeded' };
  }
  
  // ✅ التحقق من Consecutive Losses
  if (participant.consecutiveLosses >= challenge.maxConsecutiveLosses) {
    await updateDoc(participantRef, {
      status: 'failed',
      failureReason: `Too many consecutive losses: ${participant.consecutiveLosses} >= ${challenge.maxConsecutiveLosses}`,
      completedAt: serverTimestamp()
    });
    return { passed: false, reason: 'Too many consecutive losses' };
  }
  
  // ✅ التحقق من النجاح
  const daysElapsed = Math.floor((new Date() - challenge.startDate.toDate()) / (1000 * 60 * 60 * 24));
  
  if (daysElapsed >= challenge.duration) {
    // انتهى الوقت - التحقق من الشروط
    if (profitLossPercent >= challenge.profitTargetPercent && 
        participant.totalTrades >= challenge.minTrades) {
      await updateDoc(participantRef, {
        status: 'passed',
        completedAt: serverTimestamp()
      });
      return { passed: true, reason: 'Challenge completed successfully' };
    } else {
      const reasons = [];
      if (profitLossPercent < challenge.profitTargetPercent) {
        reasons.push(`Profit target not met: ${profitLossPercent.toFixed(2)}% < ${challenge.profitTargetPercent}%`);
      }
      if (participant.totalTrades < challenge.minTrades) {
        reasons.push(`Minimum trades not met: ${participant.totalTrades} < ${challenge.minTrades}`);
      }
      
      await updateDoc(participantRef, {
        status: 'failed',
        failureReason: reasons.join(', '),
        completedAt: serverTimestamp()
      });
      return { passed: false, reason: reasons.join(', ') };
    }
  }
  
  return { passed: null, reason: 'Challenge still in progress' };
};

/**
 * حساب التقدم في التحدي باستخدام النسب
 */
export const calculateProgress = (participant, challenge) => {
  const profitLossPercent = ((participant.currentBalance - participant.initialBalance) / participant.initialBalance) * 100;
  const profitProgress = (profitLossPercent / challenge.profitTargetPercent) * 100;
  const tradesProgress = (participant.totalTrades / challenge.minTrades) * 100;
  
  return {
    profitProgress: Math.min(profitProgress, 100),
    tradesProgress: Math.min(tradesProgress, 100),
    overallProgress: Math.min((profitProgress + tradesProgress) / 2, 100),
    profitLossPercent,
    daysRemaining: challenge.duration - Math.floor((new Date() - challenge.startDate.toDate()) / (1000 * 60 * 60 * 24))
  };
};
