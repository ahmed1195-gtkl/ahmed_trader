/**
 * محرك إدارة المخاطر
 * يحسب حجم الصفقة ومستويات وقف الخسارة وجني الأرباح
 */

export const calculatePositionSize = (balance, riskPercentage, stopLossPips) => {
  const amountToRisk = balance * (riskPercentage / 100);
  // تبسيط للحساب: نفترض أن كل نقطة تساوي قيمة معينة
  return amountToRisk / (stopLossPips || 10);
};

export const getTradeLevels = (currentPrice, side, volatility) => {
  const multiplier = volatility || 0.002;
  if (side === 'buy') {
    return {
      entry: currentPrice,
      tp: currentPrice * (1 + multiplier * 2),
      sl: currentPrice * (1 - multiplier)
    };
  } else {
    return {
      entry: currentPrice,
      tp: currentPrice * (1 - multiplier * 2),
      sl: currentPrice * (1 + multiplier)
    };
  }
};
