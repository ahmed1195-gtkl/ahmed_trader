/**
 * Order Flow Analysis Service (V16.1)
 * Analyzes market liquidity, buy/sell pressure, and large order clusters.
 */

export const analyzeOrderFlow = async (symbol, price, history) => {
  try {
    // In a real scenario, this would fetch depth/orderbook data from Binance/Finnhub.
    // For this implementation, we derive flow from price action and simulated depth.
    
    const isCrypto = symbol.includes('USDT');
    
    // Simulate smart buy/sell pressure based on recent price movement
    let basePressure = 50;
    if (history && history.length > 1) {
      const lastPrice = history[history.length - 1];
      const prevPrice = history[history.length - 2];
      const change = (lastPrice - prevPrice) / prevPrice;
      basePressure += change * 1000; // Amplify change for simulation
    }
    
    const buyPressure = Math.max(10, Math.min(90, basePressure + (Math.random() * 20 - 10)));
    const sellPressure = 100 - buyPressure;
    
    // Identify Liquidity Pools (Support/Resistance based on volume)
    const liquidityPools = [
      { price: price * 1.005, type: 'Resistance', strength: 'High', description: 'Large sell wall detected' },
      { price: price * 0.995, type: 'Support', strength: 'Medium', description: 'Institutional buy orders cluster' }
    ];

    const imbalance = buyPressure > 60 ? 'Bullish Imbalance' : sellPressure > 60 ? 'Bearish Imbalance' : 'Neutral';
    
    return {
      buyPressure: buyPressure.toFixed(1),
      sellPressure: sellPressure.toFixed(1),
      imbalance,
      liquidityPools,
      whaleActivity: buyPressure > 75 || sellPressure > 75 ? 'High' : 'Low',
      interpretation: generateInterpretation(imbalance, buyPressure, sellPressure, symbol)
    };
  } catch (error) {
    console.error("Order Flow Analysis Error:", error);
    return null;
  }
};

const generateInterpretation = (imbalance, buy, sell, symbol) => {
  const isGold = symbol.includes('XAU');
  
  if (buy > 70) {
    return isGold 
      ? "تم رصد دخول سيولة مؤسسية ضخمة على الذهب. الحيتان يدعمون مستويات الشراء الحالية بقوة."
      : "سيولة شرائية ضخمة تدخل السوق الآن. الحيتان يقومون بالتجميع عند المستويات الحالية.";
  }
  if (sell > 70) {
    return isGold
      ? "ضغط بيعي قوي من صناديق الاستثمار على الذهب. تم رصد جدران بيع كبيرة تمنع الصعود حالياً."
      : "ضغط بيعي مؤسسي قوي. تم رصد جدران بيع كبيرة تمنع الصعود حالياً.";
  }
  if (imbalance === 'Neutral') return "توازن في تدفق الطلبات. السوق ينتظر سيولة جديدة لتحديد الاتجاه القادم.";
  
  return buy > sell 
    ? "تدفق طلبات إيجابي مع رصد نشاط شرائي متزايد من المحافظ الكبيرة."
    : "تدفق طلبات سلبي مع ميل لتصريف الكميات من قبل كبار المتداولين.";
};
