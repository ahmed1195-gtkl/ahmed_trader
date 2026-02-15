import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { fetchAccountData } from './mt4mt5Service';

/**
 * مراقبة رصيد المشارك والكشف عن التلاعب
 */
export async function monitorParticipantBalance(participantId) {
  try {
    // 1. جلب بيانات المشارك
    const participantRef = doc(db, 'challenge_participants', participantId);
    const participantDoc = await getDoc(participantRef);

    if (!participantDoc.exists()) {
      console.error('Participant not found:', participantId);
      return;
    }

    const participant = participantDoc.data();

    // تخطي إذا كان التحدي منتهي أو مقصى
    if (['passed', 'failed', 'disqualified'].includes(participant.status)) {
      return;
    }

    // 2. حساب الرصيد المتوقع من الصفقات
    const expectedBalance = await calculateExpectedBalance(participant);

    // 3. قراءة الرصيد الفعلي من البروكر
    let verifiedBalance;
    try {
      const accountData = await fetchAccountData(participant.userId, participantId);
      verifiedBalance = accountData.balance;
    } catch (error) {
      console.error('Error fetching account data:', error);
      // إذا فشلت القراءة، نستخدم الرصيد الحالي
      verifiedBalance = participant.currentBalance;
    }

    // 4. حساب الفرق
    const discrepancy = Math.abs(verifiedBalance - expectedBalance);
    const discrepancyPercent = (discrepancy / expectedBalance) * 100;

    // 5. تحديث الرصيد المتحقق منه
    await updateDoc(participantRef, {
      verifiedBalance,
      lastBalanceCheck: serverTimestamp()
    });

    // 6. التحقق من التلاعب (فرق أكثر من 1%)
    if (discrepancyPercent > 1) {
      await handleBalanceDiscrepancy(
        participantId,
        participant,
        expectedBalance,
        verifiedBalance,
        discrepancyPercent
      );
    }

    return {
      participantId,
      expectedBalance,
      verifiedBalance,
      discrepancy,
      discrepancyPercent,
      status: discrepancyPercent > 1 ? 'warning' : 'ok'
    };
  } catch (error) {
    console.error('Error monitoring participant balance:', error);
    throw error;
  }
}

/**
 * حساب الرصيد المتوقع من الصفقات
 */
async function calculateExpectedBalance(participant) {
  try {
    // الرصيد الأولي
    let expectedBalance = participant.initialBalance;

    // جلب جميع الصفقات المغلقة
    const tradesQuery = query(
      collection(db, 'challenge_trades'),
      where('participantId', '==', participant.id),
      where('status', '==', 'closed')
    );
    const tradesSnap = await getDocs(tradesQuery);

    // جمع الأرباح/الخسائر
    tradesSnap.docs.forEach(doc => {
      const trade = doc.data();
      expectedBalance += (trade.profit || 0);
    });

    return expectedBalance;
  } catch (error) {
    console.error('Error calculating expected balance:', error);
    return participant.currentBalance;
  }
}

/**
 * معالجة اختلاف الرصيد
 */
