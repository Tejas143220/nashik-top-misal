import React, { useEffect, useState } from 'react';
import { fetchAdBySlot } from '../../services/api';
import { ExternalLink } from 'lucide-react';

export const AdSlot = ({ slotName = "directory_sidebar", className = "" }) => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    fetchAdBySlot(slotName)
      .then((res) => setAd(res))
      .catch(() => setAd(null));
  }, [slotName]);

  if (!ad) {
    // Phase 2 Ad Placeholder box encouraging shop owners to advertise
    return (
      <div className={`p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-dashed border-amber-300 rounded-2xl text-center shadow-inner ${className}`}>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
          Sponsored Slot
        </span>
        <h4 className="text-xs font-bold text-slate-800 mt-2">
          Want your Misal Shop Featured Here?
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 mb-2">
          Reach thousands of hungry misal lovers in Nashik daily.
        </p>
        <a
          href="/submit-shop"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 underline"
        >
          Book This Ad Slot <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border border-amber-200 bg-white ${className}`}>
      <div className="bg-amber-100/80 px-3 py-1 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <span>Advertisement</span>
        <span>Sponsored</span>
      </div>
      {ad.image_url ? (
        <a href={ad.target_url || '#'} target="_blank" rel="noreferrer" className="block group">
          <img
            src={ad.image_url}
            alt={ad.title || "Advertisement"}
            className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity"
          />
        </a>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: ad.ad_code_or_html }}
          className="p-2"
        />
      )}
    </div>
  );
};

export default AdSlot;
