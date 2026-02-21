/**
 * Position Quality Analyzer
 * Evaluates trade quality based on risk and reward parameters
 */

/**
 * Analyze position quality
 * @param {Object} params - Position parameters
 * @returns {Object} - Quality score and label
 */
export function analyzePosition({ riskPercent, riskRewardRatio }) {
  let score = 50; // Base score
  
  // Risk percent scoring (40 points max)
  if (riskPercent <= 1) {
    score += 40; // Excellent risk management
  } else if (riskPercent <= 2) {
    score += 30; // Good risk management
  } else if (riskPercent <= 3) {
    score += 15; // Acceptable
  } else {
    score -= 20; // Penalize high risk
  }
  
  // Risk:Reward ratio scoring (50 points max)
  if (riskRewardRatio >= 3) {
    score += 50; // Excellent R:R
  } else if (riskRewardRatio >= 2) {
    score += 35; // Good R:R
  } else if (riskRewardRatio >= 1.5) {
    score += 20; // Acceptable R:R
  } else if (riskRewardRatio >= 1) {
    score += 5; // Minimal R:R
  } else {
    score -= 30; // Poor R:R
  }
  
  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Determine label
  let label = 'Poor';
  let color = 'red';
  
  if (score >= 80) {
    label = 'Professional';
    color = 'green';
  } else if (score >= 60) {
    label = 'Good';
    color = 'blue';
  } else if (score >= 40) {
    label = 'Acceptable';
    color = 'yellow';
  }
  
  return {
    score: Math.round(score),
    label,
    color,
    details: {
      riskScore: riskPercent <= 2 ? 'Excellent' : riskPercent <= 3 ? 'Good' : 'High',
      rewardScore: riskRewardRatio >= 2 ? 'Excellent' : riskRewardRatio >= 1.5 ? 'Good' : 'Low'
    }
  };
}

/**
 * Get position recommendations
 * @param {Object} analysis - Position analysis result
 * @returns {Array} - List of recommendations
 */
export function getRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.details.riskScore === 'High') {
    recommendations.push('Consider reducing risk to 2% or less');
  }
  
  if (analysis.details.rewardScore === 'Low') {
    recommendations.push('Aim for Risk:Reward ratio of 1:2 or higher');
  }
  
  if (analysis.score >= 80) {
    recommendations.push('Excellent position setup - maintain discipline');
  }
  
  return recommendations;
}
