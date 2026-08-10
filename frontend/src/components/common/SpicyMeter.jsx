import React from 'react';
import { motion } from 'framer-motion';
import { getSpicyInfo } from '../../utils/helpers';

export const SpicyMeter = ({ level = 3, interactive = false, onChange, size = "md" }) => {
  const spicyInfo = getSpicyInfo(level);

  const containerSizes = {
    sm: "gap-0.5 text-xs",
    md: "gap-1 text-sm",
    lg: "gap-1.5 text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${containerSizes[size] || containerSizes.md}`}>
        {[1, 2, 3, 4, 5].map((idx) => {
          const isActive = idx <= level;
          return (
            <motion.button
              type="button"
              key={idx}
              disabled={!interactive}
              whileHover={interactive ? { scale: 1.3, rotate: [0, -10, 10, 0] } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
              onClick={() => interactive && onChange && onChange(idx)}
              className={`p-0.5 transition-opacity ${
                isActive ? 'opacity-100 scale-105' : 'opacity-30 grayscale'
              } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
              title={`Level ${idx} Spice`}
            >
              <span role="img" aria-label="spicy flame">
                {idx > 3 ? '🔥' : '🌶️'}
              </span>
            </motion.button>
          );
        })}
      </div>
      <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] text-white border shadow-sm ${spicyInfo.color}`}>
        Level {level} ({spicyInfo.label})
      </span>
    </div>
  );
};

export default SpicyMeter;
