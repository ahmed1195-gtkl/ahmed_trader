/**
 * نظام ربط تحليل المشاعر بحركة السعر
 * يحلل تأثير الأخبار على حركة السعر الفعلية
 * 
 * الميزات:
 * - تحليل المشاعر المتقدم
 * - حساب درجة الثقة (Confidence Score)
 * - توقع اتجاه السعر (Price Direction Prediction)
 * - حساب نسبة التأثير (Impact Ratio)
 */

/**
 * تحليل العلاقة بين المشاعر وحركة السعر
 */
export async function analyzeSentimentPriceCorrelation(news, currentPrice, historicalPrices) {
  try {
    // حساب درجة المشاعر العامة
    const sentimentScore = calculateOverallSentiment(news);
    
    // حساب اتجاه السعر التاريخي
    const priceDirection = calculatePriceDirection(historicalPrices);
    
    // حساب معامل الارتباط
    const correlation = calculateCorrelation(sentimentScore, priceDirection);
    
    // توقع اتجاه السعر
    const prediction = predictPriceDirection(sentimentScore, correlation, currentPrice);
    
    // حساب درجة الثقة
    const confidence = calculateConfidenceScore(correlation, news.length);
    
    return {
      sentimentScore,        // درجة المشاعر (-100 إلى +100)
      priceDirection,        // اتجاه السعر (up, down, neutral)
      correlation,           // معامل الارتباط (-1 إلى +1)
      prediction: {
        direction: prediction.direction,      // توقع الاتجاه
        targetPrice: prediction.targetPrice,  // السعر المتوقع
        confidence: confidence,               // درجة الثقة
        timeframe: '4h'                       // الإطار الزمني
      },
      analysis: {
        bullishNews: news.filter(n => n.sentiment === 'Positive').length,
        bearishNews: news.filter(n => n.sentiment === 'Negative').length,
        neutralNews: news.filter(n => n.sentiment === 'Neutral').length,
        highImpactNews: news.filter(n => n.impact === 'High').length
      },
      recommendation: generateRecommendation(prediction, confidence, sentimentScore)
    };
  } catch (error) {
    console.error('Error in sentiment-price correlation analysis:', error);
    return null;
  }
}

/**
 * حساب درجة المشاعر العامة
 */
function calculateOverallSentiment(news) {
  if (!news || news.length === 0) return 0;

  let totalScore = 0;
  let weightedScore = 0;
  let totalWeight = 0;

  news.forEach(item => {
    // تحديد درجة المشاعر الأساسية
    let sentimentValue = 0;
    if (item.sentiment === 'Positive') sentimentValue = 1;
    else if (item.sentiment === 'Negative') sentimentValue = -1;
    else sentimentValue = 0;

    // تحديد الوزن بناءً على التأثير
    let weight = 1;
    if (item.impact === 'High') weight = 3;
    else if (item.impact === 'Medium') weight = 2;
    else weight = 1;

    // حساب الدرجة المرجحة
    weightedScore += sentimentValue * weight;
    totalWeight += weight;
    totalScore += sentimentValue;
  });

  // تطبيع الدرجة إلى نطاق -100 إلى +100
  const normalizedScore = (weightedScore / totalWeight) * 100;
  return Math.round(normalizedScore);
}

/**
 * حساب اتجاه السعر من البيانات التاريخية
 */
function calculatePriceDirection(prices) {
  if (!prices || prices.length < 2) return 'neutral';

  const recentPrices = prices.slice(-20); // آخر 20 سعر
  const oldPrice = recentPrices[0];
  const newPrice = recentPrices[recentPrices.length - 1];

  const change = ((newPrice - oldPrice) / oldPrice) * 100;

  if (change > 2) return 'up';
  if (change < -2) return 'down';
  return 'neutral';
}

/**
 * حساب معامل الارتباط بين المشاعر وحركة السعر
 */
function calculateCorrelation(sentimentScore, priceDirection) {
  // تحويل اتجاه السعر إلى قيمة رقمية
  let priceValue = 0;
  if (priceDirection === 'up') priceValue = 1;
  else if (priceDirection === 'down') priceValue = -1;
  else priceValue = 0;

  // حساب الارتباط
  const sentimentNormalized = sentimentScore / 100;
  const correlation = (sentimentNormalized + priceValue) / 2;

  return Math.max(-1, Math.min(1, correlation));
}

/**
 * توقع اتجاه السعر
 */
function predictPriceDirection(sentimentScore, correlation, currentPrice) {
  let direction = 'neutral';
  let targetPrice = currentPrice;
  let priceChange = 0;

  // تحديد الاتجاه بناءً على درجة المشاعر والارتباط
  if (sentimentScore > 30 && correlation > 0.3) {
    direction = 'bullish';
    priceChange = 2; // توقع ارتفاع بنسبة 2%
  } else if (sentimentScore < -30 && correlation < -0.3) {
    direction = 'bearish';
    priceChange = -2; // توقع انخفاض بنسبة 2%
  } else if (sentimentScore > 50 && correlation > 0.5) {
    direction = 'strongly_bullish';
    priceChange = 4; // توقع ارتفاع بنسبة 4%
  } else if (sentimentScore < -50 && correlation < -0.5) {
    direction = 'strongly_bearish';
    priceChange = -4; // توقع انخفاض بنسبة 4%
  }

  targetPrice = currentPrice * (1 + priceChange / 100);

  return {
    direction,
    targetPrice: Math.round(targetPrice * 100) / 100,
    priceChange
  };
}

/**
 * حساب درجة الثقة
 */
