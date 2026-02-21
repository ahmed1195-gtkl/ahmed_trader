/**
 * Risk Engine - Dynamic Lot Size Calculator
 * Calculates position size based on risk percentage
 */

import { RISK_DEFAULTS } from './config';

/**
 * Calculate dynamic lot size based on risk parameters
 * @param {Object} params - Risk calculation parameters
 * @returns {Object} - Lot size and risk summary
 */
export function calculateDynamicLotSize({
  accountBalance,
  riskPercent = RISK_DEFAULTS.defaultRiskPercent,
  stopLossPips,
  pipValue
}) {
  // Validate inputs
  if (!accountBalance || !stopLossPips || !pipValue) {
    return {
      lotSize: 0,
      riskAmount: 0,
      isValid: false
    };
  }

  // Calculate risk amount
  const riskAmount = accountBalance * (riskPercent / 100);
  
  // Calculate lot size
  const lotSize = riskAmount / (stopLossPips * pipValue);
  
  return {
    lotSize: parseFloat(lotSize.toFixed(2)),
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    riskPercent,
    isValid: true
  };
}

/**
 * Get comprehensive risk summary
 * @param {Object} params - Trade parameters
 * @returns {Object} - Complete risk analysis
 */
export function getRiskSummary({
  accountBalance,
  riskPercent,
  stopLossPips,
  takeProfitPips,
  pipValue,
  lotSize
}) {
  // Calculate risk amount
  const riskAmount = accountBalance * (riskPercent / 100);
  
  // Calculate potential loss
  const potentialLoss = stopLossPips * pipValue * lotSize;
  
  // Calculate potential profit
  const potentialProfit = takeProfitPips * pipValue * lotSize;
  
  // Calculate risk:reward ratio
  const riskRewardRatio = takeProfitPips / stopLossPips;
  
  // Determine risk level
  let riskLevel = 'Safe';
  let riskLevelColor = 'green';
  
  if (riskPercent > 3) {
    riskLevel = 'Aggressive';
    riskLevelColor = 'red';
  } else if (riskPercent >= 1.5) {
    riskLevel = 'Moderate';
    riskLevelColor = 'yellow';
  }
  
  return {
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    potentialLoss: parseFloat(potentialLoss.toFixed(2)),
    potentialProfit: parseFloat(potentialProfit.toFixed(2)),
    riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2)),
    riskLevel,
    riskLevelColor,
    riskPercent
  };
}
