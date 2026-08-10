import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Navigation } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import CrowdMeterBadge from '../detail/CrowdMeterBadge';
import { Link } from 'react-router-dom';

// Custom Chili Icon for Leaflet
const chiliIcon = L.divIcon({
  className: 'custom-chili-marker',
  html: `<div style="font-size:24px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">🌶️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export const MapViewModal = ({ isOpen, onClose, shops = [] }) => {
  if (!isOpen) return null;

  const centerLat = 20.015;
  const centerLng = 73.765;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl relative overflow-hidden border border-amber-200">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-amber-200 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" /> Interactive Nashik Misal Live Map 🗺️
            </h3>
            <p className="text-xs text-slate-500 font-medium">Explore live crowd levels & locations across Nashik</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaflet Map Box */}
        <div className="flex-1 w-full h-full relative">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {(Array.isArray(shops) ? shops : []).map((shop) => (
              <Marker
                key={shop.id}
                position={[shop.latitude || 20.0059, shop.longitude || 73.7898]}
                icon={chiliIcon}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-2 max-w-xs">
                    {shop.main_image_url && (
                      <img
                        src={shop.main_image_url}
                        alt={shop.name}
                        className="w-full h-24 object-cover rounded-xl"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        {shop.is_sponsored && (
                          <span className="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                        <h4 className="text-xs font-black text-slate-900 leading-tight">{shop.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500">{shop.area}, Nashik</p>
                    </div>

                    <CrowdMeterBadge status={shop.crowd_status} />

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <RatingStars rating={shop.avg_rating} size="sm" />
                      <span className="text-[10px] font-black text-slate-800">₹{shop.price_per_plate}/plate</span>
                    </div>

                    <div className="flex items-center gap-1 pt-1">
                      <Link
                        to={`/misal/${shop.slug}`}
                        onClick={onClose}
                        className="flex-1 bg-brand-600 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg text-center"
                      >
                        View Details
                      </Link>
                      {shop.google_maps_url && (
                        <a
                          href={shop.google_maps_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-900 text-amber-300 p-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapViewModal;
