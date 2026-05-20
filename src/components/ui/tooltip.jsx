import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

/**
 * Tooltip Component
 * Shows helpful information on hover
 */
export const Tooltip = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          >
            <div className="bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg border border-white/10 shadow-2xl backdrop-blur-xl max-w-xs">
              <p className="leading-relaxed">{text}</p>
              <div className="absolute w-2 h-2 bg-zinc-800 border-white/10 rotate-45 
                            ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
                            ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
                            ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2 border-r border-t' : ''}
                            ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2 border-l border-b' : ''}"
              ></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Tooltip Icon - Small info icon with tooltip
 */
export const TooltipIcon = ({ text, position = 'top' }) => {
  return (
    <Tooltip text={text} position={position}>
      <Info className="w-3 h-3 text-gray-500 hover:text-amber-500 transition-colors cursor-help ml-1" />
    </Tooltip>
  );
};

export default Tooltip;
