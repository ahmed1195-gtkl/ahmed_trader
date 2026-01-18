/**
 * محرك القرار المتقدم (Decision Engine) - V8.2
 * استقلالية الإطارات الزمنية، تحديد نوع الحساب، وحدود صفقات ذكية
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

  // منطق ذكي حسب الإطار الزمني (Timeframe)
  let tfMultiplier = 1;
  if (timeframe === '15M') tfMultiplier = 0.5;
  if (timeframe === '4H') tfMultiplier = 2;
  if (timeframe === '1D') tfMultiplier = 4;

  const decision = {
    trend: tech.score > 0 ? 1 : tech.score < 0 ? -1 : 0,
    entryModel: (rsi < 40 || rsi > 60) ? (rsi < 40 ? 1 : -1) : 0,
    momentum: macd.histogram > 0 ? 1 : macd.histogram < 0 ? -1 : 0,
    volume: (currentPrice > bb.upper || currentPrice < bb.lower) ? (currentPrice < bb.lower ? 1 : -1) : 0,
    fundamental: marketStatus === 'Stable' ? 1 : 0,
    multiTF: (tech.score > 0 ? 1 : -1)
  };

  let confidence = 0;
  confidence += Math.abs(decision.trend) * 25;
  confidence += Math.abs(decision.entryModel) * 20;
  confidence += Math.abs(decision.momentum) * 15;
  confidence += Math.abs(decision.volume) * 10;
  confidence += Math.abs(decision.fundamental) * 15;
  confidence += Math.abs(decision.multiTF) * 15;

  confidence = Math.max(0, Math.min(100, confidence));

  let recommendation = 'WAIT';
  if (confidence >= 70) {
    recommendation = tech.score > 0 ? 'BUY' : 'SELL';
  }

  // حدود صفقات ذكية (Smart TP/SL) بناءً على التقلب والبولينجر باند
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const smartSL = volatility * 0.8 * tfMultiplier;
  const smartTP = smartSL * 2.1; // نسبة ربح لمخاطرة ذكية 1:2.1

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // تحديد نوع الحساب المناسب بناءً على المخاطرة والسيولة
  let accountType = "Standard (> $500)";
  let accountTypeAr = "حساب قياسي (أكبر من 500$)";
  
  if (smartSL * 100 > 0.05) { // إذا كان الوقف كبيراً جداً
    accountType = "Pro (> $1000)";
    accountTypeAr = "حساب احترافي (أكبر من 1000$)";
  } else if (smartSL * 100 < 0.02) {
    accountType = "Micro (< $100)";
    accountTypeAr = "حساب ميكرو (أقل من 100$)";
  } else {
    accountType = "Mini ($100 - $500)";
    accountTypeAr = "حساب ميني (100$ - 500$)";
  }

  const getReason = (lang) => {
    if (recommendation === 'WAIT') {
      return lang === 'ar' 
        ? `الإطار الزمني (${timeframe}): الثقة (${confidence.toFixed(0)}%) غير كافية. ننتظر وضوح الاتجاه.`
        : `Timeframe (${timeframe}): Confidence (${confidence.toFixed(0)}%) is insufficient. Waiting for trend clarity.`;
    }
    const action = lang === 'ar' ? (recommendation === 'BUY' ? 'شراء' : 'بيع') : recommendation;
    return lang === 'ar' 
      ? `إطار ${timeframe}: إشارة ${action} ذكية. مناسب لـ ${accountTypeAr}. الثقة: ${confidence.toFixed(0)}%.`
      : `TF ${timeframe}: Smart ${action} signal. Suitable for ${accountType}. Confidence: ${confidence.toFixed(0)}%.`;
  };

  return {
    recommendation,
    confidence,
    levels,
    accountType: { en: accountType, ar: accountTypeAr },
    reason: { en: getReason('en'), ar: getReason('ar') }
  };
};
