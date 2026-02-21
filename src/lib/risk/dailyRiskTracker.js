/**
 * Daily Risk Tracker
 * Tracks total risk taken per day with localStorage
 */

import { RISK_DEFAULTS } from './config';

const STORAGE_KEY = 'dailyRiskTracker';

/**
 * Get current date string (YYYY-MM-DD)
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get daily risk data from localStorage
 */
function getDailyData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check if data is from today
    if (data.date !== getCurrentDate()) {
      return null; // Reset if different day
    }
    
    return data;
  } catch (error) {
    console.error('Error reading daily risk data:', error);
    return null;
  }
}

/**
 * Save daily risk data to localStorage
 */
function saveDailyData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving daily risk data:', error);
  }
}

/**
 * Update daily risk with new trade
 * @param {number} riskPercent - Risk percentage for this trade
 */
export function updateDailyRisk(riskPercent) {
  let data = getDailyData();
  
  if (!data) {
    // Create new data for today
    data = {
      date: getCurrentDate(),
      totalRisk: 0,
      totalTrades: 0
    };
  }
  
  // Update data
  data.totalRisk += riskPercent;
  data.totalTrades += 1;
  
  saveDailyData(data);
  
  return getDailyRiskStatus();
}

/**
 * Get current daily risk status
 * @returns {Object} - Daily risk summary
 */
export function getDailyRiskStatus() {
  const data = getDailyData();
  
  if (!data) {
    return {
      totalRisk: 0,
      totalTrades: 0,
      maxDailyRisk: RISK_DEFAULTS.maxDailyRiskPercent,
      remainingRisk: RISK_DEFAULTS.maxDailyRiskPercent,
      isLimitReached: false,
      utilizationPercent: 0
    };
  }
  
  const remainingRisk = Math.max(0, RISK_DEFAULTS.maxDailyRiskPercent - data.totalRisk);
  const isLimitReached = data.totalRisk >= RISK_DEFAULTS.maxDailyRiskPercent;
  const utilizationPercent = (data.totalRisk / RISK_DEFAULTS.maxDailyRiskPercent) * 100;
  
  return {
    totalRisk: parseFloat(data.totalRisk.toFixed(2)),
    totalTrades: data.totalTrades,
    maxDailyRisk: RISK_DEFAULTS.maxDailyRiskPercent,
    remainingRisk: parseFloat(remainingRisk.toFixed(2)),
    isLimitReached,
    utilizationPercent: parseFloat(utilizationPercent.toFixed(1))
  };
}

/**
 * Reset daily risk (for testing or manual reset)
 */
export function resetDailyRisk() {
  localStorage.removeItem(STORAGE_KEY);
  return getDailyRiskStatus();
}
