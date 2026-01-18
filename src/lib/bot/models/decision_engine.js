/**
 * محرك القرار المتقدم (Decision Engine) - V9.0
 * تفسيرات حية، استقلالية الإطارات الزمنية، وحدود صفقات ذكية
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands } from '../analysis/technical';

export const getDecision = (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset } = data;

  // 1. منع التوصيات أثناء الأخبار (صارم)
  if (marketStatus === 'Danger') {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: `High Impact News detected for ${selectedAsset}. Market volatility is unpredictable. Trading halted for safety.`,
        ar: `تم اكتشاف أخبار عالية التأثير على ${selectedAsset}. تقلبات السوق غير متوقعة حالياً. تم إيقاف التداول لسلامة الحساب.`
      }
    };
  }

  if (!prices || prices.length < 30) {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'Gathering more market data to ensure a high-probability decision.',
        ar: 'جاري جمع المزيد من بيانات السوق لضمان اتخاذ قرار عالي الاحتمالية.'
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
  if (confidence >= 75) {
    recommendation = tech.score > 0 ? 'BUY' : 'SELL';
  }

  // حدود صفقات ذكية (Smart TP/SL)
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const smartSL = volatility * 0.8 * tfMultiplier;
  const smartTP = smartSL * 2.1;

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // تحديد نوع الحساب
  let accountType = "Standard (> $500)";
  let accountTypeAr = "حساب قياسي (أكبر من 500$)";
  if (smartSL * 100 > 0.05) {
    accountType = "Pro (> $1000)";
    accountTypeAr = "حساب احترافي (أكبر من 1000$)";
  } else if (smartSL * 100 < 0.02) {
    accountType = "Micro (< $100)";
    accountTypeAr = "حساب ميكرو (أقل من 100$)";
  } else {
    accountType = "Mini ($100 - $500)";
    accountTypeAr = "حساب ميني (100$ - 500$)";
  }

  const getLiveReason = (lang) => {
    if (recommendation === 'WAIT') {
      if (Math.abs(tech.score) < 2) {
        return lang === 'ar' 
          ? `السوق في حالة تذبذب عرضي على فريم ${timeframe}. ننتظر كسر مستويات السيولة للدخول.`
          : `Market is in sideways consolidation on ${timeframe}. Waiting for liquidity breakout.`;
      }
      if (rsi > 45 && rsi < 55) {
        return lang === 'ar'
          ? `مؤشر القوة النسبية (RSI) محايد عند ${rsi.toFixed(1)}. لا توجد غلبة للمشترين أو البائعين حالياً.`
          : `RSI is neutral at ${rsi.toFixed(1)}. No clear dominance from buyers or sellers yet.`;
      }
      return lang === 'ar'
        ? `إشارات متعارضة بين الاتجاه والزخم. الثقة ${confidence.toFixed(0)}% لا تدعم الدخول الآمن.`
        : `Conflicting signals between trend and momentum. Confidence ${confidence.toFixed(0)}% is too low for a safe entry.`;
    }

    const action = lang === 'ar' ? (recommendation === 'BUY' ? 'شراء' : 'بيع') : recommendation;
    const trendDesc = lang === 'ar' ? (decision.trend > 0 ? 'صاعد قوي' : 'هابط قوي') : (decision.trend > 0 ? 'Strong Bullish' : 'Strong Bearish');
    
    return lang === 'ar'
      ? `تم رصد اتجاه ${trendDesc} على فريم ${timeframe}. الزخم يدعم ال${action} مع ثقة ${confidence.toFixed(0)}%. مناسب لـ ${accountTypeAr}.`
      : `Detected ${trendDesc} trend on ${timeframe}. Momentum supports ${action} with ${confidence.toFixed(0)}% confidence. Best for ${accountType}.`;
  };

  return {
    recommendation,
    confidence,
    levels,
    accountType: { en: accountType, ar: accountTypeAr },
    reason: { en: getLiveReason('en'), ar: getLiveReason('ar') },
    tech: { rsi, volatility: (volatility * 100).toFixed(2) }
  };
};
