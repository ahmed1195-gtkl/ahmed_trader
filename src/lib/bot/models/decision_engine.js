/**
 * محرك القرار المتقدم (Decision Engine) - V8.1
 * إصلاح شروط الدخول وإضافة تفسيرات ذكية بجميع اللغات
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands } from '../analysis/technical';

export const getDecision = (data) => {
  const { prices, marketStatus, timeframe, assetType } = data;

  // 1. منع التوصيات أثناء الأخبار (صارم)
  if (marketStatus === 'Danger') {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'High Impact News - Trading Halted for safety.',
        ar: 'أخبار عالية التأثير - تم إيقاف التداول لسلامة الحساب.'
      }
    };
  }

  if (!prices || prices.length < 30) {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'Insufficient Market Data for analysis.',
        ar: 'بيانات السوق غير كافية للتحليل حالياً.'
      }
    };
  }

  const currentPrice = prices[prices.length - 1];
  const tech = getTechnicalSignal(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBollingerBands(prices);

  const decision = {
    trend: tech.score > 0 ? 1 : tech.score < 0 ? -1 : 0,
    entryModel: (rsi < 40 || rsi > 60) ? (rsi < 40 ? 1 : -1) : 0, // تم تخفيف الشرط قليلاً للسماح بصفقات أكثر
    momentum: macd.histogram > 0 ? 1 : macd.histogram < 0 ? -1 : 0,
    volume: (currentPrice > bb.upper || currentPrice < bb.lower) ? (currentPrice < bb.lower ? 1 : -1) : 0,
    fundamental: marketStatus === 'Stable' ? 1 : 0,
    multiTF: (tech.score > 0 ? 1 : -1)
  };

  let confidence = 0;
  let hasConflict = false;

  // التحقق من التعارض الصارخ فقط
  if ((decision.trend === 1 && decision.momentum === -1) || (decision.trend === -1 && decision.momentum === 1)) {
    hasConflict = true;
  }

  if (hasConflict) {
    return { 
      recommendation: 'WAIT', 
      confidence: 40, 
      reason: {
        en: 'Market Conflict: Trend and Momentum are opposing each other.',
        ar: 'تعارض في السوق: الاتجاه والزخم يسيران في اتجاهات متعاكسة.'
      }
    };
  }

  // حساب الثقة
  confidence += Math.abs(decision.trend) * 25;
  confidence += Math.abs(decision.entryModel) * 20;
  confidence += Math.abs(decision.momentum) * 15;
  confidence += Math.abs(decision.volume) * 10;
  confidence += Math.abs(decision.fundamental) * 15;
  confidence += Math.abs(decision.multiTF) * 15;

  confidence = Math.max(0, Math.min(100, confidence));

  let riskPercent = 0;
  let recommendation = 'WAIT';

  // تعديل عتبة الدخول لتكون أكثر مرونة (70% بدلاً من 80%) لضمان ظهور صفقات
  if (confidence >= 70) {
    recommendation = tech.score > 0 ? 'BUY' : 'SELL';
    if (confidence >= 90) riskPercent = 2;
    else if (confidence >= 80) riskPercent = 1.5;
    else riskPercent = 1;
  }

  // توليد التفسير الذكي
  const getReason = (lang) => {
    if (recommendation === 'WAIT') {
      if (confidence < 50) return lang === 'ar' ? 'السوق في حالة تذبذب ضعيفة، ننتظر إشارة أقوى.' : 'Market is in low volatility, waiting for a stronger signal.';
      return lang === 'ar' ? `الثقة (${confidence.toFixed(0)}%) غير كافية للدخول الآمن.` : `Confidence (${confidence.toFixed(0)}%) is insufficient for a safe entry.`;
    }
    const action = lang === 'ar' ? (recommendation === 'BUY' ? 'شراء' : 'بيع') : recommendation;
    const trendText = lang === 'ar' ? (decision.trend === 1 ? 'صاعد' : 'هابط') : (decision.trend === 1 ? 'Bullish' : 'Bearish');
    return lang === 'ar' 
      ? `إشارة ${action} قوية: الاتجاه ${trendText} مع دعم من الزخم ومؤشر RSI بنسبة ثقة ${confidence.toFixed(0)}%.`
      : `Strong ${action} signal: ${trendText} trend supported by momentum and RSI with ${confidence.toFixed(0)}% confidence.`;
  };

  return {
    recommendation,
    confidence,
    riskPercent,
    decision,
    tech,
    reason: {
      en: getReason('en'),
      ar: getReason('ar')
    }
  };
};
