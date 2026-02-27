/**
 * نظام إدارة المخاطر المتقدم V2.0
 * Dynamic Position Sizing, Trailing Stop, Auto Break-Even, Partial TP
 */

/**
 * حساب حجم الصفقة الديناميكي
 * @param {number} accountBalance - رصيد الحساب
 * @param {number} riskPercent - نسبة المخاطرة (1-5%)
 * @param {number} entryPrice - سعر الدخول
 * @param {number} stopLoss - وقف الخسارة
 * @param {number} leverage - الرافعة المالية
 * @returns {number} - حجم الصفقة بالـ Lots
 */
export const calculateDynamicPositionSize = (
  accountBalance,
  riskPercent = 2,
  entryPrice,
  stopLoss,
  leverage = 1
) => {
  // حساب المبلغ المعرض للخطر
  const riskAmount = accountBalance * (riskPercent / 100);

  // حساب المسافة بين الدخول ووقف الخسارة (بالنقاط)
  const stopDistance = Math.abs(entryPrice - stopLoss);
  const stopDistancePercent = stopDistance / entryPrice;

  // حساب حجم الصفقة
  const positionValue = riskAmount / stopDistancePercent;
  const positionSize = (positionValue / entryPrice) * leverage;

  // تحديد الحد الأدنى والأقصى
  const minSize = 0.01;
  const maxSize = accountBalance * 0.1 / entryPrice; // لا يتجاوز 10% من الحساب

  return Math.max(minSize, Math.min(maxSize, positionSize));
};

/**
 * حساب Trailing Stop Loss
 * @param {string} tradeType - 'BUY' or 'SELL'
 * @param {number} entryPrice - سعر الدخول
 * @param {number} currentPrice - السعر الحالي
 * @param {number} initialSL - وقف الخسارة الأولي
 * @param {number} trailDistance - مسافة التتبع (نسبة مئوية)
 * @returns {number} - وقف الخسارة المتحرك الجديد
 */
export const calculateTrailingStop = (
  tradeType,
  entryPrice,
  currentPrice,
  initialSL,
  trailDistance = 0.005 // 0.5% افتراضياً
) => {
  if (tradeType === 'BUY') {
    // للشراء: نرفع SL فقط إذا كان السعر يرتفع
    const profitPercent = (currentPrice - entryPrice) / entryPrice;
    
    if (profitPercent > trailDistance * 2) {
      // بدأ الربح، نبدأ التتبع
      const newSL = currentPrice * (1 - trailDistance);
      return Math.max(initialSL, newSL);
    }
  } else {
    // للبيع: نخفض SL فقط إذا كان السعر ينخفض
    const profitPercent = (entryPrice - currentPrice) / entryPrice;
    
    if (profitPercent > trailDistance * 2) {
      const newSL = currentPrice * (1 + trailDistance);
      return Math.min(initialSL, newSL);
    }
  }

  return initialSL;
};

/**
 * تحديد متى ننقل SL إلى Break-Even
 * @param {string} tradeType - 'BUY' or 'SELL'
 * @param {number} entryPrice - سعر الدخول
 * @param {number} currentPrice - السعر الحالي
 * @param {number} takeProfit - جني الأرباح
 * @param {number} breakEvenTrigger - نسبة الربح لتفعيل Break-Even (افتراضي 30%)
 * @returns {number|null} - SL الجديد أو null
 */
export const calculateBreakEven = (
  tradeType,
  entryPrice,
  currentPrice,
  takeProfit,
  breakEvenTrigger = 0.3
) => {
  const tpDistance = Math.abs(takeProfit - entryPrice);
  const currentDistance = Math.abs(currentPrice - entryPrice);
  const progressPercent = currentDistance / tpDistance;

  if (progressPercent >= breakEvenTrigger) {
    // وصلنا لـ 30% من الطريق إلى TP، ننقل SL لـ Break-Even
    return entryPrice;
  }

  return null;
};

/**
 * حساب مستويات جني الأرباح الجزئي
 * @param {string} tradeType - 'BUY' or 'SELL'
 * @param {number} entryPrice - سعر الدخول
 * @param {number} finalTP - جني الأرباح النهائي
 * @param {number} levels - عدد المستويات (2-4)
 * @returns {Array} - مصفوفة من مستويات TP مع النسب المئوية
 */
