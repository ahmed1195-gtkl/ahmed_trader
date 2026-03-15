import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, AlertCircle, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { fetchNewsForSymbol } from '../lib/bot/analysis/newsService';

function NewsPanel({ symbol, onClose }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
  }, [symbol]);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newsData = await fetchNewsForSymbol(symbol, 5);
      setNews(newsData);
    } catch (err) {
      setError('فشل تحميل الأخبار');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'negative':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    const labels = {
      high: 'تأثير عالي',
      medium: 'تأثير متوسط',
      low: 'تأثير منخفض'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-lg border ${colors[impact] || colors.low}`}>
        {labels[impact] || labels.low}
      </span>
    );
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
            <Newspaper className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">أخبار {symbol}</h3>
            <p className="text-sm text-gray-400">آخر الأخبار المؤثرة</p>
          </div>
        </div>
        
        <button
          onClick={loadNews}
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={loadNews}
            className="mt-3 text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* News List */}
      {!loading && !error && (
        <div className="space-y-4">
          <AnimatePresence>
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-4 hover:border-amber-500/30 transition-all group"
              >
                {/* News Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${getSentimentColor(item.sentiment)}`}>
                      {getSentimentIcon(item.sentiment)}
                    </div>
                    {getImpactBadge(item.impact)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(item.publishedAt)}
                  </span>
                </div>

                {/* News Title */}
                <h4 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>

                {/* News Description */}
                {item.description && (
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* News Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    المصدر: {item.source}
                  </span>
                  
                  {item.url && item.url !== '#' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      اقرأ المزيد
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {news.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">لا توجد أخبار متاحة حالياً</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default NewsPanel;
