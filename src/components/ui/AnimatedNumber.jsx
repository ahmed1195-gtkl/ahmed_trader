import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Animated Number Counter
 * Animates from 0 to target value
 */
export const AnimatedNumber = ({ value, decimals = 2, prefix = '', suffix = '', className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const numValue = parseFloat(value) || 0;
    
    // Animate from previous value to new value
    const startValue = prevValue.current;
    const endValue = numValue;
    const duration = 800; // ms
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
      }
    };

    animate();
  }, [value]);

  const formattedValue = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {formattedValue}
    </motion.span>
  );
};

export default AnimatedNumber;
