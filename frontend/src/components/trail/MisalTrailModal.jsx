import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Navigation, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const createNumberedMarker = (number) => L.divIcon({
  className: 'custom-trail-marker',
  html: `<div style="background-color: #ea580c; color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">#${number}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export const MisalTrailModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' or 'custom'
  const [curatedTrails, setCuratedTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  
  // Custom trail builder state
  const [allShops, setAllShops] = useState([]);
  const [selectedShopIds, setSelectedShopIds] = useState([1, 2, 4]);
  const [customResult, setCustomResult] = useState(null);
  const [_loading, setLoading] = useState(false);

  const fetchCurated = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/trail/curated');
      setCuratedTrails(data);
      if (data && data.length > 0) {
        setSelectedTrail(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAllShops = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/shops/?limit=50');
      setAllShops(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCurated();
      fetchAllShops();
    }
  }, [isOpen, fetchCurated, fetchAllShops]);

  const calculateCustom = useCallback(async () => {
    if (selectedShopIds.length < 2) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/trail/calculate', {
        shop_ids: selectedShopIds,
        group_size: 2
      });
      setCustomResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedShopIds]);

  useEffect(() => {
    if (activeTab === 'custom' && selectedShopIds.length >= 2) {
      calculateCustom();
    }
  }, [activeTab, selectedShopIds, calculateCustom]);

  if (!isOpen) return null;

  const currentDisplayShops = activeTab === 'curated'
    ? (selectedTrail?.shops || [])
    : (customResult?.trail_stops || []);

  const polylineCoords = currentDisplayShops.map((s) => [s.latitude || 20.0059, s.longitude || 73.7898]);
  const centerLat = polylineCoords.length > 0 ? polylineCoords[0][0] : 20.015;
  const centerLng = polylineCoords.length > 0 ? polylineCoords[0][1] : 73.765;

  const gmapsUrl = activeTab === 'curated' ? selectedTrail?.gmaps_url : customResult?.gmaps_url;
  const totalDist = activeTab === 'curated' ? selectedTrail?.total_distance_km : customResult?.total_distance_km;
  const driveTime = activeTab === 'curated' ? selectedTrail?.estimated_driving_mins : customResult?.estimated_driving_mins;

  const handleAddShopToCustom = (shopId) => {
    if (selectedShopIds.includes(shopId) || selectedShopIds.length >= 4) return;
    setSelectedShopIds([...selectedShopIds, shopId]);
  };

  const handleRemoveShopFromCustom = (shopId) => {
    if (selectedShopIds.length <= 2) {
      alert("A trail must have at least 2 misal stops.");
      return;
    }
    setSelectedShopIds(selectedShopIds.filter((id) => id !== shopId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl relative overflow-hidden border border-amber-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between z-10 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" /> Weekend Food Crawl Route Planner
            </div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              Nashik Misal Trail 🗺️
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('curated')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'curated'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              🏆 Curated Popular Trails
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              🛠️ Custom Trail Builder
            </button>
          </div>

          {/* Stats Header */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-brand-600" /> {totalDist || 0} km Total</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-600" /> ~{driveTime || 0} mins</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Controls Sidebar */}
          <div className="lg:col-span-5 p-5 bg-white border-r border-amber-200 overflow-y-auto space-y-5">
            {activeTab === 'curated' ? (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Select a Curated Trail</h4>
                {(Array.isArray(curatedTrails) ? curatedTrails : []).map((trail) => (
                  <button
                    key={trail.id}
                    onClick={() => setSelectedTrail(trail)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedTrail?.id === trail.id
                        ? 'bg-amber-500/10 border-brand-500 ring-2 ring-brand-500/30'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-500 text-white">
                        {trail.badge}
                      </span>
                      <span className="text-xs font-black text-brand-600">{trail.total_distance_km} km</span>
                    </div>
                    <h5 className="text-sm font-black text-slate-900">{trail.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{trail.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Your Custom Stops ({selectedShopIds.length}/4)</h4>
                
                {/* Active Selected Stops */}
                <div className="space-y-2">
                  {(Array.isArray(currentDisplayShops) ? currentDisplayShops : []).map((shop, idx) => (
                    <div key={shop.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">{shop.name}</p>
                          <p className="text-[10px] text-slate-500">{shop.area}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveShopFromCustom(shop.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Available Shop */}
                {selectedShopIds.length < 4 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <h5 className="text-xs font-bold text-slate-700">Add More Spots to Trail:</h5>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {allShops
                        .filter((s) => !selectedShopIds.includes(s.id))
                        .map((shop) => (
                          <button
                            key={shop.id}
                            onClick={() => handleAddShopToCustom(shop.id)}
                            className="w-full p-2 bg-slate-50 hover:bg-amber-100 rounded-lg text-left text-xs font-semibold flex items-center justify-between border border-slate-200 cursor-pointer"
                          >
                            <span>{shop.name} ({shop.area})</span>
                            <Plus className="w-4 h-4 text-brand-600" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Warnings */}
            {customResult?.crowd_warnings?.map((warn, i) => (
              <div key={i} className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {warn}
              </div>
            ))}

            {/* Start Navigation CTA */}
            {gmapsUrl && (
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <Navigation className="w-4 h-4" />
                Start Full Route in Google Maps 🗺️
              </a>
            )}
          </div>

          {/* Leaflet Route Map */}
          <div className="lg:col-span-7 h-full w-full relative">
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

              {polylineCoords.length > 1 && (
                <Polyline
                  positions={polylineCoords}
                  color="#ea580c"
                  weight={5}
                  dashArray="8, 8"
                />
              )}

              {(Array.isArray(currentDisplayShops) ? currentDisplayShops : []).map((shop, idx) => (
                <Marker
                  key={shop.id}
                  position={[shop.latitude || 20.0059, shop.longitude || 73.7898]}
                  icon={createNumberedMarker(idx + 1)}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <p className="font-black text-slate-900">Stop #{idx + 1}: {shop.name}</p>
                      <p className="text-[10px] text-slate-500">{shop.area}, Nashik</p>
                      <p className="text-[10px] font-bold text-amber-700">₹{shop.price_per_plate}/plate</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisalTrailModal;
