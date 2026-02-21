/**
 * Margin Calculator
 * Calculates required margin for a position
 */

import { RISK_DEFAULTS } from './config';

/**
 * Calculate required margin
 * @param {Object} params - Margin calculation parameters
 * @returns {Object} - Margin details
 */
export function calculateMargin({
  lotSize,
  contractSize,
  leverage = RISK_DEFAULTS.defaultLeverage,
  price
}) {
  // Validate inputs
  if (!lotSize || !contractSize || !leverage || !price) {
    return {
      margin: 0,
      freeMargin: 0,
      marginLevel: 0,
      isValid: false
    };
  }

  // Calculate margin
  const margin = (lotSize * contractSize * price) / leverage;
  
  return {
    margin: parseFloat(margin.toFixed(2)),
    leverage,
    contractSize,
    isValid: true
  };
}

/**
 * Get contract size based on asset type
 * @param {string} assetType - 'forex' or 'crypto'
 * @returns {number} - Contract size
 */
export function getContractSize(assetType) {
  if (assetType === 'crypto') {
    return RISK_DEFAULTS.cryptoContractSize;
  }
  return RISK_DEFAULTS.forexContractSize;
}
