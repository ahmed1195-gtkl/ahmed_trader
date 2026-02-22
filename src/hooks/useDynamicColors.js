/**
 * Dynamic Color Hook
 * Returns color classes based on risk level
 */

export const useDynamicColors = (value, thresholds = { low: 1.5, high: 3 }) => {
  if (value < thresholds.low) {
    return {
      bg: 'bg-green-500/5',
      border: 'border-green-500/20',
      text: 'text-green-500',
      glow: 'shadow-green-500/20',
      icon: 'text-green-500'
    };
  } else if (value < thresholds.high) {
    return {
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      glow: 'shadow-yellow-500/20',
      icon: 'text-yellow-500'
    };
  } else {
    return {
      bg: 'bg-red-500/5',
      border: 'border-red-500/20',
      text: 'text-red-500',
      glow: 'shadow-red-500/20',
      icon: 'text-red-500'
    };
  }
};

/**
 * Position Quality Colors
 */
export const useQualityColors = (score) => {
  if (score >= 80) {
    return {
      bg: 'bg-green-500/5',
      border: 'border-green-500/20',
      text: 'text-green-500',
      bar: 'bg-green-500',
      glow: 'shadow-green-500/20'
    };
  } else if (score >= 60) {
    return {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      text: 'text-blue-500',
      bar: 'bg-blue-500',
      glow: 'shadow-blue-500/20'
    };
  } else if (score >= 40) {
    return {
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      bar: 'bg-yellow-500',
      glow: 'shadow-yellow-500/20'
    };
  } else {
    return {
      bg: 'bg-red-500/5',
      border: 'border-red-500/20',
      text: 'text-red-500',
      bar: 'bg-red-500',
      glow: 'shadow-red-500/20'
    };
  }
};

export default useDynamicColors;
