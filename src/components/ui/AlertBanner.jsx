import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

/**
 * Alert Banner Component
 * Shows warning when daily risk exceeds threshold
 */
export const AlertBanner = ({ dailyRiskStatus, onDismiss }) => {
  if (!dailyRiskStatus || !dailyRiskStatus.isLimitReached) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-1">
              Daily Risk Limit Reached
            </h4>
            <p className="text-xs text-red-400 leading-relaxed">
              You've used <strong>{dailyRiskStatus.totalRisk}%</strong> of your daily risk limit ({dailyRiskStatus.maxDailyRisk}%). 
              Consider taking a break or reviewing your positions before opening new trades.
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
