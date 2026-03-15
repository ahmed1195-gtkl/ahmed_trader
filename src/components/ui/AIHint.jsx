import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

/**
 * AI-Based Hint Component
 * Shows intelligent suggestions based on risk parameters
 */
export const AIHint = ({ riskPercent, riskRewardRatio }) => {
  const hints = [];

  // High risk warning
  if (riskPercent > 3) {
    hints.push({
      type: 'warning',
      icon: AlertTriangle,
      text: `Risk of ${riskPercent}% is aggressive. Consider reducing to 2% or less for better capital preservation.`,
      color: 'red'
    });
  }

  // Low R:R warning
  if (riskRewardRatio < 1.5) {
    hints.push({
      type: 'warning',
      icon: TrendingUp,
      text: `Risk:Reward ratio of 1:${riskRewardRatio} is low. Aim for at least 1:2 to ensure profitable trading over time.`,
      color: 'yellow'
    });
  }

  // Good setup encouragement
  if (riskPercent <= 2 && riskRewardRatio >= 2) {
    hints.push({
      type: 'success',
      icon: Lightbulb,
      text: `Excellent setup! Low risk (${riskPercent}%) with strong reward potential (1:${riskRewardRatio}). This is professional-grade risk management.`,
      color: 'green'
    });
  }

  if (hints.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="space-y-3 mt-6">
        {hints.map((hint, index) => {
          const Icon = hint.icon;
          const colorClasses = {
            red: {
              bg: 'bg-red-500/10',
              border: 'border-red-500/30',
              icon: 'text-red-500',
              text: 'text-red-400'
            },
            yellow: {
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/30',
              icon: 'text-amber-500',
              text: 'text-amber-400'
            },
            green: {
              bg: 'bg-green-500/10',
              border: 'border-green-500/30',
              icon: 'text-green-500',
              text: 'text-green-400'
            }
          };

          const colors = colorClasses[hint.color];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-4 rounded-2xl ${colors.bg} border ${colors.border} backdrop-blur-sm`}
            >
              <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
              <p className={`text-xs ${colors.text} leading-relaxed`}>
                {hint.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default AIHint;
