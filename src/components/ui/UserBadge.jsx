import React from 'react';
import { Shield, Crown, Award, Zap } from 'lucide-react';

/**
 * Resolves the primary role/badge details for a user document or user props object.
 * Hierarchy: ADMIN > ACCOUNT MANAGER > PREMIUM > PRO > Normal
 *
 * @param {object} userData
 * @returns {object|null} Badge config object or null if normal user
 */
export function getBadgeConfig(userData) {
  if (!userData) return null;

  // 1. ADMIN
  const isAdmin = userData.role === 'admin' || userData.isAdmin === true;
  if (isAdmin) {
    return {
      type: 'ADMIN',
      label: 'ADMIN',
      icon: Shield,
      bgClass: 'bg-amber-500/15 border-amber-500/30 text-amber-500',
      glowClass: 'shadow-amber-500/10'
    };
  }

  // 2. ACCOUNT MANAGER
  const isAccountManager = userData.role === 'account_manager' || userData.isAccountManager === true;
  if (isAccountManager) {
    return {
      type: 'ACCOUNT_MANAGER',
      label: 'ACCOUNT MANAGER',
      icon: Crown,
      bgClass: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      glowClass: 'shadow-purple-500/10'
    };
  }

  // 3. PREMIUM
  const isPremium = userData.accountTier === 'premium' || userData.isPremium === true || userData.subscription === 'premium' || userData.subscriptionTier === 'premium';
  if (isPremium) {
    return {
      type: 'PREMIUM',
      label: 'PREMIUM',
      icon: Award,
      bgClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      glowClass: 'shadow-emerald-500/10'
    };
  }

  // 4. PRO
  const isPro = userData.accountTier === 'pro' || userData.isPro === true || userData.subscription === 'pro' || userData.subscription === 'alpha';
  if (isPro) {
    return {
      type: 'PRO',
      label: 'PRO',
      icon: Zap,
      bgClass: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      glowClass: 'shadow-sky-500/10'
    };
  }

  return null;
}

/**
 * UserBadge Component
 * Renders a compact, subtle, premium badge beside user names across profiles, comments, feed posts, and user lists.
 */
export default function UserBadge({ userData, showIcon = true, className = '' }) {
  const config = getBadgeConfig(userData);
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${config.bgClass} ${config.glowClass} ${className}`}
      title={config.label}
    >
      {showIcon && <IconComponent className="w-2.5 h-2.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