function calculateConfidenceScore(correlation, newsCount) {
  // معامل الارتباط يؤثر على الثقة
  const correlationConfidence = Math.abs(correlation) * 100;

  // عدد الأخبار يؤثر على الثقة
  let newsConfidence = Math.min(newsCount * 5, 50); // حد أقصى 50

  // الدرجة النهائية
  const confidence = Math.round((correlationConfidence * 0.6 + newsConfidence * 0.4));

  return Math.max(0, Math.min(100, confidence));
}

/**
 * توليد التوصيات
 */
function generateRecommendation(prediction, confidence, sentimentScore) {
  const recommendations = [];

  // توصيات بناءً على الاتجاه المتوقع
  if (prediction.direction === 'strongly_bullish') {
    recommendations.push({
      action: 'BUY',
      strength: 'STRONG',
      reason: 'Strong positive sentiment with high correlation',
      targetPrice: prediction.targetPrice,
      stopLoss: prediction.targetPrice * 0.98
    });
  } else if (prediction.direction === 'bullish') {
    recommendations.push({
      action: 'BUY',
      strength: 'MODERATE',
      reason: 'Positive sentiment detected',
      targetPrice: prediction.targetPrice,
      stopLoss: prediction.targetPrice * 0.99
    });
  } else if (prediction.direction === 'strongly_bearish') {
    recommendations.push({
      action: 'SELL',
      strength: 'STRONG',
      reason: 'Strong negative sentiment with high correlation',
      targetPrice: prediction.targetPrice,
      stopLoss: prediction.targetPrice * 1.02
    });
  } else if (prediction.direction === 'bearish') {
    recommendations.push({
      action: 'SELL',
      strength: 'MODERATE',
      reason: 'Negative sentiment detected',
      targetPrice: prediction.targetPrice,
      stopLoss: prediction.targetPrice * 1.01
    });
  } else {
    recommendations.push({
      action: 'HOLD',
      strength: 'NEUTRAL',
      reason: 'Mixed sentiment, no clear direction',
      targetPrice: prediction.targetPrice,
      stopLoss: null
    });
  }

  // إضافة تحذير إذا كانت الثقة منخفضة
  if (confidence < 40) {
    recommendations[0].warning = 'Low confidence score - trade with caution';
  }

  return recommendations[0];
}

/**
 * تحليل تأثير الأخبار الفردية
 */
export function analyzeIndividualNewsImpact(newsItem, currentPrice) {
  // حساب تأثير الخبر الفردي
  const impactMultiplier = newsItem.impact === 'High' ? 1.5 : newsItem.impact === 'Medium' ? 1.0 : 0.5;
  
  // حساب التغيير المتوقع في السعر
  let expectedChange = 0;
  if (newsItem.sentiment === 'Positive') {
    expectedChange = 1.5 * impactMultiplier;
  } else if (newsItem.sentiment === 'Negative') {
    expectedChange = -1.5 * impactMultiplier;
  }

  return {
    newsTitle: newsItem.title,
    sentiment: newsItem.sentiment,
    impact: newsItem.impact,
    expectedPriceChange: expectedChange,
    expectedTargetPrice: currentPrice * (1 + expectedChange / 100),
    timeToImpact: '15-60 minutes', // الوقت المتوقع لتأثر السعر
    reliability: calculateNewsReliability(newsItem)
  };
}

/**
 * حساب موثوقية الخبر
 */
function calculateNewsReliability(newsItem) {
  let reliability = 50; // النقطة الأساسية

  // مصادر موثوقة
  const trustedSources = ['Reuters', 'Bloomberg', 'CNBC', 'CoinDesk', 'The Block', 'Alpha Vantage'];
  if (trustedSources.some(source => newsItem.source.includes(source))) {
    reliability += 25;
  }

  // الأخبار ذات التأثير العالي أكثر موثوقية
  if (newsItem.impact === 'High') {
    reliability += 15;
  }

  // الأخبار الحديثة أكثر موثوقية
  const newsAge = Date.now() - new Date(newsItem.publishedAt).getTime();
  if (newsAge < 60 * 60 * 1000) { // أقل من ساعة
    reliability += 10;
  }

  return Math.min(100, reliability);
}

/**
 * حساب نسبة التأثير (Impact Ratio)
 */
export function calculateImpactRatio(news) {
  if (!news || news.length === 0) return { high: 0, medium: 0, low: 0 };

  const total = news.length;
  const high = news.filter(n => n.impact === 'High').length;
  const medium = news.filter(n => n.impact === 'Medium').length;
  const low = news.filter(n => n.impact === 'Low').length;

  return {
    high: Math.round((high / total) * 100),
    medium: Math.round((medium / total) * 100),
    low: Math.round((low / total) * 100),
    total
  };
}

/**
 * توليد تقرير تحليل المشاعر
 */
export function generateSentimentReport(news, currentPrice, historicalPrices) {
  const correlation = analyzeSentimentPriceCorrelation(news, currentPrice, historicalPrices);
  const impactRatio = calculateImpactRatio(news);

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalNews: news.length,
      sentimentScore: correlation.sentimentScore,
      confidence: correlation.prediction.confidence,
      recommendation: correlation.recommendation.action
    },
    breakdown: {
      bullish: correlation.analysis.bullishNews,
      bearish: correlation.analysis.bearishNews,
      neutral: correlation.analysis.neutralNews,
      highImpact: correlation.analysis.highImpactNews
    },
    impactDistribution: impactRatio,
    prediction: correlation.prediction,
    topNews: news
      .filter(n => n.impact === 'High')
      .slice(0, 5)
      .map(n => ({
        title: n.title,
        sentiment: n.sentiment,
        source: n.source,
        url: n.url
      }))
  };
}
