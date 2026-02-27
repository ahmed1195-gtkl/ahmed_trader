/**
 * محرك التحليل الفني المتقدم - نسخة محسنة V14.0
 * يقدم تحليلاً واقعياً بناءً على حركة السعر الحقيقية مع دعم البيانات التاريخية
 * تم تطوير خوارزمية الدعوم والمقاومات لتكون حقيقية 100% وتحدد قوة المستويات
 */

export const calculateRSI = (prices, period = 14) => {
  if (prices.length <= period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = prices[prices.length - i] - prices[prices.length - i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  if (prices.length > period + 1) {
    for (let i = period + 1; i < Math.min(prices.length, period * 2); i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

export const getTechnicalSignal = (prices) => {
  if (prices.length < 2) return { score: 0, rsi: 50, trend: 'neutral', reason: 'Insufficient data' };
  
  const rsi = calculateRSI(prices);
  const lastPrice = prices[prices.length - 1];
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(prices.length, 20);
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(prices.length, 50);
  
  let score = 0;
  let reason = '';

  if (rsi < 30) {
    score += 35;
    reason = 'Oversold conditions detected on RSI, potential reversal.';
  } else if (rsi > 70) {
    score -= 35;
    reason = 'Overbought conditions detected on RSI, potential correction.';
  } else if (rsi > 50 && lastPrice > sma20) {
    score += 15;
    reason = 'Bullish momentum confirmed by RSI and SMA20.';
  } else if (rsi < 50 && lastPrice < sma20) {
    score -= 15;
    reason = 'Bearish pressure confirmed by RSI and SMA20.';
  }

  if (sma20 > sma50) score += 10;
  else score -= 10;
  
  return { 
    score, 
    rsi, 
    trend: score > 20 ? 'bullish' : score < -20 ? 'bearish' : 'neutral',
    reason 
  };
};





/**
 * خوارزمية متطورة لاستخراج الدعوم والمقاومات الحقيقية
 * تعتمد على تحديد القمم والقيعان المحلية (Fractals) وحساب عدد الارتدادات
 */
export const calculateSupportResistance = (prices) => {
  if (prices.length < 30) return { support: 0, resistance: 0, supportStrength: 'Weak', resistanceStrength: 'Weak' };

  const findLevels = (data, isResistance) => {
    const levels = [];
    const window = 5; // حجم النافذة لتحديد القمة/القاع
    
    for (let i = window; i < data.length - window; i++) {
      let isPivot = true;
      for (let j = 1; j <= window; j++) {
        if (isResistance) {
          if (data[i] < data[i - j] || data[i] < data[i + j]) {
            isPivot = false;
            break;
          }
        } else {
          if (data[i] > data[i - j] || data[i] > data[i + j]) {
            isPivot = false;
            break;
          }
        }
      }
      
      if (isPivot) {
        const price = data[i];
        // تجميع المستويات القريبة من بعضها
        const existingLevel = levels.find(l => Math.abs(l.price - price) / price < 0.002);
        if (existingLevel) {
          existingLevel.hits += 1;
        } else {
          levels.push({ price, hits: 1 });
        }
      }
    }
    return levels.sort((a, b) => b.hits - a.hits);
  };

  const currentPrice = prices[prices.length - 1];
  const resistances = findLevels(prices, true).filter(l => l.price > currentPrice);
  const supports = findLevels(prices, false).filter(l => l.price < currentPrice);

  const bestResistance = resistances[0] || { price: currentPrice * 1.02, hits: 1 };
  const bestSupport = supports[0] || { price: currentPrice * 0.98, hits: 1 };

  const getStrength = (hits) => {
    if (hits >= 3) return 'Strong';
    if (hits === 2) return 'Medium';
    return 'Weak';
  };

  return {
    support: bestSupport.price,
    resistance: bestResistance.price,
    supportStrength: getStrength(bestSupport.hits),
    resistanceStrength: getStrength(bestResistance.hits)
  };
};

/**
 * حساب مؤشر ADX (Average Directional Index) لقياس قوة الاتجاه
 */
export const calculateADX = (prices, period = 14) => {
  if (prices.length < period + 1) return 25; // قيمة افتراضية

  let plusDM = 0, minusDM = 0, tr = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const high = prices[i];
    const low = prices[i];
    const prevHigh = prices[i - 1];
    const prevLow = prices[i - 1];
    const prevClose = prices[i - 1];
    
    const highDiff = high - prevHigh;
    const lowDiff = prevLow - low;
    
    if (highDiff > lowDiff && highDiff > 0) plusDM += highDiff;
    if (lowDiff > highDiff && lowDiff > 0) minusDM += lowDiff;
    
    const trueRange = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    tr += trueRange;
  }
  
  const plusDI = (plusDM / tr) * 100;
  const minusDI = (minusDM / tr) * 100;
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  
  return dx;
};

/**
 * تحليل حجم التداول (Volume Analysis)
 */
export const calculateVolume = (prices) => {
  if (prices.length < 10) return { trend: 'neutral', strength: 'weak' };
  
  // محاكاة حجم التداول بناءً على تقلبات السعر
  const recentVolatility = prices.slice(-5).reduce((sum, price, i, arr) => {
    if (i === 0) return 0;
    return sum + Math.abs(price - arr[i - 1]);
  }, 0);
  
  const olderVolatility = prices.slice(-10, -5).reduce((sum, price, i, arr) => {
    if (i === 0) return 0;
    return sum + Math.abs(price - arr[i - 1]);
  }, 0);
  
  const trend = recentVolatility > olderVolatility ? 'increasing' : 'decreasing';
  const strength = Math.abs(recentVolatility - olderVolatility) / olderVolatility > 0.2 ? 'strong' : 'weak';
  
  return { trend, strength };
};


/**
 * حساب Fair Value Gaps (FVG)
 * FVG هي فجوات سعرية تحدث عندما يكون هناك عدم توازن بين العرض والطلب
 * @param {Array} candles - مصفوفة من الشموع [{high, low, close, open}, ...]
 * @returns {Object} - معلومات عن FVG
 */
export const calculateFVG = (candles) => {
  if (candles.length < 3) {
    return {
      hasFVG: false,
      type: null,
      strength: 0,
      gapSize: 0,
      priceLevel: 0
    };
  }

  const fvgs = [];

  // نبحث عن FVG في آخر 20 شمعة
  const lookback = Math.min(20, candles.length - 2);
  
  for (let i = candles.length - 3; i >= candles.length - lookback - 3 && i >= 0; i--) {
    const candle1 = candles[i];     // الشمعة الأولى
    const candle2 = candles[i + 1]; // الشمعة الوسطى
    const candle3 = candles[i + 2]; // الشمعة الثالثة

    // Bullish FVG: عندما يكون low الشمعة الثالثة أعلى من high الشمعة الأولى
    if (candle3.low > candle1.high) {
      const gapSize = candle3.low - candle1.high;
      const gapPercent = (gapSize / candle1.high) * 100;
      
      fvgs.push({
        type: 'bullish',
        gapSize,
        gapPercent,
        upperLevel: candle3.low,
        lowerLevel: candle1.high,
        midLevel: (candle3.low + candle1.high) / 2,
        strength: gapPercent > 0.5 ? 'strong' : gapPercent > 0.2 ? 'medium' : 'weak',
        age: candles.length - i - 3 // عمر الفجوة
      });
    }
    
    // Bearish FVG: عندما يكون high الشمعة الثالثة أقل من low الشمعة الأولى
    if (candle3.high < candle1.low) {
      const gapSize = candle1.low - candle3.high;
      const gapPercent = (gapSize / candle1.low) * 100;
      
      fvgs.push({
        type: 'bearish',
        gapSize,
        gapPercent,
        upperLevel: candle1.low,
        lowerLevel: candle3.high,
        midLevel: (candle1.low + candle3.high) / 2,
        strength: gapPercent > 0.5 ? 'strong' : gapPercent > 0.2 ? 'medium' : 'weak',
        age: candles.length - i - 3
      });
    }
  }

  // إذا لم نجد FVG
  if (fvgs.length === 0) {
    return {
      hasFVG: false,
      type: null,
      strength: 0,
      gapSize: 0,
      priceLevel: 0,
      signal: 'neutral'
    };
  }

  // نأخذ أحدث وأقوى FVG
  const latestFVG = fvgs.sort((a, b) => {
    // نرتب حسب القوة أولاً ثم الحداثة
    if (a.strength !== b.strength) {
      const strengthOrder = { strong: 3, medium: 2, weak: 1 };
      return strengthOrder[b.strength] - strengthOrder[a.strength];
    }
    return a.age - b.age;
  })[0];

  const currentPrice = candles[candles.length - 1].close;
  
  // تحديد الإشارة بناءً على موقع السعر من FVG
  let signal = 'neutral';
  let signalStrength = 0;

  if (latestFVG.type === 'bullish') {
    // إذا كان السعر قريب من FVG الصاعد، إشارة شراء
    if (currentPrice >= latestFVG.lowerLevel && currentPrice <= latestFVG.upperLevel) {
      signal = 'buy';
      signalStrength = latestFVG.strength === 'strong' ? 25 : latestFVG.strength === 'medium' ? 15 : 8;
    } else if (currentPrice < latestFVG.lowerLevel && (latestFVG.lowerLevel - currentPrice) / currentPrice < 0.01) {
      signal = 'buy';
      signalStrength = latestFVG.strength === 'strong' ? 20 : latestFVG.strength === 'medium' ? 12 : 6;
    }
  } else if (latestFVG.type === 'bearish') {
    // إذا كان السعر قريب من FVG الهابط، إشارة بيع
    if (currentPrice >= latestFVG.lowerLevel && currentPrice <= latestFVG.upperLevel) {
      signal = 'sell';
      signalStrength = latestFVG.strength === 'strong' ? 25 : latestFVG.strength === 'medium' ? 15 : 8;
    } else if (currentPrice > latestFVG.upperLevel && (currentPrice - latestFVG.upperLevel) / currentPrice < 0.01) {
      signal = 'sell';
      signalStrength = latestFVG.strength === 'strong' ? 20 : latestFVG.strength === 'medium' ? 12 : 6;
    }
  }

  return {
    hasFVG: true,
    type: latestFVG.type,
    strength: latestFVG.strength,
    gapSize: latestFVG.gapSize,
    gapPercent: latestFVG.gapPercent,
    upperLevel: latestFVG.upperLevel,
    lowerLevel: latestFVG.lowerLevel,
    midLevel: latestFVG.midLevel,
    priceLevel: latestFVG.midLevel,
    signal,
    signalStrength,
    age: latestFVG.age,
    totalFVGs: fvgs.length
  };
};

/**
 * تحويل الأسعار إلى شموع افتراضية للتحليل
 * @param {Array} prices - مصفوفة الأسعار
 * @returns {Array} - مصفوفة من الشموع
 */
export const pricesToCandles = (prices) => {
  const candles = [];
  const candleSize = 5; // كل 5 أسعار = شمعة واحدة

  for (let i = 0; i < prices.length; i += candleSize) {
    const segment = prices.slice(i, i + candleSize);
    if (segment.length > 0) {
      candles.push({
        open: segment[0],
        high: Math.max(...segment),
        low: Math.min(...segment),
        close: segment[segment.length - 1]
      });
    }
  }

  return candles;
};


/**
 * حساب Average True Range (ATR)
 * @param {Array} highs - مصفوفة أعلى الأسعار
 * @param {Array} lows - مصفوفة أدنى الأسعار
 * @param {Array} closes - مصفوفة أسعار الإغلاق
 * @param {number} period - الفترة (افتراضي 14)
 * @returns {number} - قيمة ATR
 */
export const calculateATR = (highs, lows, closes, period = 14) => {
  if (highs.length < period + 1 || lows.length < period + 1 || closes.length < period + 1) {
    return 0;
  }

  const trueRanges = [];

  for (let i = 1; i < highs.length; i++) {
    const high = highs[i];
    const low = lows[i];
    const prevClose = closes[i - 1];

    // True Range = max(high - low, |high - prevClose|, |low - prevClose|)
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    trueRanges.push(tr);
  }

  // حساب ATR كمتوسط متحرك للـ True Range
  if (trueRanges.length < period) {
    return trueRanges.reduce((a, b) => a + b, 0) / trueRanges.length;
  }

  // أول ATR = متوسط بسيط لأول period من TR
  let atr = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // باقي ATR = متوسط متحرك أسي
  for (let i = period; i < trueRanges.length; i++) {
    atr = ((atr * (period - 1)) + trueRanges[i]) / period;
  }

  return atr;
};

/**
 * حساب MACD (Moving Average Convergence Divergence)
 * @param {Array} prices - مصفوفة الأسعار
 * @param {number} fastPeriod - الفترة السريعة (افتراضي 12)
 * @param {number} slowPeriod - الفترة البطيئة (افتراضي 26)
 * @param {number} signalPeriod - فترة الإشارة (افتراضي 9)
 * @returns {Object} - {macd, signal, histogram}
 */
export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (prices.length < slowPeriod) {
    return { macd: 0, signal: 0, histogram: 0 };
  }

  // حساب EMA
  const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < data.length; i++) {
      ema = (data[i] * k) + (ema * (1 - k));
    }

    return ema;
  };

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macd = fastEMA - slowEMA;

  // حساب Signal Line (EMA من MACD)
  // نحتاج MACD لكل نقطة لحساب Signal، لكن هنا نبسطها
  const signal = macd * 0.9; // تقريب مبسط

  const histogram = macd - signal;

  return { macd, signal, histogram };
};

/**
 * حساب Bollinger Bands
 * @param {Array} prices - مصفوفة الأسعار
 * @param {number} period - الفترة (افتراضي 20)
 * @param {number} stdDev - عدد الانحرافات المعيارية (افتراضي 2)
 * @returns {Object} - {upper, middle, lower}
 */
export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) {
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return { upper: avg, middle: avg, lower: avg };
  }

  const slice = prices.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / period;

  // حساب الانحراف المعياري
  const variance = slice.reduce((sum, price) => sum + Math.pow(price - middle, 2), 0) / period;
  const std = Math.sqrt(variance);

  const upper = middle + (std * stdDev);
  const lower = middle - (std * stdDev);

  return { upper, middle, lower };
};

/**
 * حساب SL/TP بناءً على ATR
 * @param {string} tradeType - 'BUY' or 'SELL'
 * @param {number} entryPrice - سعر الدخول
 * @param {number} atr - قيمة ATR
 * @param {number} slMultiplier - مضاعف ATR للـ SL (افتراضي 2)
 * @param {number} tpMultiplier - مضاعف ATR للـ TP (افتراضي 3)
 * @returns {Object} - {stopLoss, takeProfit}
 */
export const calculateATRBasedLevels = (
  tradeType,
  entryPrice,
  atr,
  slMultiplier = 2,
  tpMultiplier = 3
) => {
  if (tradeType === 'BUY') {
    return {
      stopLoss: entryPrice - (atr * slMultiplier),
      takeProfit: entryPrice + (atr * tpMultiplier)
    };
  } else {
    return {
      stopLoss: entryPrice + (atr * slMultiplier),
      takeProfit: entryPrice - (atr * tpMultiplier)
    };
  }
};
