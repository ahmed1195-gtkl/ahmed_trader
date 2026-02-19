import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Target, Shield, Activity, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LiveTradesPanel = ({ trades, stats, onClose, onCloseTrade }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {t('aibot.live_trades')}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              {t('aibot.real_time_monitoring')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Performance Stats */}
        {stats && (
          <div className="p-6 border-b border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4">
              {t('aibot.performance_stats')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.total_trades')}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{stats.totalTrades}</p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.win_rate')}
                  </span>
                </div>
                <p className="text-2xl font-black text-green-500">{stats.winRate}%</p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.total_profit')}
                  </span>
                </div>
                <p className={`text-2xl font-black ${parseFloat(stats.totalProfit) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.totalProfit}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.avg_profit')}
                  </span>
                </div>
                <p className={`text-2xl font-black ${parseFloat(stats.avgProfit) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.avgProfit}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.max_drawdown')}
                  </span>
                </div>
                <p className="text-2xl font-black text-red-500">${stats.maxDrawdown}</p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  <span className="text-[10px] text-gray-500 uppercase font-black">
                    {t('aibot.profit_factor')}
                  </span>
                </div>
                <p className="text-2xl font-black text-cyan-500">{stats.profitFactor}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active Trades */}
        <div className="p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4">
            {t('aibot.active_trades')} ({trades.length})
          </h3>
          
          {trades.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-sm uppercase font-black tracking-widest">
                {t('aibot.no_active_trades')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-black text-white uppercase">
                          {trade.symbol}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          trade.action === 'BUY' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {trade.action}
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-black">
                          {trade.timeframe}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {t('aibot.confidence')}: {trade.confidence}%
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-2xl font-black ${
                        trade.profitLossPercent > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {trade.profitLossPercent > 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-500 uppercase font-black">
                        ${trade.profitLoss.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                        {t('aibot.entry_price')}
                      </p>
                      <p className="text-sm font-black text-white">
                        {trade.entryPrice.toFixed(5)}
                      </p>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                        {t('aibot.current_price')}
                      </p>
                      <p className="text-sm font-black text-yellow-500">
                        {trade.currentPrice.toFixed(5)}
                      </p>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                        {t('aibot.take_profit')}
                      </p>
                      <p className="text-sm font-black text-green-500">
                        {trade.takeProfit.toFixed(5)}
                      </p>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-3">
                      <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                        {t('aibot.stop_loss')}
                      </p>
                      <p className="text-sm font-black text-red-500">
                        {trade.stopLoss.toFixed(5)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-black/40 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all ${
                        trade.profitLossPercent > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(trade.profitLossPercent) * 10, 100)}%` 
                      }}
                    />
                  </div>

                  <button
                    onClick={() => onCloseTrade(trade.id, trade.currentPrice)}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {t('aibot.close_trade')}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LiveTradesPanel;
