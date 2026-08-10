import { CheckCircle2, Info } from 'lucide-react';

export const ShopOverview = ({ shop }) => {
  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-6 space-y-6 shadow-sm">
      {/* Description */}
      <div>
        <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-3 uppercase tracking-wider">
          <Info className="w-4 h-4 text-brand-600" /> About {shop.name}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {shop.description || shop.tagline || `${shop.name} is one of Nashik's renowned misal spots serving authentic spiced misal rassa, farsan, and fresh pav.`}
        </p>
      </div>

      {/* Special Facilities & Activities */}
      {shop.activities && shop.activities.length > 0 && (
        <div>
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
            Highlights & Special Activities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Array.isArray(shop?.activities) ? shop.activities : []).map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs font-bold text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{act.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Specifications */}
      <div className="pt-4 border-t border-amber-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Wood Stove Cooked</span>
          <span className="text-xs font-extrabold text-slate-800">
            {shop.is_chulhivarchi ? 'Yes (Chulhivarchi)' : 'Gas Stove'}
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Spicy Level</span>
          <span className="text-xs font-extrabold text-brand-600">
            Level {shop.spicy_level} / 5
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Price per Plate</span>
          <span className="text-xs font-extrabold text-slate-800">
            {shop.price_per_plate ? `₹${shop.price_per_plate}` : '₹120'}
          </span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Weekly Off</span>
          <span className="text-xs font-extrabold text-slate-800">
            {shop.weekly_off || 'Open Everyday'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopOverview;
