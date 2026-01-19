/**
 * محرك القرار المتقدم (Decision Engine) - V12.0
 * دمج تحليل المشاعر، البيانات التاريخية، وتبسيط التفسير
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands, calculateSupportResistance } from '../analysis/technical';

export const getDecision = (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset, sentiment } = data;

  if (!prices || prices.length < 30) {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'Initializing deep market analysis and gathering historical context...',
        ar: 'جاري بدء التحليل العميق للسوق وجمع السياق التاريخي للبيانات...'
      }
    };
  }

  const currentPrice = prices[prices.length - 1];
  const tech = getTechnicalSignal(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBollingerBands(prices);
  const { support, resistance } = calculateSupportResistance(prices);

  // 1. دمج تحليل المشاعر (Sentiment Impact)
  const sentimentImpact = sentiment ? sentiment.impact * 20 : 0;

  // 2. منطق القرار المطور
  let score = tech.score;
  score += sentimentImpact; // إضافة تأثير المشاعر للقرار الفني

  // 3. حساب الثقة بناءً على توافق العوامل
  let confidence = 0;
  const rsiSignal = (rsi < 35) ? 1 : (rsi > 65) ? -1 : 0;
  const macdSignal = (macd.histogram > 0) ? 1 : -1;
  const trendSignal = (currentPrice > bb.middle) ? 1 : -1;

  // زيادة الثقة إذا اتفقت المشاعر مع التحليل الفني
  const sentimentAgreement = (score > 0 && sentimentImpact > 0) || (score < 0 && sentimentImpact < 0);
  
  confidence = Math.abs(score) * 0.8;
  if (sentimentAgreement) confidence += 15;
  
  // خفض الثقة في حالات الخطر الإخباري
  if (marketStatus === 'Danger') confidence *= 0.7;

  confidence = Math.max(0, Math.min(100, confidence));

  // 4. تحديد التوصية (تم تقليل الصرامة بناءً على طلب المستخدم)
  let recommendation = 'WAIT';
  // العتبة السابقة كانت 78 و 88، تم خفضها لتكون أقل صرامة
  const threshold = marketStatus === 'Danger' ? 80 : 70;
  
  if (confidence >= threshold) {
    recommendation = score > 0 ? 'BUY' : 'SELL';
  }

  // 5. إدارة المخاطر (Smart TP/SL)
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const tfMultiplier = timeframe === '15M' ? 0.6 : timeframe === '4H' ? 1.8 : timeframe === '1D' ? 3.5 : 1;
  const smartSL = Math.max(volatility * 0.6, 0.0015) * tfMultiplier;
  const smartTP = smartSL * 2.2; // نسبة عائد مخاطرة محسنة

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // 6. تبسيط التفسير (Human-Readable Reason)
  const getSimpleReason = (lang) => {
    const isAr = lang === 'ar';
    if (recommendation === 'WAIT') {
      if (marketStatus === 'Danger') return isAr ? "ننتظر هدوء العاصفة الإخبارية لضمان سلامة حسابك." : "Waiting for news volatility to settle for your safety.";
      if (confidence < 50) return isAr ? "السوق غير واضح حالياً، نفضل البقاء في الخارج." : "Market direction is unclear, staying aside for now.";
      return isAr ? "الإشارات قوية ولكنها لم تكتمل بعد، الصبر هو المفتاح." : "Signals are strong but not fully confirmed yet. Patience is key.";
    }

    const action = recommendation === 'BUY' ? (isAr ? "شراء" : "BUY") : (isAr ? "بيع" : "SELL");
    const reasonPart = score > 0 ? (isAr ? "قوة شرائية واضحة" : "strong buying pressure") : (isAr ? "ضغط بيعي قوي" : "strong selling pressure");
    const sentimentPart = sentimentAgreement ? (isAr ? "مع توافق مشاعر المتداولين" : "aligned with market sentiment") : "";
    
    return isAr 
      ? `قرار ${action} بناءً على ${reasonPart} ${sentimentPart}. الثقة عالية جداً.`
      : `${action} decision based on ${reasonPart} ${sentimentPart}. Confidence is very high.`;
  };

  return {
    recommendation,
    confidence,
    levels,
    accountType: { 
      en: smartSL > 0.008 ? "Pro Account" : "Standard Account", 
      ar: smartSL > 0.008 ? "حساب احترافي" : "حساب قياسي" 
    },
    reason: { en: getSimpleReason('en'), ar: getSimpleReason('ar') },
    tech: { rsi, volatility: (volatility * 100).toFixed(2), support, resistance }
  };
};