export const calculatePartialTakeProfits = (
  tradeType,
  entryPrice,
  finalTP,
  levels = 3
) => {
  const distance = Math.abs(finalTP - entryPrice);
  const partialTPs = [];

  if (levels === 2) {
    // مستويين: 50% و 100%
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.5 
        : entryPrice - distance * 0.5,
      percent: 50,
      closePercent: 50 // نغلق 50% من الصفقة
    });
    partialTPs.push({
      price: finalTP,
      percent: 100,
      closePercent: 50 // نغلق الـ 50% المتبقية
    });
  } else if (levels === 3) {
    // ثلاث مستويات: 33%, 66%, 100%
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.33 
        : entryPrice - distance * 0.33,
      percent: 33,
      closePercent: 30
    });
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.66 
        : entryPrice - distance * 0.66,
      percent: 66,
      closePercent: 40
    });
    partialTPs.push({
      price: finalTP,
      percent: 100,
      closePercent: 30
    });
  } else if (levels === 4) {
    // أربع مستويات: 25%, 50%, 75%, 100%
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.25 
        : entryPrice - distance * 0.25,
      percent: 25,
      closePercent: 25
    });
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.50 
        : entryPrice - distance * 0.50,
      percent: 50,
      closePercent: 25
    });
    partialTPs.push({
      price: tradeType === 'BUY' 
        ? entryPrice + distance * 0.75 
        : entryPrice - distance * 0.75,
      percent: 75,
      closePercent: 25
    });
    partialTPs.push({
      price: finalTP,
      percent: 100,
      closePercent: 25
    });
  }

  return partialTPs;
};

/**
 * تقييم مستوى المخاطرة الإجمالي
 * @param {number} accountBalance - رصيد الحساب
 * @param {Array} openTrades - الصفقات المفتوحة
 * @param {number} volatility - التقلب الحالي
 * @param {string} marketStatus - حالة السوق
 * @returns {Object} - تقييم المخاطر والتوصيات
 */
export const assessOverallRisk = (
  accountBalance,
  openTrades = [],
  volatility = 0.01,
  marketStatus = 'Normal'
) => {
  // حساب المخاطرة الحالية
  const totalExposure = openTrades.reduce((sum, trade) => {
    const riskAmount = Math.abs(trade.entryPrice - trade.stopLoss) * trade.positionSize;
    return sum + riskAmount;
  }, 0);

  const exposurePercent = (totalExposure / accountBalance) * 100;

  // تحديد مستوى المخاطرة
  let riskLevel = 'Low';
  let recommendation = 'يمكن فتح صفقات جديدة';
  let maxNewTrades = 3;

  if (exposurePercent > 15) {
    riskLevel = 'Critical';
    recommendation = 'توقف عن فتح صفقات جديدة فوراً!';
    maxNewTrades = 0;
  } else if (exposurePercent > 10) {
    riskLevel = 'High';
    recommendation = 'قلل حجم الصفقات الجديدة';
    maxNewTrades = 1;
  } else if (exposurePercent > 5) {
    riskLevel = 'Medium';
    recommendation = 'كن حذراً مع الصفقات الجديدة';
    maxNewTrades = 2;
  }

  // تعديل بناءً على التقلب
  if (volatility > 0.03) {
    recommendation += ' | تقلب عالي: قلل المخاطرة';
    maxNewTrades = Math.max(0, maxNewTrades - 1);
  }

  // تعديل بناءً على حالة السوق
  if (marketStatus === 'Danger') {
    recommendation += ' | سوق خطر: تجنب الصفقات الجديدة';
    maxNewTrades = 0;
  }

  return {
    riskLevel,
    exposurePercent: exposurePercent.toFixed(2),
    recommendation,
    maxNewTrades,
    totalExposure: totalExposure.toFixed(2),
    openTradesCount: openTrades.length
  };
};

/**
 * حساب نسبة Kelly Criterion للمخاطرة المثلى
 * @param {number} winRate - نسبة الفوز (0-100)
 * @param {number} avgWin - متوسط الربح
 * @param {number} avgLoss - متوسط الخسارة
 * @returns {number} - نسبة المخاطرة المثلى
 */
export const calculateKellyCriterion = (winRate, avgWin, avgLoss) => {
  if (avgLoss === 0 || winRate === 0) return 0.01;

  const winProb = winRate / 100;
  const lossProb = 1 - winProb;
  const winLossRatio = Math.abs(avgWin / avgLoss);

  const kelly = (winProb * winLossRatio - lossProb) / winLossRatio;

  // نستخدم نصف Kelly للأمان (Half Kelly)
  const halfKelly = kelly / 2;

  // نحدد بين 0.5% و 5%
  return Math.max(0.5, Math.min(5, halfKelly * 100));
};

/**
 * للتوافق مع الكود القديم
 */
export const getTradeLevels = (price, volatility, timeframe) => {
  const tfMultiplier = timeframe === '15M' ? 0.5 : timeframe === '4H' ? 2.0 : timeframe === '1D' ? 4.0 : 1.0;
  const baseSL = Math.max(volatility * 0.7, 0.0015) * tfMultiplier;
  const baseTP = baseSL * 2.5;

  return {
    sl: price * (1 - baseSL),
    tp: price * (1 + baseTP)
  };
};

export const calculatePositionSize = (accountBalance, riskPercent = 2) => {
  return calculateDynamicPositionSize(accountBalance, riskPercent, 1, 0.99, 1);
};
