/**
 * صفحة الاشتراكات
 * عرض المستويات الثلاثة والترقية
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService, SUBSCRIPTION_TIERS } from '../lib/subscriptionService';
import { Check, X, Crown, Zap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      const sub = await SubscriptionService.getUserSubscription(user.uid);
      setCurrentSubscription(sub);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    try {
      await SubscriptionService.upgradeSubscription(user.uid, tier);
      alert(`Successfully upgraded to ${tier}!`);
      loadSubscription();
    } catch (error) {
      console.error('Error upgrading:', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('subscription.chooseYourPlan')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('subscription.unlockFullPotential')}
          </p>
          
          {currentSubscription && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <span className="text-gray-400">{t('subscription.currentPlan')}:</span>
              <span className="font-bold text-amber-500">
                {currentSubscription.name[i18n.language]}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* FREE */}
          <PricingCard
            tier="FREE"
            data={SUBSCRIPTION_TIERS.FREE}
            current={currentSubscription?.tier === 'free'}
            onUpgrade={handleUpgrade}
            language={i18n.language}
          />

          {/* PRO */}
          <PricingCard
            tier="PRO"
            data={SUBSCRIPTION_TIERS.PRO}
            current={currentSubscription?.tier === 'pro'}
            onUpgrade={handleUpgrade}
            featured={true}
            language={i18n.language}
          />

          {/* ALPHA */}
          <PricingCard
            tier="ALPHA"
            data={SUBSCRIPTION_TIERS.ALPHA}
            current={currentSubscription?.tier === 'alpha'}
            onUpgrade={handleUpgrade}
            language={i18n.language}
          />
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {t('subscription.featureComparison')}
          </h2>
          <FeaturesTable language={i18n.language} />
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, data, current, onUpgrade, featured, language }) {
  const isAlpha = tier === 'ALPHA';
  const isPro = tier === 'PRO';
  const isFree = tier === 'FREE';

  return (
    <div className={`relative bg-gray-800 rounded-xl p-8 ${featured ? 'ring-2 ring-amber-500 transform scale-105' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
        isAlpha ? 'bg-amber-500/20' : isPro ? 'bg-blue-500/20' : 'bg-gray-700'
      }`}>
        <span className="text-3xl">{data.badge.icon}</span>
      </div>

      {/* Name */}
      <h3 className="text-2xl font-bold text-white mb-2">
        {data.name[language]}
      </h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">${data.price}</span>
        {!isFree && <span className="text-gray-400">/month</span>}
      </div>

      {/* Button */}
      {current ? (
        <button
          disabled
          className="w-full py-3 bg-gray-700 text-gray-400 rounded-lg font-bold cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : isFree ? (
        <button
          disabled
          className="w-full py-3 bg-gray-700 text-gray-400 rounded-lg font-bold cursor-not-allowed"
        >
          Default Plan
        </button>
      ) : (
        <button
          onClick={() => onUpgrade(tier.toLowerCase())}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            isAlpha
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Upgrade Now
        </button>
      )}

      {/* Key Features */}
      <div className="mt-8 space-y-3">
        {getKeyFeatures(tier).map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getKeyFeatures(tier) {
  const features = {
    FREE: [
      'Global News',
      'Currency News (Basic)',
      'View Bot Signals (Delayed)',
      'Pip Calculator',
      'Limited to 5 signals/day'
    ],
    PRO: [
      'All FREE features',
      'Full Signal Details (Entry/SL/TP)',
      'Auto Trading (≥85% confidence)',
      'Trading Challenges (10-20%)',
      'Performance Analysis',
      'Win Rate Statistics',
      'Real-time Notifications',
      'Up to 5 open trades'
    ],
    ALPHA: [
      'All PRO features',
      '🔥 Early Signals (5 min before)',
      '🔥 Multi-Timeframe Analysis',
      '🔥 Smart Money Analysis',
      '🔥 Copy Trading',
      '🔥 Funded Account Access',
      '🔥 Scalping Signals',
      '🔥 Custom Risk Management',
      '🔥 Weekly PDF Reports',
      'Up to 15 open trades',
      'Unlimited signals'
    ]
  };

  return features[tier] || [];
}

function FeaturesTable({ language }) {
  const features = [
    { name: 'Global News', free: true, pro: true, alpha: true },
    { name: 'Currency News', free: true, pro: true, alpha: true },
    { name: 'AI News Analysis', free: false, pro: true, alpha: true },
    { name: 'View Signals', free: true, pro: true, alpha: true },
    { name: 'Signal Details (Entry/SL/TP)', free: false, pro: true, alpha: true },
    { name: 'Signal Delay', free: '15 min', pro: 'Real-time', alpha: '5 min early' },
    { name: 'Auto Trading', free: false, pro: true, alpha: true },
    { name: 'Trading Challenges', free: false, pro: true, alpha: true },
    { name: 'Performance Analysis', free: false, pro: true, alpha: true },
    { name: 'Multi-Timeframe Analysis', free: false, pro: false, alpha: true },
    { name: 'Smart Money Analysis', free: false, pro: false, alpha: true },
    { name: 'Copy Trading', free: false, pro: false, alpha: true },
    { name: 'Funded Account', free: false, pro: false, alpha: true },
    { name: 'PDF Reports', free: false, pro: false, alpha: true },
    { name: 'Max Open Trades', free: '0', pro: '5', alpha: '15' },
    { name: 'Max Signals/Day', free: '5', pro: '50', alpha: '∞' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-4 text-left text-white font-bold">Feature</th>
            <th className="px-6 py-4 text-center text-white font-bold">🥉 Free</th>
            <th className="px-6 py-4 text-center text-white font-bold">🥈 Pro</th>
            <th className="px-6 py-4 text-center text-white font-bold">🥇 Alpha</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="px-6 py-4 text-gray-300">{feature.name}</td>
              <td className="px-6 py-4 text-center">
                {renderFeatureValue(feature.free)}
              </td>
              <td className="px-6 py-4 text-center">
                {renderFeatureValue(feature.pro)}
              </td>
              <td className="px-6 py-4 text-center">
                {renderFeatureValue(feature.alpha)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFeatureValue(value) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-red-500 mx-auto" />;
  }
  return <span className="text-gray-300">{value}</span>;
}
