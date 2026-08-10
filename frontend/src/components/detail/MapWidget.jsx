import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const MapWidget = ({ shop }) => {
  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-6 space-y-4 shadow-sm">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
        <MapPin className="w-4 h-4 text-brand-600" /> Location & Address
      </h3>

      <div className="space-y-1 text-xs text-slate-700">
        <p className="font-bold text-slate-900">{shop.name}</p>
        <p>{shop.address}</p>
        <p>{shop.area}, Nashik {shop.pincode ? `- ${shop.pincode}` : ''}</p>
      </div>

      {/* Embed map iframe or Google Maps direction link */}
      <div className="relative h-44 w-full rounded-2xl bg-amber-100/50 border border-amber-200 flex flex-col items-center justify-center p-4 text-center space-y-2 overflow-hidden">
        <MapPin className="w-8 h-8 text-brand-600 animate-bounce" />
        <p className="text-xs font-bold text-slate-800">
          Navigate to {shop.area}
        </p>
        {shop.google_maps_url && (
          <a
            href={shop.google_maps_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" /> Open in Google Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default MapWidget;
