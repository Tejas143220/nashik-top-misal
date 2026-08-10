import React from 'react';
import { Users, Clock } from 'lucide-react';

export const CrowdMeterBadge = ({ status = "moderate", onCheckinClick }) => {
  const statusConfigs = {
    empty: {
      label: "Low Crowd (Quick Seating)",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-500",
    },
    low: {
      label: "Low Crowd (0-5m Wait)",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-500",
    },
    moderate: {
      label: "Moderate Rush (~15m Wait)",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      dot: "bg-amber-500",
    },
    crowded: {
      label: "Crowded Queue (20-35m Wait)",
      color: "bg-orange-100 text-orange-800 border-orange-300",
      dot: "bg-orange-600",
    },
    full: {
      label: "Peak Rush Hour (45m+ Queue)",
      color: "bg-red-100 text-red-800 border-red-300 font-extrabold",
      dot: "bg-red-600 animate-ping",
    },
  };

  const config = statusConfigs[status] || statusConfigs.moderate;

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${config.color}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>{config.label}</span>
      </div>

      {onCheckinClick && (
        <button
          onClick={onCheckinClick}
          className="text-xs font-black text-amber-950 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full border border-amber-400 flex items-center gap-1 shadow-sm transition-all cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-brand-600" /> Check-In Live Wait ⏱️
        </button>
      )}
    </div>
  );
};

export default CrowdMeterBadge;
