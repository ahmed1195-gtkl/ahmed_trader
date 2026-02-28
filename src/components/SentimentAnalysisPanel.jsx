import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeSentimentPriceCorrelation, generateSentimentReport } from '@/lib/bot/analysis/sentimentPriceCorrelation';
import { useTranslation } from 'react-i18next';

export default function SentimentAnalysisPanel({ news, currentPrice, historicalPrices }) {
  const { i18n } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (news && news.length > 0 && currentPrice && historicalPrices) {
      analyzeData();
    }
  }, [news, currentPrice, historicalPrices]);

  const analyzeData = async () => {
    setLoading(true);
    try {
      const correlationAnalysis = await analyzeSentimentPriceCorrelation(
        news,
        currentPrice,
        historicalPrices
      );
      setAnalysis(correlationAnalysis);

      const sentimentReport = generateSentimentReport(
        news,
        currentPrice,
        historicalPrices
      );
      setReport(sentimentReport);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analysis || !report) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest">
            {i18n.language === 'ar' ? 'تحليل المشاعر...' : 'Analyzing Sentiment...'}
          </p>
        </div>
      </div>
    );
  }

  const recommendation = analysis.recommendation;
  const isPositive = recommendation.action === 'BUY';
  const isNegative = recommendation.action === 'SELL';

  return (
    <div className="space-y-6">
      {/* بطاقة التوصية الرئيسية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2.5rem] p-10 border backdrop-blur-3xl relative overflow-hidden ${
          isPositive
            ? 'bg-green-500/10 border-green-500/30'
            : isNegative
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}
      >
        <div className="absolute top-0 right-0 opacity-10 -mr-12 -mt-12">
          {isPositive ? (
            <TrendingUp className="w-32 h-32 text-green-500" />
          ) : isNegative ? (
            <TrendingDown className="w-32 h-32 text-red-500" />
          ) : (
            <AlertCircle className="w-32 h-32 text-blue-500" />
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                {i18n.language === 'ar' ? 'التوصية' : 'Recommendation'}
              </p>
              <h3 className={`text-4xl font-black uppercase tracking-tighter ${
                isPositive
                  ? 'text-green-500'
                  : isNegative
                  ? 'text-red-500'
                  : 'text-blue-500'
              }`}>
                {recommendation.action}
              </h3>
            </div>
            <div className="text-right">
              <div className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] ${
                recommendation.strength === 'STRONG'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-white'
              }`}>
                {recommendation.strength}
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {recommendation.reason}
          </p>

          {recommendation.warning && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {recommendation.warning}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">
                {i18n.language === 'ar' ? 'السعر المستهدف' : 'Target Price'}
              </p>
              <p className="text-2xl font-black text-white">
                ${recommendation.targetPrice.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">
                {i18n.language === 'ar' ? 'إيقاف الخسارة' : 'Stop Loss'}
              </p>
              <p className="text-2xl font-black text-red-500">
                ${recommendation.stopLoss ? recommendation.stopLoss.toFixed(2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: i18n.language === 'ar' ? 'درجة المشاعر' : 'Sentiment Score',
            value: analysis.sentimentScore,
            suffix: '',
            color: analysis.sentimentScore > 0 ? 'text-green-500' : analysis.sentimentScore < 0 ? 'text-red-500' : 'text-gray-500',
            bg: analysis.sentimentScore > 0 ? 'bg-green-500/5' : analysis.sentimentScore < 0 ? 'bg-red-500/5' : 'bg-white/5'
          },
          {
            label: i18n.language === 'ar' ? 'درجة الثقة' : 'Confidence',
            value: analysis.prediction.confidence,
            suffix: '%',
            color: analysis.prediction.confidence > 60 ? 'text-green-500' : analysis.prediction.confidence > 40 ? 'text-yellow-500' : 'text-red-500',
            bg: analysis.prediction.confidence > 60 ? 'bg-green-500/5' : analysis.prediction.confidence > 40 ? 'bg-yellow-500/5' : 'bg-red-500/5'
          },
          {
            label: i18n.language === 'ar' ? 'الارتباط' : 'Correlation',
            value: (analysis.correlation * 100).toFixed(0),
            suffix: '%',
            color: 'text-blue-500',
            bg: 'bg-blue-500/5'
          },
          {
            label: i18n.language === 'ar' ? 'الأخبار العالية التأثير' : 'High Impact News',
            value: analysis.analysis.highImpactNews,
            suffix: '',
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/5'
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.bg} backdrop-blur-xl border border-white/5 rounded-2xl p-6`}
          >
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
              {stat.label}
            </p>
            <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>
              {stat.value}{stat.suffix}
            </p>
          </motion.div>
        ))}
      </div>

      {/* توزيع المشاعر */}
      <Card className="bg-zinc-900/20 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">
            {i18n.language === 'ar' ? 'توزيع المشاعر' : 'Sentiment Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {[
              {
                label: i18n.language === 'ar' ? 'أخبار صعودية' : 'Bullish News',
                count: analysis.analysis.bullishNews,
                color: 'bg-green-500',
                percentage: (analysis.analysis.bullishNews / report.summary.totalNews) * 100
              },
              {
                label: i18n.language === 'ar' ? 'أخبار محايدة' : 'Neutral News',
                count: analysis.analysis.neutralNews,
                color: 'bg-gray-500',
                percentage: (analysis.analysis.neutralNews / report.summary.totalNews) * 100
              },
              {
                label: i18n.language === 'ar' ? 'أخبار هبوطية' : 'Bearish News',
                count: analysis.analysis.bearishNews,
                color: 'bg-red-500',
                percentage: (analysis.analysis.bearishNews / report.summary.totalNews) * 100
              }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-black text-white">
                    {item.count} ({Math.round(item.percentage)}%)
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أهم الأخبار */}
      <Card className="bg-zinc-900/20 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">
            {i18n.language === 'ar' ? 'أهم الأخبار المؤثرة' : 'Top Impactful News'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {report.topNews.map((newsItem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    newsItem.sentiment === 'Positive'
                      ? 'bg-green-500/10 text-green-500'
                      : newsItem.sentiment === 'Negative'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {newsItem.sentiment === 'Positive' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : newsItem.sentiment === 'Negative' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={newsItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-gray-300 group-hover:text-yellow-500 transition-colors line-clamp-2 block"
                    >
                      {newsItem.title}
                    </a>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
                      {newsItem.source}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
