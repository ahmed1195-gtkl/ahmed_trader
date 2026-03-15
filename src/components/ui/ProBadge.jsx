import React from 'react';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Pro Badge Component
 * Shows "Pro" badge for premium features
 */
export const ProBadge = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[8px] font-black uppercase tracking-widest shadow-lg ${className}`}
    >
      <Crown className="w-2.5 h-2.5" />
      <span>Pro</span>
    </motion.div>
  );
};

export default ProBadge;
