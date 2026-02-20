/**
 * نظام الاشتراكات الثلاثي
 * FREE - PRO - ALPHA
 */

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * مستويات الاشتراك
 */
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: {
      ar: 'مجاني',
      en: 'Free',
      fr: 'Gratuit'
    },
    price: 0,
    features: {
      // الأخبار
      globalNews: true,
      currencyNews: true,
      newsAIAnalysis: false,
      newsFiltering: false,

      // الإشارات
      viewSignals: true,
      signalDetails: {
        entry: false,
        stopLoss: false,
        takeProfit: false,
        confidence: false
      },
      signalDelay: 15, // دقيقة

      // التداول
      autoTrading: false,
      manualTrading: false,

      // التحليل
      basicTechnical: true,
      advancedTechnical: false,
      multiTimeframe: false,
      smartMoney: false,

      // البيب
      pipCalculator: true,
      performanceAnalysis: false,

      // التحديات
      challenges: false,

      // الإحصائيات
      botStats: false,
      winRate: false,
      last30Days: false,

      // الإشعارات
      notifications: false,

      // أخرى
      copyTrading: false,
      fundedAccount: false,
      pdfReports: false,
      priorityExecution: false,
      earlySignals: false,
      scalpingSignals: false,
      customRiskManagement: false
    },
    limits: {
      maxSignalsPerDay: 5,
      maxOpenTrades: 0,
      maxChallenges: 0
    },
    badge: {
      color: '#9CA3AF',
      icon: '🥉'
    }
  },

  PRO: {
    id: 'pro',
    name: {
      ar: 'برو',
      en: 'Pro',
      fr: 'Pro'
    },
    price: 99, // شهرياً
    features: {
      // الأخبار
      globalNews: true,
      currencyNews: true,
      newsAIAnalysis: true,
      newsFiltering: true,

      // الإشارات
      viewSignals: true,
      signalDetails: {
        entry: true,
        stopLoss: true,
        takeProfit: true,
        confidence: true
      },
      signalDelay: 0,

      // التداول
      autoTrading: true,
      autoTradingMinConfidence: 85,
      manualTrading: true,

      // التحليل
      basicTechnical: true,
      advancedTechnical: true,
      multiTimeframe: false,
      smartMoney: false,

      // البيب
      pipCalculator: true,
      performanceAnalysis: true,

      // التحديات
      challenges: true,
      challengeRange: '10-20%',

      // الإحصائيات
      botStats: true,
      winRate: true,
      last30Days: true,

      // الإشعارات
      notifications: true,

      // أخرى
      copyTrading: false,
      fundedAccount: false,
      pdfReports: false,
      priorityExecution: false,
      earlySignals: false,
      scalpingSignals: false,
      customRiskManagement: false
    },
    limits: {
      maxSignalsPerDay: 50,
      maxOpenTrades: 5,
      maxChallenges: 3
    },
    badge: {
      color: '#3B82F6',
      icon: '🥈'
    }
  },

  ALPHA: {
    id: 'alpha',
    name: {
      ar: 'ألفا',
      en: 'Alpha',
      fr: 'Alpha'
    },
    price: 299, // شهرياً
    features: {
      // الأخبار
      globalNews: true,
      currencyNews: true,
      newsAIAnalysis: true,
      newsFiltering: true,

      // الإشارات
      viewSignals: true,
      signalDetails: {
        entry: true,
        stopLoss: true,
        takeProfit: true,
        confidence: true
      },
      signalDelay: -5, // إشارات مبكرة 5 دقائق

      // التداول
      autoTrading: true,
      autoTradingMinConfidence: 80,
      manualTrading: true,

      // التحليل
      basicTechnical: true,
      advancedTechnical: true,
      multiTimeframe: true,
      smartMoney: true,

      // البيب
      pipCalculator: true,
      performanceAnalysis: true,

      // التحديات
      challenges: true,
      challengeRange: '10-30%',
      specialChallenges: true,

      // الإحصائيات
      botStats: true,
      winRate: true,
      last30Days: true,

      // الإشعارات
      notifications: true,
      instantNotifications: true,

      // VIP Features
      copyTrading: true,
      fundedAccount: true,
      pdfReports: true,
      priorityExecution: true,
      earlySignals: true,
      scalpingSignals: true,
      customRiskManagement: true
    },
    limits: {
      maxSignalsPerDay: -1, // unlimited
      maxOpenTrades: 15,
      maxChallenges: 10
    },
    badge: {
      color: '#F59E0B',
      icon: '🥇'
    }
  }
};

/**
 * فئة خدمة الاشتراكات
 */
