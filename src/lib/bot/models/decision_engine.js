/**
 * محرك القرار المتقدم (Decision Engine) - V14.0
 * دمج تحليل المشاعر، البيانات التاريخية، الدعوم والمقاومات الحقيقية، والأخبار
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands, calculateSupportResistance } from '../analysis/technical';
import { analyzeOrderFlow } from '../analysis/orderFlow';

export const getDecision = async (data) => {
  const { prices, marketStatus, timeframe, assetType, selectedAsset, sentiment, news, globalNews } = data;

  if (!prices || prices.length < 15) {
    return { 
      recommendation: 'WAIT', 
      confidence: 0, 
      reason: {
        en: 'Initializing deep market analysis and gathering historical context...',
        ar: 'جاري بدء التحليل العميق للسوق وجمع السياق التاريخي للبيانات...',
        fr: 'Initialisation de l\'analyse approfondie du marché...'
      }
    };
  }

  const currentPrice = prices[prices.length - 1];
  const tech = getTechnicalSignal(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBollingerBands(prices);
  const { support, resistance, supportStrength, resistanceStrength } = calculateSupportResistance(prices);

  // 0. تحليل تدفق الطلبات (Order Flow Analysis)
  const orderFlow = await analyzeOrderFlow(selectedAsset, currentPrice, prices);
  const orderFlowImpact = orderFlow ? (orderFlow.imbalance === 'Bullish Imbalance' ? 15 : orderFlow.imbalance === 'Bearish Imbalance' ? -15 : 0) : 0;

  // 1. دمج تحليل المشاعر (Sentiment Impact)
  const sentimentImpact = sentiment ? sentiment.impact * 20 : 0;

  // 2. دمج تأثير الأخبار العالمية (Global News Impact)
  let newsImpact = 0;
  if (globalNews && globalNews.length > 0) {
    const positiveNews = globalNews.filter(n => n.sentiment === 'Positive').length;
    const negativeNews = globalNews.filter(n => n.sentiment === 'Negative').length;
    newsImpact = (positiveNews - negativeNews) * 5; // كل خبر يؤثر بـ 5 نقاط
  }

  // 3. منطق القرار المطور
  let score = tech.score;
  score += sentimentImpact; 
  score += newsImpact;
  score += orderFlowImpact;

  // 4. حساب الثقة - منطق أكثر مرونة ونشاطاً
  let confidence = Math.abs(score) * 0.9; // زيادة الوزن الأساسي
  const sentimentAgreement = (score > 0 && sentimentImpact > 0) || (score < 0 && sentimentImpact < 0);
  if (sentimentAgreement) confidence += 20; // تعزيز أقوى عند الاتفاق مع المشاعر
  
  // ضبط الثقة بناءً على حالة السوق - أكثر تسامحاً
  if (marketStatus === 'Danger') {
    confidence *= 0.95; // خصم بسيط جداً لعدم منع الصفقات
  } else if (marketStatus === 'Stable') {
    confidence *= 1.2; // تعزيز قوي لتشجيع الصفقات
  }
  
  confidence = Math.max(0, Math.min(100, confidence));

  // 4. تحديد التوصية - وضع نشط ومرن (65% كحد أدنى للثقة)
  let recommendation = 'WAIT';
  const threshold = 65; 
  
  if (confidence >= threshold) {
    recommendation = score > 0 ? 'BUY' : 'SELL';
  }

  // تم إزالة العشوائية - نستخدم decision_engine_v2 الآن

  // 5. إدارة المخاطر
  const volatility = (bb.upper - bb.lower) / currentPrice;
  const tfMultiplier = timeframe === '15M' ? 0.6 : timeframe === '4H' ? 1.8 : timeframe === '1D' ? 3.5 : 1;
  // إدارة مخاطر معتدلة ومتوازنة
  const smartSL = Math.max(volatility * 0.8, 0.0020) * tfMultiplier;
  const smartTP = smartSL * 1.8; // نسبة ربح إلى مخاطرة معتدلة (1:1.8) لضمان استمرارية الأرباح

  const levels = {
    entry: currentPrice,
    tp: recommendation === 'BUY' ? currentPrice * (1 + smartTP) : currentPrice * (1 - smartTP),
    sl: recommendation === 'BUY' ? currentPrice * (1 - smartSL) : currentPrice * (1 + smartSL)
  };

  // 6. تحليل الأخبار القادمة
  const upcomingNews = news && news.length > 0 ? news[0] : null;

  // 7. بناء التفسير التفصيلي لكل لغة
  const getDetailedAnalysis = (lang) => {
    const isAr = lang === 'ar';
    const isFr = lang === 'fr';
    
    let text = "";
    
    // الجزء الأول: الاتجاه والمؤشرات
    if (recommendation === 'WAIT') {
      text += isAr ? "السوق في حالة تذبذب حالياً. " : isFr ? "Le marché est en phase de consolidation. " : "Market is currently consolidating. ";
    } else {
      const action = recommendation === 'BUY' ? (isAr ? "شراء" : isFr ? "ACHAT" : "BUY") : (isAr ? "بيع" : isFr ? "VENTE" : "SELL");
      text += (isAr ? `إشارة ${action} قوية: ` : isFr ? `Signal d'${action} fort : ` : `Strong ${action} signal: `);
      text += tech.reason;
    }

    // الجزء الثاني: المؤشرات الفنية
    text += "\n\n" + (isAr ? "المؤشرات الفنية:" : isFr ? "Indicateurs Techniques :" : "Technical Indicators:");
    text += `\n- RSI: ${rsi.toFixed(2)} (${rsi < 30 ? (isAr ? 'تشبع بيع' : 'Oversold') : rsi > 70 ? (isAr ? 'تشبع شراء' : 'Overbought') : (isAr ? 'متعادل' : 'Neutral')})`;
    text += `\n- MACD: ${macd.histogram > 0 ? (isAr ? 'زخم صعودي' : 'Bullish Momentum') : (isAr ? 'زخم هبوطي' : 'Bearish Momentum')}`;
    
    // الجزء الثالث: الدعوم والمقاومات الحقيقية
    const strengthMap = {
      'Strong': isAr ? 'قوي جداً' : isFr ? 'Très Fort' : 'Very Strong',
      'Medium': isAr ? 'متوسط' : isFr ? 'Moyen' : 'Medium',
      'Weak': isAr ? 'ضعيف' : isFr ? 'Faible' : 'Weak'
    };

    text += "\n\n" + (isAr ? "المستويات الرئيسية الحقيقية:" : isFr ? "Niveaux Clés Réels :" : "Real Key Levels:");
    text += `\n- ${isAr ? 'المقاومة' : 'Resistance'}: ${resistance.toFixed(selectedAsset.includes('JPY') ? 3 : 5)} (${strengthMap[resistanceStrength]})`;
    text += `\n- ${isAr ? 'الدعم' : 'Support'}: ${support.toFixed(selectedAsset.includes('JPY') ? 3 : 5)} (${strengthMap[supportStrength]})`;

    // الجزء الرابع: الأخبار
    if (upcomingNews) {
      text += "\n\n" + (isAr ? "تنبيه الأخبار:" : isFr ? "Alerte Info :" : "News Alert:");
      text += `\n- ${upcomingNews.event} (${upcomingNews.impact})`;
    }

    return text;
  };

  return {
    recommendation,
    confidence,
    levels,
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
      volatility: (volatility * 100).toFixed(2), 
      support, 
      resistance,
      supportStrength,
      resistanceStrength
    },
    orderFlow,
    upcomingNews
  };
};
