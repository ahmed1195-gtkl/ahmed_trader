/**
 * Risk & Position Center - Feature Toggles
 * All features are optional and can be toggled independently
 */

export const RISK_CONFIG = {
  riskEngineEnabled: true,
  marginCalcEnabled: true,
  dailyRiskTrackerEnabled: true,
  proMetricsEnabled: true,
  isProUser: false // Set to true for pro features
};

export const RISK_DEFAULTS = {
  defaultRiskPercent: 1,
  maxDailyRiskPercent: 5,
  defaultLeverage: 100,
  forexContractSize: 100000,
  cryptoContractSize: 1
};
