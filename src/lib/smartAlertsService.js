import { db } from './firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * ═══════════════════════════════════════════════════════════════
 * Smart Alerts Service
 * ═══════════════════════════════════════════════════════════════
 * تنبيهات ذكية مخصصة بناءً على سلوك المتداول
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * توليد تنبيهات ذكية للمستخدم
 */
export async function generateSmartAlerts(userId) {
  try {
    const alerts = [];

    // جلب بيانات المستخدم
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }

    // جلب المشاركات النشطة
    const participantsQuery = query(
      collection(db, 'challenge_participants'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const participantsSnap = await getDocs(participantsQuery);

    for (const participantDoc of participantsSnap.docs) {
      const participant = participantDoc.data();

      // تنبيه: اقتراب من الهدف
      const profitPercent = ((participant.currentBalance - participant.initialBalance) / participant.initialBalance) * 100;
      const targetProfit = participant.targetProfit || 20;
      
      if (profitPercent >= targetProfit * 0.9 && profitPercent < targetProfit) {
        alerts.push({
          type: 'goal',
          priority: 'high',
          icon: '🎯',
          title: 'Almost There!',
          message: `You're ${(targetProfit - profitPercent).toFixed(2)}% away from passing the challenge!`,
          action: 'Stay focused and manage your risk'
        });
      }

      // تنبيه: اقتراب من حد الخسارة
      const maxDrawdown = participant.maxDrawdownLimit || 10;
      if (participant.currentDrawdown >= maxDrawdown * 0.8) {
        alerts.push({
          type: 'risk',
          priority: 'critical',
          icon: '⚠️',
          title: 'Risk Alert',
          message: `You're approaching max drawdown limit (${participant.currentDrawdown.toFixed(2)}% / ${maxDrawdown}%)`,
          action: 'Consider closing losing positions'
        });
      }

      // تنبيه: أداء ممتاز
      if (profitPercent > 0 && participant.winRate > 70) {
        alerts.push({
          type: 'success',
          priority: 'medium',
          icon: '🔥',
          title: 'Great Performance!',
          message: `You're on fire! ${participant.winRate.toFixed(0)}% win rate with ${profitPercent.toFixed(2)}% profit`,
          action: 'Keep up the good work'
        });
      }
    }

    // جلب الصفقات المفتوحة
    const openTradesQuery = query(
      collection(db, 'challenge_trades'),
      where('userId', '==', userId),
      where('status', '==', 'open')
    );
    const openTradesSnap = await getDocs(openTradesQuery);

    // تنبيه: صفقات مفتوحة لفترة طويلة
    openTradesSnap.docs.forEach(tradeDoc => {
      const trade = tradeDoc.data();
      const hoursSinceOpen = (Date.now() - trade.openTime.toDate().getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceOpen > 48) {
        alerts.push({
          type: 'info',
          priority: 'low',
          icon: '⏰',
          title: 'Long-Running Trade',
          message: `Your ${trade.symbol} ${trade.type} trade has been open for ${Math.floor(hoursSinceOpen)} hours`,
          action: 'Consider reviewing your exit strategy'
        });
      }
    });

    // ترتيب حسب الأولوية
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    alerts.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return alerts;
  } catch (error) {
    console.error('Error generating smart alerts:', error);
    return [];
  }
}

/**
 * إرسال تنبيه للمستخدم
 */
export async function sendAlert(userId, alert) {
  try {
    const notificationRef = doc(collection(db, 'notifications'));
    await setDoc(notificationRef, {
      userId,
      type: 'alert',
      ...alert,
      read: false,
      createdAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error sending alert:', error);
    return false;
  }
}

export default {
  generateSmartAlerts,
  sendAlert
};
