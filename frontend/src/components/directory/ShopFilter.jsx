import React, { useEffect, useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { fetchAreas, fetchActivities } from '../../services/api';
import { SPICY_LEVELS } from '../../utils/constants';
import { getUserGPSCoordinates } from '../../utils/geo';
import { Flame, MapPin, RotateCcw, SlidersHorizontal, Compass, Navigation } from 'lucide-react';

export const ShopFilter = () => {
  const {
    selectedArea,
    setSelectedArea,
    spicyLevel,
    setSpicyLevel,
    isChulhivarchi,
    setIsChulhivarchi,
    activitySlug,
    setActivitySlug,
    sortBy,
    setSortBy,
    setUserCoords,
    isNearMeActive,
    setIsNearMeActive,
    resetFilters,
  } = useFilters();

  const [areas, setAreas] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingGeo, setLoadingGeo] = useState(false);

  useEffect(() => {
    fetchAreas().then(setAreas).catch(() => {});
    fetchActivities().then(setActivities).catch(() => {});
  }, []);

  const handleNearMeClick = async () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      setUserCoords(null);
      return;
    }
    setLoadingGeo(true);
    try {
      const coords = await getUserGPSCoordinates();
      setUserCoords(coords);
      setIsNearMeActive(true);
      setSortBy('nearby');
    } catch (_err) {
      alert("Unable to fetch location.");
    } finally {
      setLoadingGeo(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-3">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Smart Misal Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset All
        </button>
      </div>

      {/* Near Me Geo-Location Toggle */}
      <div>
        <button
          type="button"
          onClick={handleNearMeClick}
          className={`w-full py-3 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isNearMeActive
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-amber-100/80 text-amber-950 border-amber-300 hover:bg-amber-200'
          }`}
        >
          {loadingGeo ? <Navigation className="w-4 h-4 animate-spin text-brand-600" /> : <Compass className="w-4 h-4 text-brand-600" />}
          {isNearMeActive ? "📍 Near Me Active (Sorted by Distance)" : "📍 Find Misal Spots Near Me"}
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Results By
        </label>
        <select
          value={isNearMeActive ? 'nearby' : sortBy}
          onChange={(e) => {
            if (e.target.value === 'nearby') {
              handleNearMeClick();
            } else {
              setIsNearMeActive(false);
              setSortBy(e.target.value);
            }
          }}
          className="w-full text-xs font-semibold bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="recommended">⭐ Recommended (Sponsored & Top Rated)</option>
          <option value="nearby">📍 Closest Distance to Me (Geo-GPS)</option>
          <option value="rating">🏆 Highest Rated (5 Stars First)</option>
          <option value="reviews">💬 Most Reviewed</option>
          <option value="price_asc">💰 Price: Low to High</option>
          <option value="price_desc">💰 Price: High to Low</option>
        </select>
      </div>

      {/* Chulhivarchi Wood Stove Toggle */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Cooking Style
        </label>
        <button
          type="button"
          onClick={() => setIsChulhivarchi(isChulhivarchi === true ? null : true)}
          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            isChulhivarchi === true
              ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md'
              : 'bg-amber-50/60 text-slate-700 border-amber-200 hover:border-slate-400'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          Chulhivarchi (Traditional Wood Stove)
        </button>
      </div>

      {/* Spicy Level Filter (1 to 5) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Spicy Level (Zanzanit Meter)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {SPICY_LEVELS.map((s) => (
            <button
              key={s.level}
              onClick={() => setSpicyLevel(spicyLevel === s.level ? null : s.level)}
              title={s.label}
              className={`py-2 text-xs font-extrabold rounded-lg border transition-all flex flex-col items-center justify-center gap-0.5 ${
                spicyLevel === s.level
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                  : 'bg-amber-50/60 text-slate-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>{s.level}</span>
              <span className="text-[10px]">{s.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-brand-600" /> Select Area in Nashik
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full text-xs font-semibold bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Areas across Nashik</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities / Activities */}
      {activities.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Special Facilities
          </label>
          <select
            value={activitySlug}
            onChange={(e) => setActivitySlug(e.target.value)}
            className="w-full text-xs font-semibold bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Facilities</option>
            {activities.map((act) => (
              <option key={act.id} value={act.slug}>
                {act.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ShopFilter;
