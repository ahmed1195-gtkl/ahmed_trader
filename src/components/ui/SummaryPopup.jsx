import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, X, TrendingUp, Shield, Award, Calendar } from 'lucide-react';

/**
 * Daily/Weekly Summary Popup
 * Shows comprehensive risk and performance summary
 */
export const SummaryPopup = ({ dailyRiskStatus, positionQuality, riskSummary }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!dailyRiskStatus && !positionQuality) return null;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-2xl hover:shadow-amber-500/50 transition-all"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Summary</span>
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <Calendar className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white">Daily Summary</h2>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Risk & Performance Overview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Daily Risk Status */}
                {dailyRiskStatus && (
                  <div className="mb-6 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-orange-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-orange-500">Daily Risk Usage</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Used</p>
                        <p className="text-2xl font-black text-white">{dailyRiskStatus.totalRisk}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Remaining</p>
                        <p className="text-2xl font-black text-green-500">{dailyRiskStatus.remainingRisk}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Trades</p>
                        <p className="text-2xl font-black text-white">{dailyRiskStatus.totalTrades}</p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, dailyRiskStatus.utilizationPercent)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Position Quality */}
                {positionQuality && (
                  <div className="mb-6 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-purple-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-purple-500">Position Quality</h3>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-4xl font-black text-white mb-1">{positionQuality.score}/100</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{positionQuality.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Risk Score</p>
                        <p className="text-sm font-black text-white">{positionQuality.details.riskScore}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-2 mb-1">Reward Score</p>
                        <p className="text-sm font-black text-white">{positionQuality.details.rewardScore}</p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${positionQuality.color}-500 transition-all duration-500`}
                        style={{ width: `${positionQuality.score}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Risk Summary */}
                {riskSummary && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <p className="text-xs text-green-500 uppercase tracking-widest">Potential Profit</p>
                      </div>
                      <p className="text-2xl font-black text-white">${riskSummary.potentialProfit}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        <p className="text-xs text-red-500 uppercase tracking-widest">Potential Loss</p>
                      </div>
                      <p className="text-2xl font-black text-white">${riskSummary.potentialLoss}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SummaryPopup;
