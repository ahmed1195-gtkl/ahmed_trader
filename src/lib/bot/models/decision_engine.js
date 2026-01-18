/**
 * محرك القرار المتقدم (Decision Engine) - V8.0
 * يقوم بفصل منطق التداول عن الواجهة وتطبيق قواعد صارمة للقرار والمخاطرة
 */

import { getTechnicalSignal, calculateRSI, calculateMACD, calculateBollingerBands } from '../analysis/technical';

export const getDecision = (data) => {
  const { prices, marketStatus, timeframe, assetType } = data;

  // 1. منع التوصيات أثناء الأخبار (صارم)
  if (marketStatus === 'Danger') {
    return { recommendation: 'WAIT', confidence: 0, reason: 'High Impact News - Trading Halted' };
  }

  if (!prices || prices.length < 30) {
    return { recommendation: 'WAIT', confidence: 0, reason: 'Insufficient Market Data' };
  }

  const currentPrice = prices[prices.length - 1];
  const tech = getTechnicalSignal(prices);
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bb = calculateBollingerBands(prices);

  // بناء طبقة القرار الحقيقية
  const decision = {
    trend: tech.score > 0 ? 1 : tech.score < 0 ? -1 : 0,
    entryModel: (rsi < 35 || rsi > 65) ? (rsi < 35 ? 1 : -1) : 0,
    momentum: macd.histogram > 0 ? 1 : macd.histogram < 0 ? -1 : 0,
    volume: (currentPrice > bb.upper || currentPrice < bb.lower) ? (currentPrice < bb.lower ? 1 : -1) : 0,
    fundamental: marketStatus === 'Stable' ? 1 : 0,
    multiTF: timeframe === '1H' || timeframe === '4H' ? (tech.score > 0 ? 1 : -1) : 0
  };

  // حساب الثقة بناءً على الأوزان المطلوبة
  // confidence = trend*25 + entryModel*20 + momentum*15 + volume*10 + fundamental*15 + multiTF*15
  
  let confidence = 0;
  let hasConflict = false;
  let zeroElements = 0;

  // التحقق من التعارض Buy/Sell
  const signals = [decision.trend, decision.entryModel, decision.momentum, decision.volume, decision.multiTF].filter(s => s !== 0);
  if (signals.includes(1) && signals.includes(-1)) {
    hasConflict = true;
  }

  if (hasConflict) {
    return { recommendation: 'WAIT', confidence: 0, reason: 'Market Conflict Detected' };
  }

  // حساب الثقة
  confidence += Math.abs(decision.trend) * 25;
  confidence += Math.abs(decision.entryModel) * 20;
  confidence += Math.abs(decision.momentum) * 15;
  confidence += Math.abs(decision.volume) * 10;
  confidence += Math.abs(decision.fundamental) * 15;
  confidence += Math.abs(decision.multiTF) * 15;

  // إذا أي عنصر = 0 → خفّض الثقة
  Object.values(decision).forEach(val => {
    if (val === 0) zeroElements++;
  });
  confidence -= (zeroElements * 5);

  // ضمان أن الثقة بين 0 و 100
  confidence = Math.max(0, Math.min(100, confidence));

  // ربط المخاطرة بالثقة
  let riskPercent = 0;
  let recommendation = 'WAIT';

  if (confidence >= 80) {
    recommendation = tech.score > 0 ? 'BUY' : 'SELL';
    if (confidence >= 90) riskPercent = 2;
    else if (confidence >= 85) riskPercent = 1.5;
    else if (confidence >= 80) riskPercent = 1;
  }

  return {
    recommendation,
    confidence,
    riskPercent,
    decision,
    tech,
    reason: recommendation === 'WAIT' ? 'Waiting for stronger confirmation' : `Strong ${recommendation} signal with ${confidence}% confidence`
  };
};
