import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Flame, Crown, Lock } from 'lucide-react';

export const BadgeGrid = ({ badges = [] }) => {
  const iconMap = {
    Compass: Compass,
    Flame: Flame,
    Award: Award,
    Crown: Crown,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {(Array.isArray(badges) ? badges : []).map((badge) => {
        const IconComponent = iconMap[badge.icon] || Award;
        return (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-slate-100 border-slate-200 opacity-60 grayscale'
            }`}
          >
            {!badge.unlocked && (
              <div className="absolute top-2 right-2 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
              badge.unlocked ? 'bg-gradient-to-tr from-brand-600 to-amber-500' : 'bg-slate-300'
            }`}>
              <IconComponent className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-900">{badge.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{badge.description}</p>
            </div>

            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
              badge.unlocked ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
            }`}>
              {badge.unlocked ? 'Unlocked 🏆' : `${badge.required_stamps} Stamps Req.`}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