async function handleBalanceDiscrepancy(
  participantId,
  participant,
  expectedBalance,
  verifiedBalance,
  discrepancyPercent
) {
  try {
    const discrepancy = verifiedBalance - expectedBalance;

    // 1. تسجيل في سجل التدقيق
    await logBalanceAudit({
      participantId,
      userId: participant.userId,
      expectedBalance,
      verifiedBalance,
      discrepancy,
      discrepancyPercent,
      reason: 'unknown',
      action: 'warning',
      timestamp: new Date()
    });

    // 2. زيادة عداد الاختلافات
    const newCount = (participant.balanceDiscrepancies || 0) + 1;

    const warningMessage = {
      type: 'balance_discrepancy',
      message: `Balance mismatch detected: ${discrepancyPercent.toFixed(2)}% (${discrepancy >= 0 ? '+' : ''}$${discrepancy.toLocaleString()})`,
      expectedBalance,
      verifiedBalance,
      discrepancy,
      discrepancyPercent,
      timestamp: new Date().toISOString()
    };

    await updateDoc(doc(db, 'challenge_participants', participantId), {
      balanceDiscrepancies: newCount,
      lastDiscrepancyAt: serverTimestamp(),
      warnings: arrayUnion(warningMessage)
    });

    // 3. إرسال إشعار للمستخدم
    await sendBalanceWarningNotification(
      participant.userId,
      newCount,
      discrepancyPercent,
      discrepancy
    );

    // 4. الإقصاء التلقائي بعد 3 مخالفات
    if (newCount >= 3) {
      await disqualifyParticipant(
        participantId,
        'Multiple balance discrepancies detected - possible manual manipulation'
      );
    }

    console.log(`Balance discrepancy detected for participant ${participantId}: ${discrepancyPercent.toFixed(2)}%`);
  } catch (error) {
    console.error('Error handling balance discrepancy:', error);
    throw error;
  }
}

/**
 * تسجيل في سجل التدقيق
 */
async function logBalanceAudit(auditData) {
  try {
    const auditRef = doc(collection(db, 'balance_audit_log'));
    await setDoc(auditRef, {
      ...auditData,
      timestamp: serverTimestamp()
    });

    return auditRef.id;
  } catch (error) {
    console.error('Error logging balance audit:', error);
    throw error;
  }
}

/**
 * إرسال إشعار تحذير للمستخدم
 */
async function sendBalanceWarningNotification(userId, warningCount, discrepancyPercent, discrepancy) {
  try {
    // في التطبيق الحقيقي، يتم إرسال إشعار عبر Firebase Cloud Messaging
    // أو إضافة إشعار في قاعدة البيانات

    const notificationRef = doc(collection(db, 'notifications'));
    await setDoc(notificationRef, {
      userId,
      type: 'balance_warning',
      title: 'Balance Discrepancy Detected',
      message: `We noticed an unusual change in your account balance (${discrepancyPercent.toFixed(2)}%, ${discrepancy >= 0 ? '+' : ''}$${Math.abs(discrepancy).toLocaleString()}). This is warning ${warningCount} of 3.`,
      severity: warningCount >= 2 ? 'high' : 'medium',
      read: false,
      createdAt: serverTimestamp()
    });

    console.log(`Warning notification sent to user ${userId}`);
  } catch (error) {
    console.error('Error sending warning notification:', error);
  }
}

/**
 * إقصاء المشارك من التحدي
 */
export async function disqualifyParticipant(participantId, reason) {
  try {
    const participantRef = doc(db, 'challenge_participants', participantId);
    const participantDoc = await getDoc(participantRef);

    if (!participantDoc.exists()) {
      throw new Error('Participant not found');
    }

    const participant = participantDoc.data();

    // تحديث حالة المشارك
    await updateDoc(participantRef, {
      status: 'disqualified',
      disqualificationReason: reason,
      completedAt: serverTimestamp()
    });

    // تسجيل في سجل التدقيق
    await logBalanceAudit({
      participantId,
      userId: participant.userId,
      expectedBalance: participant.currentBalance,
      verifiedBalance: participant.verifiedBalance,
      discrepancy: 0,
      discrepancyPercent: 0,
      reason,
      action: 'disqualified',
      timestamp: new Date()
    });

    // إرسال إشعار نهائي
    const notificationRef = doc(collection(db, 'notifications'));
    await setDoc(notificationRef, {
      userId: participant.userId,
      type: 'disqualification',
      title: 'Challenge Disqualification',
      message: `You have been disqualified from the challenge. Reason: ${reason}`,
      severity: 'critical',
      read: false,
      createdAt: serverTimestamp()
    });

    console.log(`Participant ${participantId} disqualified: ${reason}`);
    return true;
  } catch (error) {
    console.error('Error disqualifying participant:', error);
    throw error;
  }
}

