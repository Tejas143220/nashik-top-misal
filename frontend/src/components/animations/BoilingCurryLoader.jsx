import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const BoilingCurryLoader = ({ message = "Preparing Nashik's Zanzanit Misal..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      {/* Animated Boiling Pot & Flames */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Flames background pulse */}
        <motion.div
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 blur-md opacity-80"
        />

        {/* Pot Icon */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 w-14 h-14 bg-slate-900 rounded-2xl border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl"
        >
          <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
        </motion.div>

        {/* Steam / Curry Bubble Particles */}
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -30 - item * 8, scale: [0.5, 1, 1.2] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: item * 0.4 }}
            className="absolute top-0 w-3 h-3 rounded-full bg-amber-400/80 blur-[1px]"
            style={{ left: `${25 + item * 20}%` }}
          />
        ))}
      </div>

      <p className="text-xs font-black tracking-wide text-brand-700 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default BoilingCurryLoader;
