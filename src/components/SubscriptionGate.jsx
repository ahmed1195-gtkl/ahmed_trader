/**
 * مكون SubscriptionGate
 * يتحكم في الوصول للميزات حسب مستوى الاشتراك
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../lib/subscriptionService';
import { Lock, Crown, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * مكون حماية الميزات
 */
export function SubscriptionGate({ 
  feature, 
  children, 
  fallback,
  showUpgradeButton = true 
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    checkAccess();
  }, [user, feature]);

  const checkAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      const sub = await SubscriptionService.getUserSubscription(user.uid);
      setSubscription(sub);

      const access = await SubscriptionService.hasFeature(user.uid, feature);
      setHasAccess(access);
    } catch (error) {
      console.error('Error checking feature access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt 
      currentTier={subscription?.tier || 'free'}
      feature={feature}
      showButton={showUpgradeButton}
    />
  );
}

/**
 * رسالة الترقية
 */
function UpgradePrompt({ currentTier, feature, showButton }) {
  const { t } = useTranslation();

  const getRequiredTier = (feature) => {
    if (feature.includes('multiTimeframe') || feature.includes('smartMoney') || feature.includes('copyTrading')) {
      return 'alpha';
    }
    return 'pro';
  };

  const requiredTier = getRequiredTier(feature);

  const tierInfo = {
    pro: {
      name: t('subscription.pro'),
      icon: <Crown className="w-8 h-8" />,
      color: 'blue',
      price: '$99/month'
    },
    alpha: {
      name: t('subscription.alpha'),
      icon: <Zap className="w-8 h-8" />,
      color: 'yellow',
      price: '$299/month'
    }
  };

  const info = tierInfo[requiredTier];

  return (
    <div className="bg-gray-800 rounded-lg p-8 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${info.color}-500/20 mb-4`}>
        <Lock className="w-8 h-8 text-yellow-500" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {t('subscription.featureLocked')}
      </h3>

      <p className="text-gray-400 mb-6">
        {t('subscription.upgradeRequired', { tier: info.name })}
      </p>

      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${info.color}-500/20 text-${info.color}-500 mb-6`}>
        {info.icon}
        <div className="text-left">
          <div className="font-bold">{info.name}</div>
          <div className="text-sm">{info.price}</div>
        </div>
      </div>

      {showButton && (
        <button
          onClick={() => window.location.href = '/subscription'}
          className={`px-6 py-3 bg-${info.color}-500 text-white rounded-lg hover:bg-${info.color}-600 transition-colors font-bold`}
        >
          {t('subscription.upgradeNow')}
        </button>
      )}
    </div>
  );
}

/**
 * مكون شارة الاشتراك
 */
export function SubscriptionBadge({ tier }) {
  const badges = {
    free: {
      icon: '🥉',
      color: 'gray',
      name: 'Free'
    },
    pro: {
      icon: '🥈',
      color: 'blue',
      name: 'Pro'
    },
    alpha: {
      icon: '🥇',
      color: 'yellow',
      name: 'Alpha'
    }
  };

  const badge = badges[tier] || badges.free;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-${badge.color}-500/20 text-${badge.color}-500 text-sm font-bold`}>
      <span>{badge.icon}</span>
      <span>{badge.name}</span>
    </span>
  );
}

/**
 * مكون حد الاستخدام
 */
export function UsageLimitIndicator({ userId, limitName, currentValue }) {
  const [limit, setLimit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLimit();
  }, [userId, limitName]);

  const loadLimit = async () => {
    try {
      const subscription = await SubscriptionService.getUserSubscription(userId);
      const limitValue = subscription.limits[limitName];
      setLimit(limitValue);
    } catch (error) {
      console.error('Error loading limit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || limit === null) return null;

  if (limit === -1) {
    return (
      <div className="text-sm text-green-500">
        ∞ Unlimited
      </div>
    );
  }

  const percentage = (currentValue / limit) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={isNearLimit ? 'text-red-500' : 'text-gray-400'}>
          {currentValue} / {limit}
        </span>
        <span className={isNearLimit ? 'text-red-500' : 'text-gray-400'}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isNearLimit ? 'bg-red-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="text-xs text-red-500">
          You're approaching your limit. Consider upgrading!
        </p>
      )}
    </div>
  );
}

export default SubscriptionGate;