/**
 * بدء المراقبة التلقائية لجميع المشاركين النشطين
 */
export async function startAutoMonitoring() {
  try {
    // جلب جميع المشاركين النشطين
    const participantsQuery = query(
      collection(db, 'challenge_participants'),
      where('status', '==', 'active')
    );
    const participantsSnap = await getDocs(participantsQuery);

    console.log(`Starting auto-monitoring for ${participantsSnap.docs.length} active participants`);

    // مراقبة كل مشارك
    const monitoringPromises = participantsSnap.docs.map(doc => 
      monitorParticipantBalance(doc.id)
    );

    const results = await Promise.allSettled(monitoringPromises);

    // عرض النتائج
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Auto-monitoring completed: ${successful} successful, ${failed} failed`);

    return {
      total: participantsSnap.docs.length,
      successful,
      failed
    };
  } catch (error) {
    console.error('Error in auto-monitoring:', error);
    throw error;
  }
}

/**
 * جدولة المراقبة التلقائية كل 30 ثانية
 */
export function scheduleAutoMonitoring() {
  // تشغيل المراقبة فوراً
  startAutoMonitoring();

  // جدولة كل 30 ثانية
  const intervalId = setInterval(() => {
    startAutoMonitoring();
  }, 30000); // 30 ثانية

  console.log('Auto-monitoring scheduled every 30 seconds');

  return intervalId;
}

/**
 * إيقاف المراقبة التلقائية
 */
export function stopAutoMonitoring(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Auto-monitoring stopped');
  }
}

/**
 * الحصول على سجل التدقيق لمشارك
 */
export async function getParticipantAuditLog(participantId, limit = 50) {
  try {
    const auditQuery = query(
      collection(db, 'balance_audit_log'),
      where('participantId', '==', participantId)
    );
    const auditSnap = await getDocs(auditQuery);

    const logs = auditSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // ترتيب حسب الوقت (الأحدث أولاً)
    logs.sort((a, b) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return b.timestamp.toDate() - a.timestamp.toDate();
    });

    return logs.slice(0, limit);
  } catch (error) {
    console.error('Error getting audit log:', error);
    return [];
  }
}

/**
 * حساب إحصائيات البنك الافتراضي
 */
export async function calculateVirtualBankStats(challengeId) {
  try {
    // جلب جميع المشاركين في التحدي
    const participantsQuery = query(
      collection(db, 'challenge_participants'),
      where('challengeId', '==', challengeId),
      where('status', '==', 'active')
    );
    const participantsSnap = await getDocs(participantsQuery);

    let totalInitialBalance = 0;
    let totalCurrentBalance = 0;
    let totalParticipants = 0;

    participantsSnap.docs.forEach(doc => {
      const participant = doc.data();
      totalInitialBalance += participant.initialBalance || 0;
      totalCurrentBalance += participant.verifiedBalance || participant.currentBalance || 0;
      totalParticipants++;
    });

    const totalProfitLoss = totalCurrentBalance - totalInitialBalance;
    const totalProfitLossPercent = totalInitialBalance > 0 
      ? (totalProfitLoss / totalInitialBalance) * 100 
      : 0;

    return {
      totalInitialBalance,
      totalCurrentBalance,
      totalProfitLoss,
      totalProfitLossPercent,
      totalParticipants
    };
  } catch (error) {
    console.error('Error calculating virtual bank stats:', error);
    return {
      totalInitialBalance: 0,
      totalCurrentBalance: 0,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      totalParticipants: 0
    };
  }
}

export default {
  monitorParticipantBalance,
  disqualifyParticipant,
  startAutoMonitoring,
  scheduleAutoMonitoring,
  stopAutoMonitoring,
  getParticipantAuditLog,
  calculateVirtualBankStats
};
