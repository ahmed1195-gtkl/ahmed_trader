/**
 * محرك القرار المتقدم (Decision Engine) - V11.0
 * تحسين دقة التوصيات، معالجة تضارب الأسعار، وإدارة ذكية للأخبار
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands, calculateSupportResistance } from '../analysis/technical';

export const getDecision = (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset } = data;

  if (!prices || prices.length < 20) {
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
  const { support, resistance } = calculateSupportResistance(prices);

  // منطق ذكي حسب الإطار الزمني (Timeframe)
  let tfMultiplier = 1;
  if (timeframe === '15M') tfMultiplier = 0.5;
  if (timeframe === '4H') tfMultiplier = 2;
  if (timeframe === '1D') tfMultiplier = 4;

  const decision = {
    trend: tech.score > 0 ? 1 : tech.score < 0 ? -1 : 0,
    entryModel: (rsi < 35 || rsi > 65) ? (rsi < 35 ? 1 : -1) : 0,
    momentum: macd.histogram > 0 ? 1 : macd.histogram < 0 ? -1 : 0,
    volume: (currentPrice > bb.upper || currentPrice < bb.lower) ? (currentPrice < bb.lower ? 1 : -1) : 0,
    fundamental: marketStatus === 'Stable' ? 1 : -0.5, // تقليل الثقة عند وجود خطر بدلاً من الإيقاف
    multiTF: (tech.score > 0 ? 1 : -1)
  };

  let confidence = 0;
  confidence += Math.abs(decision.trend) * 25;
  confidence += Math.abs(decision.entryModel) * 20;
  confidence += Math.abs(decision.momentum) * 15;
  confidence += Math.abs(decision.volume) * 10;
  confidence += Math.abs(decision.fundamental) * 15;
  confidence += Math.abs(decision.multiTF) * 15;

  // خفض الثقة إذا كان هناك خطر أخبار ولكن لا نعطل البوت
  if (marketStatus === 'Danger') {
    confidence *= 0.6; 
  }

  confidence = Math.max(0, Math.min(100, confidence));

  let recommendation = 'WAIT';
  // رفع حد الثقة المطلوب عند وجود خطر أخبار
  const requiredConfidence = marketStatus === 'Danger' ? 85 : 75;
  
  if (confidence >= requiredConfidence) {
    recommendation = tech.score > 0 ? 'BUY' : 'SELL';
  }

  // حدود صفقات ذكية (Smart TP/SL) - معالجة تضارب الأسعار
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const baseRisk = Math.max(volatility * 0.5, 0.002); // حد أدنى للمخاطرة
  const smartSL = baseRisk * tfMultiplier;
  const smartTP = smartSL * 2.0; // نسبة عائد للمخاطرة 1:2

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // تحديد نوع الحساب
  let accountType = "Standard (> $500)";
  let accountTypeAr = "حساب قياسي (أكبر من 500$)";
  if (smartSL > 0.01) {
    accountType = "Pro (> $1000)";
    accountTypeAr = "حساب احترافي (أكبر من 1000$)";
  } else if (smartSL < 0.003) {
    accountType = "Micro (< $100)";
    accountTypeAr = "حساب ميكرو (أقل من 100$)";
  } else {
    accountType = "Mini ($100 - $500)";
    accountTypeAr = "حساب ميني (100$ - 500$)";
  }

  const getLiveReason = (lang) => {
    const precision = selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5;
    const supStr = support.toFixed(precision);
    const resStr = resistance.toFixed(precision);

    if (marketStatus === 'Danger' && recommendation === 'WAIT') {
      return lang === 'ar'
        ? `تنبيه: أخبار عالية التأثير مكتشفة. نفضل الانتظار رغم وجود إشارات فنية لحماية رأس المال.`
        : `Warning: High impact news detected. Prefer waiting despite technical signals to protect capital.`;
    }

    if (recommendation === 'WAIT') {
      if (Math.abs(tech.score) < 10) {
        return lang === 'ar' 
          ? `السوق في حالة تذبذب عرضي بين ${supStr} و ${resStr}. ننتظر اتجاه أوضح.`
          : `Market in sideways consolidation between ${supStr} and ${resStr}. Waiting for clearer trend.`;
      }
      return lang === 'ar'
        ? `إشارات غير مكتملة. الثقة ${confidence.toFixed(0)}% أقل من الحد المطلوب (${requiredConfidence}%).`
        : `Incomplete signals. Confidence ${confidence.toFixed(0)}% is below required threshold (${requiredConfidence}%).`;
    }

    const zone = recommendation === 'BUY' ? (lang === 'ar' ? 'الدعم' : 'Support') : (lang === 'ar' ? 'المقاومة' : 'Resistance');
    const level = recommendation === 'BUY' ? supStr : resStr;
    
    let newsWarning = marketStatus === 'Danger' ? (lang === 'ar' ? " (تحذير: تقلبات أخبار)" : " (News Volatility Warning)") : "";

    return lang === 'ar'
      ? `إشارة ${recommendation === 'BUY' ? 'شراء' : 'بيع'} قوية بعد ارتداد من ${zone} عند ${level}${newsWarning}. الثقة ${confidence.toFixed(0)}%.`
      : `Strong ${recommendation} signal after bounce from ${zone} at ${level}${newsWarning}. Confidence ${confidence.toFixed(0)}%.`;
  };

  return {
    recommendation,
    confidence,
    levels,
    accountType: { en: accountType, ar: accountTypeAr },
    reason: { en: getLiveReason('en'), ar: getLiveReason('ar') },
    tech: { rsi, volatility: (volatility * 100).toFixed(2), support, resistance }
  };
};
