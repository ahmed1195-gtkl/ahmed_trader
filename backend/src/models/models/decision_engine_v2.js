/**
 * محرك القرار المتقدم Phoenix Engine V2.0
 * إزالة العشوائية تماماً، رفع حد الثقة، نسبة ربح/مخاطرة ديناميكية
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands, calculateSupportResistance, calculateADX, calculateVolume, calculateFVG, pricesToCandles } from '../analysis/technical.js';

export const getDecisionV2 = (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset, sentiment, news, globalNews } = data;

  if (!prices || prices.length < 30) {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'Gathering sufficient market data for accurate analysis...',
        ar: 'جاري جمع بيانات كافية للسوق لإجراء تحليل دقيق...',
        fr: 'Collecte de données de marché suffisantes pour une analyse précise...'
      }
    };
  }

  const currentPrice = prices[prices.length - 1];
  const tech = getTechnicalSignal(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBollingerBands(prices);
  const { support, resistance, supportStrength, resistanceStrength } = calculateSupportResistance(prices);
  const adx = calculateADX(prices);
  const volumeAnalysis = calculateVolume(prices);

  // === المرحلة 1: التحليل متعدد الأبعاد (7 أبعاد) ===
  
  // البعد 1: الاتجاه (Trend) - وزن 25%
  let trendScore = 0;
  if (tech.trend === 'bullish') trendScore = 25;
  else if (tech.trend === 'bearish') trendScore = -25;
  
  // البعد 2: الزخم (Momentum) - وزن 20%
  let momentumScore = 0;
  if (macd.histogram > 0 && macd.histogram > macd.signal) momentumScore = 20;
  else if (macd.histogram < 0 && macd.histogram < macd.signal) momentumScore = -20;
  else momentumScore = macd.histogram > 0 ? 10 : -10;
  
  // البعد 3: قوة الاتجاه (Trend Strength) - وزن 15%
  let trendStrengthScore = 0;
  if (adx > 25) {
    trendStrengthScore = tech.trend === 'bullish' ? 15 : tech.trend === 'bearish' ? -15 : 0;
  }
  
  // البعد 4: حجم التداول (Volume) - وزن 10%
  let volumeScore = 0;
  if (volumeAnalysis.trend === 'increasing') {
    volumeScore = tech.trend === 'bullish' ? 10 : tech.trend === 'bearish' ? -10 : 0;
  }
  
  // البعد 5: الدعم والمقاومة - وزن 15%
  let srScore = 0;
  const distanceToResistance = (resistance - currentPrice) / currentPrice;
  const distanceToSupport = (currentPrice - support) / currentPrice;
  
  if (distanceToSupport < 0.01 && supportStrength === 'Strong') srScore = 15; // قريب من دعم قوي
  else if (distanceToResistance < 0.01 && resistanceStrength === 'Strong') srScore = -15; // قريب من مقاومة قوية
  
  // البعد 6: RSI - وزن 10%
  let rsiScore = 0;
  if (rsi < 30) rsiScore = 10; // تشبع بيع
  else if (rsi > 70) rsiScore = -10; // تشبع شراء
  else if (rsi > 50 && rsi < 70) rsiScore = 5; // صعودي معتدل
  else if (rsi < 50 && rsi > 30) rsiScore = -5; // هبوطي معتدل
  
  // البعد 7: Bollinger Bands - وزن 5%
  let bbScore = 0;
  if (currentPrice <= bb.lower) bbScore = 5; // عند الحد السفلي
  else if (currentPrice >= bb.upper) bbScore = -5; // عند الحد العلوي

  // البعد 8: Fair Value Gap (FVG) - وزن 10%
  let fvgScore = 0;
  const candles = pricesToCandles(prices);
  const fvg = calculateFVG(candles);
  
  if (fvg.hasFVG) {
    if (fvg.signal === 'buy') {
      fvgScore = fvg.signalStrength; // من 0 إلى 25 حسب القوة
    } else if (fvg.signal === 'sell') {
      fvgScore = -fvg.signalStrength;
    }
  }

  // === المرحلة 2: دمج تحليل المشاعر والأخبار ===
  const sentimentImpact = sentiment ? sentiment.impact * 30 : 0; // زيادة التأثير من 20 إلى 30
  
  let newsImpact = 0;
  if (globalNews && globalNews.length > 0) {
    const positiveNews = globalNews.filter(n => n.sentiment === 'Positive').length;
    const negativeNews = globalNews.filter(n => n.sentiment === 'Negative').length;
    newsImpact = (positiveNews - negativeNews) * 8; // زيادة التأثير من 5 إلى 8
  }

  // === المرحلة 3: حساب النتيجة النهائية ===
  let finalScore = trendScore + momentumScore + trendStrengthScore + volumeScore + srScore + rsiScore + bbScore + fvgScore;
  finalScore += sentimentImpact + newsImpact;

  // === المرحلة 4: حساب الثقة (بدون عشوائية) ===
  let confidence = Math.abs(finalScore) * 0.85; // زيادة الوزن الأساسي
  
  // تعزيز الثقة عند اتفاق المؤشرات
  const agreementBonus = (Math.abs(trendScore) > 15 && Math.abs(momentumScore) > 15 && Math.sign(trendScore) === Math.sign(momentumScore)) ? 15 : 0;
  confidence += agreementBonus;
  
  // تعزيز عند اتفاق المشاعر مع الاتجاه
  const sentimentAgreement = (finalScore > 0 && sentimentImpact > 0) || (finalScore < 0 && sentimentImpact < 0);
  if (sentimentAgreement) confidence += 10;
  
  // تعديل حسب حالة السوق
  if (marketStatus === 'Danger') {
    confidence *= 0.85; // تقليل بسيط
  } else if (marketStatus === 'Stable') {
    confidence *= 1.15; // تعزيز
  }
  
  // تعديل حسب قوة الاتجاه
  if (adx > 40) confidence *= 1.1; // اتجاه قوي جداً
  else if (adx < 20) confidence *= 0.9; // اتجاه ضعيف
  
  confidence = Math.max(0, Math.min(100, confidence));

  // === المرحلة 5: تحديد التوصية (حد أدنى 85%) ===
  let recommendation = 'WAIT';
  const threshold = 85; // رفع الحد من 65 إلى 85
  
  if (confidence >= threshold) {
    recommendation = finalScore > 0 ? 'BUY' : 'SELL';
  }

  // === المرحلة 6: إدارة المخاطر الديناميكية ===
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const tfMultiplier = timeframe === '15M' ? 0.5 : timeframe === '4H' ? 2.0 : timeframe === '1D' ? 4.0 : 1.0;
  
  // حساب وقف الخسارة الذكي
  const baseSL = Math.max(volatility * 0.7, 0.0015) * tfMultiplier;
  const smartSL = adx > 30 ? baseSL * 0.9 : baseSL * 1.1; // تقليل SL في الاتجاهات القوية
  
  // نسبة ربح/مخاطرة ديناميكية (1:2.5 إلى 1:4)
  let rrRatio = 2.5;
  if (adx > 35) rrRatio = 3.5; // اتجاه قوي = هدف أكبر
  if (confidence > 90) rrRatio = 4.0; // ثقة عالية جداً = هدف أكبر
  
  const smartTP = smartSL * rrRatio;

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // === المرحلة 7: تحليل الأخبار القادمة ===
  const upcomingNews = news && news.length > 0 ? news[0] : null;

  // === المرحلة 8: بناء التفسير التفصيلي ===
  const getDetailedAnalysis = (lang) => {
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';
    
    let text = "";
    
    // الجزء الأول: التوصية
    if (recommendation === 'WAIT') {
      text += isAr ? "السوق في حالة تذبذب. ننتظر إشارة أقوى." : isFr ? "Le marché consolide. En attente d'un signal plus fort." : "Market is consolidating. Waiting for stronger signal.";
    } else {
      const action = recommendation === 'BUY' ? (isAr ? "شراء قوية" : isFr ? "ACHAT fort" : "Strong BUY") : (isAr ? "بيع قوية" : isFr ? "VENTE forte" : "Strong SELL");
      text += (isAr ? `إشارة ${action} بناءً على تحليل متعدد الأبعاد: ` : isFr ? `Signal d'${action} basé sur analyse multidimensionnelle : ` : `${action} signal based on multi-dimensional analysis: `);
      text += tech.reason;
    }

    // الجزء الثاني: المؤشرات الفنية
    text += "\n\n" + (isAr ? "📊 المؤشرات الفنية:" : isFr ? "📊 Indicateurs Techniques :" : "📊 Technical Indicators:");
    text += `\n• RSI: ${rsi.toFixed(2)} (${rsi < 30 ? (isAr ? 'تشبع بيع قوي' : 'Strong Oversold') : rsi > 70 ? (isAr ? 'تشبع شراء قوي' : 'Strong Overbought') : (isAr ? 'متعادل' : 'Neutral')})`;
    text += `\n• MACD: ${macd.histogram > 0 ? (isAr ? 'زخم صعودي' : 'Bullish Momentum') : (isAr ? 'زخم هبوطي' : 'Bearish Momentum')}`;
    text += `\n• ADX: ${adx.toFixed(2)} (${adx > 25 ? (isAr ? 'اتجاه قوي' : 'Strong Trend') : (isAr ? 'اتجاه ضعيف' : 'Weak Trend')})`;
    text += `\n• ${isAr ? 'حجم التداول' : 'Volume'}: ${volumeAnalysis.trend === 'increasing' ? (isAr ? 'متزايد ✅' : 'Increasing ✅') : (isAr ? 'متناقص' : 'Decreasing')}`;
    
    // الجزء الثالث: الدعوم والمقاومات
    const strengthMap = {
      'Strong': isAr ? 'قوي جداً 🔥' : isFr ? 'Très Fort 🔥' : 'Very Strong 🔥',
      'Medium': isAr ? 'متوسط' : isFr ? 'Moyen' : 'Medium',
      'Weak': isAr ? 'ضعيف' : isFr ? 'Faible' : 'Weak'
    };

    text += "\n\n" + (isAr ? "🎯 المستويات الحاسمة:" : isFr ? "🎯 Niveaux Clés :" : "🎯 Key Levels:");
    text += `\n• ${isAr ? 'المقاومة' : 'Resistance'}: ${resistance.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)} (${strengthMap[resistanceStrength]})`;
    text += `\n• ${isAr ? 'الدعم' : 'Support'}: ${support.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)} (${strengthMap[supportStrength]})`;

    // الجزء الرابع: نسبة الربح/المخاطرة
    if (recommendation !== 'WAIT') {
      text += "\n\n" + (isAr ? "💰 إدارة المخاطر:" : isFr ? "💰 Gestion des Risques :" : "💰 Risk Management:");
      text += `\n• ${isAr ? 'نسبة الربح/المخاطرة' : 'Risk/Reward'}: 1:${rrRatio.toFixed(1)}`;
      text += `\n• ${isAr ? 'وقف الخسارة' : 'Stop Loss'}: ${levels.sl.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}`;
      text += `\n• ${isAr ? 'جني الأرباح' : 'Take Profit'}: ${levels.tp.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}`;
    }

    // الجزء الخامس: الأخبار
    if (upcomingNews) {
      text += "\n\n" + (isAr ? "⚠️ تنبيه الأخبار:" : isFr ? "⚠️ Alerte Info :" : "⚠️ News Alert:");
      text += `\n• ${upcomingNews.event} (${upcomingNews.impact})`;
    }

    return text;
  };

  return {
    recommendation,
    confidence: Math.round(confidence),
    levels,
    rrRatio: `1:${rrRatio.toFixed(1)}`,
    accountType: { 
      en: smartSL > 0.008 ? "Pro Account" : "Standard Account", 
      ar: smartSL > 0.008 ? "حساب احترافي" : "حساب قياسي",
      fr: smartSL > 0.008 ? "Compte Pro" : "Compte Standard"
    },
    reason: { 
      en: getDetailedAnalysis('en'), 
      ar: getDetailedAnalysis('ar'),
      fr: getDetailedAnalysis('fr')
    },
    tech: { 
      rsi, 
      macd: macd.histogram,
      adx,
      volume: volumeAnalysis.trend,
      volatility: (volatility * 100).toFixed(2), 
      support, 
      resistance,
      supportStrength,
      resistanceStrength
    },
    upcomingNews,
    rawScore: finalScore
  };
};