export class SubscriptionService {
  /**
   * الحصول على اشتراك المستخدم
   */
  static async getUserSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return {
          tier: 'free',
          ...SUBSCRIPTION_TIERS.FREE,
          expiresAt: null,
          isActive: true
        };
      }

      const userData = userDoc.data();
      const subscription = userData.subscription || {};

      const tier = subscription.tier || 'free';
      const expiresAt = subscription.expiresAt?.toDate() || null;
      const isActive = expiresAt ? expiresAt > new Date() : tier === 'free';

      return {
        tier: isActive ? tier : 'free',
        ...SUBSCRIPTION_TIERS[isActive ? tier.toUpperCase() : 'FREE'],
        expiresAt,
        isActive,
        startedAt: subscription.startedAt?.toDate() || null
      };

    } catch (error) {
      console.error('Error getting user subscription:', error);
      return {
        tier: 'free',
        ...SUBSCRIPTION_TIERS.FREE,
        expiresAt: null,
        isActive: true
      };
    }
  }

  /**
   * التحقق من صلاحية ميزة معينة
   */
  static async hasFeature(userId, featurePath) {
    const subscription = await this.getUserSubscription(userId);
    
    const keys = featurePath.split('.');
    let value = subscription.features;

    for (const key of keys) {
      if (value === undefined || value === null) return false;
      value = value[key];
    }

    return value === true;
  }

  /**
   * التحقق من الحد الأقصى
   */
  static async checkLimit(userId, limitName, currentValue) {
    const subscription = await this.getUserSubscription(userId);
    const limit = subscription.limits[limitName];

    if (limit === -1) return true; // unlimited
    if (limit === undefined) return false;

    return currentValue < limit;
  }

  /**
   * ترقية الاشتراك
   */
  static async upgradeSubscription(userId, newTier, durationMonths = 1) {
    try {
      const tierKey = newTier.toUpperCase();
      
      if (!SUBSCRIPTION_TIERS[tierKey]) {
        throw new Error('Invalid subscription tier');
      }

      if (tierKey === 'FREE') {
        throw new Error('Cannot upgrade to FREE tier');
      }

      const startDate = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

      await updateDoc(doc(db, 'users', userId), {
        'subscription.tier': newTier.toLowerCase(),
        'subscription.startedAt': startDate,
        'subscription.expiresAt': expiresAt,
        'subscription.lastPayment': {
          amount: SUBSCRIPTION_TIERS[tierKey].price * durationMonths,
          date: startDate,
          months: durationMonths
        }
      });

      console.log(`✅ تمت ترقية ${userId} إلى ${newTier}`);

      return {
        success: true,
        tier: newTier.toLowerCase(),
        expiresAt
      };

    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  /**
   * إلغاء الاشتراك
   */
  static async cancelSubscription(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        'subscription.tier': 'free',
        'subscription.canceledAt': new Date(),
        'subscription.expiresAt': null
      });

      console.log(`✅ تم إلغاء اشتراك ${userId}`);

      return { success: true };

    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * تطبيق فلتر على الإشارات حسب الاشتراك
   */
  static async filterSignalForUser(userId, signal) {
    const subscription = await this.getUserSubscription(userId);

    const filtered = { ...signal };

    // FREE: إخفاء التفاصيل
    if (subscription.tier === 'free') {
      filtered.entry = null;
      filtered.stopLoss = null;
      filtered.takeProfit = null;
      filtered.confidence = null;
      filtered.positionSize = null;
      
      // تأخير الإشارة
      const signalTime = signal.timestamp || Date.now();
      const delay = subscription.features.signalDelay * 60 * 1000;
      filtered.timestamp = signalTime + delay;
      
      filtered.restricted = true;
      filtered.upgradeMessage = {
        ar: 'قم بالترقية إلى PRO لرؤية التفاصيل الكاملة',
        en: 'Upgrade to PRO to see full details',
        fr: 'Passez à PRO pour voir tous les détails'
      };
    }

    // PRO: كل شيء متاح
    // ALPHA: إشارات مبكرة
    if (subscription.tier === 'alpha' && subscription.features.earlySignals) {
      const signalTime = signal.timestamp || Date.now();
      const earlyTime = Math.abs(subscription.features.signalDelay) * 60 * 1000;
      filtered.timestamp = signalTime - earlyTime;
      filtered.early = true;
    }

    return filtered;
  }

  /**
   * الحصول على جميع المستخدمين حسب المستوى
   */
  static async getUsersByTier(tier) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('subscription.tier', '==', tier.toLowerCase()));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('Error getting users by tier:', error);
      return [];
    }
  }

  /**
   * إحصائيات الاشتراكات
   */
  static async getSubscriptionStats() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const stats = {
        total: 0,
        free: 0,
        pro: 0,
        alpha: 0,
        revenue: {
          monthly: 0,
          yearly: 0
        }
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const tier = data.subscription?.tier || 'free';
        
        stats.total++;
        stats[tier]++;

        if (tier === 'pro') {
          stats.revenue.monthly += SUBSCRIPTION_TIERS.PRO.price;
        } else if (tier === 'alpha') {
          stats.revenue.monthly += SUBSCRIPTION_TIERS.ALPHA.price;
        }
      });

      stats.revenue.yearly = stats.revenue.monthly * 12;

      return stats;

    } catch (error) {
      console.error('Error getting subscription stats:', error);
      return null;
    }
  }
}

export default SubscriptionService;
