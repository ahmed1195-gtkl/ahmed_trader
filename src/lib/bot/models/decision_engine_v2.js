/**
 * محرك القرار المتقدم Phoenix Engine V2.0 (نسخة الذكاء الاصطناعي التكيفي المعزز)
 * يدمج أوزان التعلم المعزز ديناميكياً ويطبق سلوك تفكير تكيّفي مع تقلبات السوق ونمط الحركة
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands, calculateSupportResistance, calculateADX, calculateVolume, calculateFVG, pricesToCandles } from '../analysis/technical';

export const getDecisionV2 = (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset, sentiment, news, globalNews, rlWeights } = data;

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

  // === المرحلة 1: التحليل متعدد الأبعاد المدمج مع أوزان التعلم المعزز ===
  const weights = rlWeights || {
    rsi: 0.15,
    macd: 0.20,
    trend: 0.25,
    volume: 0.10,
    adx: 0.15,
    sentiment: 0.10,
    news: 0.05
  };

  // البعد 1: الاتجاه (Trend) - وزن أساسي 25%
  let trendScore = 0;
  if (tech.trend === 'bullish') trendScore = 25;
  else if (tech.trend === 'bearish') trendScore = -25;
  trendScore *= (weights.trend / 0.25); // تعديل ديناميكي
  
  // البعد 2: الزخم (Momentum) - وزن أساسي 20%
  let momentumScore = 0;
  if (macd.histogram > 0 && macd.histogram > macd.signal) momentumScore = 20;
  else if (macd.histogram < 0 && macd.histogram < macd.signal) momentumScore = -20;
  else momentumScore = macd.histogram > 0 ? 10 : -10;
  momentumScore *= (weights.macd / 0.20); // تعديل ديناميكي
  
  // البعد 3: قوة الاتجاه (Trend Strength) - وزن أساسي 15%
  let trendStrengthScore = 0;
  if (adx > 25) {
    trendStrengthScore = tech.trend === 'bullish' ? 15 : tech.trend === 'bearish' ? -15 : 0;
  }
  trendStrengthScore *= (weights.adx / 0.15); // تعديل ديناميكي
  
  // البعد 4: حجم التداول (Volume) - وزن أساسي 10%
  let volumeScore = 0;
  if (volumeAnalysis.trend === 'increasing') {
    volumeScore = tech.trend === 'bullish' ? 10 : tech.trend === 'bearish' ? -10 : 0;
  }
  volumeScore *= (weights.volume / 0.10); // تعديل ديناميكي
  
  // البعد 5: الدعم والمقاومة - وزن أساسي 15%
  let srScore = 0;
  const distanceToResistance = (resistance - currentPrice) / currentPrice;
  const distanceToSupport = (currentPrice - support) / currentPrice;
  
  if (distanceToSupport < 0.01 && supportStrength === 'Strong') srScore = 15;
  else if (distanceToResistance < 0.01 && resistanceStrength === 'Strong') srScore = -15;
  
  // البعد 6: RSI - وزن أساسي 15% (المعرّف في المنظومة بـ 15)
  let rsiScore = 0;
  if (rsi < 30) rsiScore = 10;
  else if (rsi > 70) rsiScore = -10;
  else if (rsi > 50 && rsi < 70) rsiScore = 5;
  else if (rsi < 50 && rsi > 30) rsiScore = -5;
  rsiScore *= (weights.rsi / 0.15); // تعديل ديناميكي
  
  // البعد 7: Bollinger Bands - وزن أساسي 5%
  let bbScore = 0;
  if (currentPrice <= bb.lower) bbScore = 5;
  else if (currentPrice >= bb.upper) bbScore = -5;

  // البعد 8: Fair Value Gap (FVG) - وزن أساسي 10%
  let fvgScore = 0;
  const candles = pricesToCandles(prices);
  const fvg = calculateFVG(candles);
  
  if (fvg.hasFVG) {
    if (fvg.signal === 'buy') {
      fvgScore = fvg.signalStrength;
    } else if (fvg.signal === 'sell') {
      fvgScore = -fvg.signalStrength;
    }
  }

  // === المرحلة 2: دمج تحليل المشاعر والأخبار الموزونة ===
  let sentimentImpact = sentiment ? sentiment.impact * 30 : 0;
  sentimentImpact *= (weights.sentiment / 0.10); // تعديل ديناميكي
  
  let newsImpact = 0;
  if (globalNews && globalNews.length > 0) {
    const positiveNews = globalNews.filter(n => n.sentiment === 'Positive').length;
    const negativeNews = globalNews.filter(n => n.sentiment === 'Negative').length;
    newsImpact = (positiveNews - negativeNews) * 8;
  }
  newsImpact *= (weights.news / 0.05); // تعديل ديناميكي

  // === المرحلة 3: حساب النتيجة النهائية ===
  let finalScore = trendScore + momentumScore + trendStrengthScore + volumeScore + srScore + rsiScore + bbScore + fvgScore;
  finalScore += sentimentImpact + newsImpact;

  // === المرحلة 4: حساب الثقة وعوامل القوة ===
  let confidence = Math.abs(finalScore) * 0.85;
  
  const agreementBonus = (Math.abs(trendScore) > 12 && Math.abs(momentumScore) > 12 && Math.sign(trendScore) === Math.sign(momentumScore)) ? 15 : 0;
  confidence += agreementBonus;
  
  const sentimentAgreement = (finalScore > 0 && sentimentImpact > 0) || (finalScore < 0 && sentimentImpact < 0);
  if (sentimentAgreement) confidence += 10;
  
  if (marketStatus === 'Danger') {
    confidence *= 0.85;
  } else if (marketStatus === 'Stable') {
    confidence *= 1.15;
  }
  
  if (adx > 40) confidence *= 1.1;
  else if (adx < 20) confidence *= 0.9;
  
  confidence = Math.max(0, Math.min(100, confidence));

  // === المرحلة 5: سلوك التفكير التكيفي مع حالة السوق (Market Regime-Adaptive Thinking) ===
  let recommendation = 'WAIT';
  
  // حد ثقة متغيّر ديناميكياً لتجنب شلل القرار ورفع الكفاءة
  let threshold = 74; 
  if (adx > 28) {
    threshold = 68; // اتجاه قوي وواضح: ندخل بمرونة أعلى ونتبع الزخم
  } else if (adx < 18) {
    threshold = 78; // سوق عرضي: نرفع الحذر لتجنب الاختراقات الكاذبة
  }
  
  if (marketStatus === 'Danger') {
    threshold = 85; // حالة خطر/تقلب كبير: متحفظ جداً
  }
  
  if (confidence >= threshold) {
    recommendation = finalScore > 0 ? 'BUY' : 'SELL';
  }

  // === المرحلة 6: إدارة المخاطر الديناميكية ===
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const tfMultiplier = timeframe === '15M' ? 0.5 : timeframe === '4H' ? 2.0 : timeframe === '1D' ? 4.0 : 1.0;
  
  const baseSL = Math.max(volatility * 0.7, 0.0015) * tfMultiplier;
  const smartSL = adx > 30 ? baseSL * 0.9 : baseSL * 1.1;
  
  let rrRatio = 2.5;
  if (adx > 35) rrRatio = 3.5;
  if (confidence > 90) rrRatio = 4.0;
  
  const smartTP = smartSL * rrRatio;

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  const upcomingNews = news && news.length > 0 ? news[0] : null;

  // === المرحلة 7: بناء التفسير التفصيلي للأداء وسلوك اتخاذ القرار ===
  const getDetailedAnalysis = (lang) => {
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';
    
    let text = "";
    
    if (recommendation === 'WAIT') {
      text += isAr ? "تحليل اتخاذ القرار الذكي: السوق مستقر حالياً وضمن النطاق المتوقع، ننتظر كسر مستويات الدعم/المقاومة أو حدوث زخم سيولة كافٍ لتوفير نقطة دخول مثالية ونسبة مخاطرة ممتازة." 
           : isFr ? "Analyse décisionnelle : Le marché consolide. En attente d'une cassure de niveau clé ou d'un afflux de liquidités pour un meilleur ratio risque/rendement." 
           : "Decision analysis: Market is consolidating within normal parameters. Awaiting support/resistance breakout or higher volume to secure a premium risk/reward entry point.";
    } else {
      const action = recommendation === 'BUY' ? (isAr ? "شراء قوية (تجميع مؤسسي)" : isFr ? "ACHAT fort" : "Strong BUY") : (isAr ? "بيع قوية (تصريف كميات)" : isFr ? "VENTE forte" : "Strong SELL");
      text += (isAr ? `إشارة ${action} معتمدة من محرك القرار التكيفي: ` : isFr ? `Signal d'${action} validé par le moteur décisionnel : ` : `${action} signal approved by the adaptive decision engine: `);
      text += tech.reason || (isAr ? "توافق المؤشرات الفنية والزخم مع الاتجاه العام." : "Technical indicators and momentum align perfectly with the primary trend.");
    }

    text += "\n\n" + (isAr ? "📊 المؤشرات الفنية والتحليل التكيفي:" : isFr ? "📊 Indicateurs Techniques :" : "📊 Technical Indicators & Adaptive Weighting:");
    text += `\n• RSI: ${rsi.toFixed(2)} (${rsi < 30 ? (isAr ? 'تشبع بيع حاد' : 'Oversold') : rsi > 70 ? (isAr ? 'تشبع شراء حاد' : 'Overbought') : (isAr ? 'معتدل' : 'Neutral')}) [الوزن: ${(weights.rsi * 100).toFixed(0)}%]`;
    text += `\n• MACD: ${macd.histogram > 0 ? (isAr ? 'زخم صاعد' : 'Bullish momentum') : (isAr ? 'زخم هابط' : 'Bearish momentum')} [الوزن: ${(weights.macd * 100).toFixed(0)}%]`;
    text += `\n• ADX (قوة الاتجاه): ${adx.toFixed(2)} (${adx > 25 ? (isAr ? 'اتجاه قوي ونشط' : 'Strong active trend') : (isAr ? 'تذبذب أفقي' : 'Weak or ranging trend')}) [الوزن: ${(weights.adx * 100).toFixed(0)}%]`;
    text += `\n• ${isAr ? 'حجم التداول' : 'Volume Flow'}: ${volumeAnalysis.trend === 'increasing' ? (isAr ? 'سيولة متزايدة ودخول حيتان' : 'Increasing volume') : (isAr ? 'سيولة منخفضة' : 'Decreasing volume')} [الوزن: ${(weights.volume * 100).toFixed(0)}%]`;
    
    const strengthMap = {
      'Strong': isAr ? 'قوي وجدار سيولة صلب' : isFr ? 'Très Fort' : 'Strong liquidity pool',
      'Medium': isAr ? 'متوسط الأهمية' : isFr ? 'Moyen' : 'Medium',
      'Weak': isAr ? 'ضعيف وهش' : isFr ? 'Faible' : 'Weak'
    };

    text += "\n\n" + (isAr ? "🎯 مستويات هيكل السوق الحالية:" : isFr ? "🎯 Niveaux Clés de Structure :" : "🎯 Current Market Structure Levels:");
    text += `\n• ${isAr ? 'المقاومة الكلية' : 'Major Resistance'}: ${resistance.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)} (${strengthMap[resistanceStrength] || resistanceStrength})`;
    text += `\n• ${isAr ? 'الدعم الكلي' : 'Major Support'}: ${support.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)} (${strengthMap[supportStrength] || supportStrength})`;

    if (recommendation !== 'WAIT') {
      text += "\n\n" + (isAr ? "💰 حاسبة إدارة المخاطر الدقيقة:" : isFr ? "💰 Gestion du Risque :" : "💰 Precision Risk Management Matrix:");
      text += `\n• ${isAr ? 'نسبة العائد للمخاطرة' : 'Risk/Reward ratio'}: 1:${rrRatio.toFixed(1)}`;
      text += `\n• ${isAr ? 'سعر الدخول المقترح' : 'Entry Price'}: ${levels.entry.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}`;
      text += `\n• ${isAr ? 'وقف الخسارة الذكي (SL)' : 'Stop Loss (SL)'}: ${levels.sl.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}`;
      text += `\n• ${isAr ? 'جني الأرباح المستهدف (TP)' : 'Take Profit (TP)'}: ${levels.tp.toFixed(selectedAsset.includes('JPY') || selectedAsset.includes('XAU') ? 2 : 5)}`;
    }

    if (upcomingNews) {
      text += "\n\n" + (isAr ? "🚨 تقرير التحليل الإخباري:" : isFr ? "🚨 Analyse de l'Actualité :" : "🚨 News & Fundamental Assessment:");
      text += `\n• ${upcomingNews.event} (${upcomingNews.currency} - ${upcomingNews.impact}) [الوزن: ${(weights.news * 100).toFixed(0)}%]`;
    }

    return text;
  };

  // تجميع وتعبئة النتائج بالتفصيل لتغذية لوحة المحلل الذكي في الواجهة ومنع الأشرطة الصفرية الفارغة
  const scores = {
    trend: Math.max(0, Math.min(25, Math.round(Math.abs(trendScore)))),
    momentum: Math.max(0, Math.min(20, Math.round(Math.abs(momentumScore)))),
    trendStrength: Math.max(0, Math.min(15, Math.round(Math.abs(trendStrengthScore)))),
    volume: Math.max(0, Math.min(10, Math.round(Math.abs(volumeScore)))),
    rsi: Math.max(0, Math.min(10, Math.round(Math.abs(rsiScore)))),
    bb: Math.max(0, Math.min(5, Math.round(Math.abs(bbScore)))),
    fvg: Math.max(0, Math.min(25, Math.round(Math.abs(fvgScore)))),
    news: Math.max(0, Math.min(30, Math.round(Math.abs(sentimentImpact + newsImpact))))
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
    rawScore: finalScore,
    scores
  };
};
