import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Copy to Clipboard Button
 */
export const CopyButton = ({ value, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 transition-all group"
      title={label}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="flex items-center gap-1.5"
          >
            <Check className="w-3 h-3 text-green-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Copied</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3 text-gray-500 group-hover:text-yellow-500 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-yellow-500 transition-colors">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;
