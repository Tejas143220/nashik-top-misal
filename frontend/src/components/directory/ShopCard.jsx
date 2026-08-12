import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Flame, Award, ArrowRight, Film, Navigation } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import SpicyMeter from '../common/SpicyMeter';
import CrowdMeterBadge from '../detail/CrowdMeterBadge';
import { formatPrice } from '../../utils/helpers';
import { useFilters } from '../../context/FilterContext';
import { calculateHaversineDistance } from '../../utils/geo';

export const ShopCard = ({ shop }) => {
  const { userCoords } = useFilters();

  let distanceKm = shop.distance_km;
  if (!distanceKm && userCoords && shop.latitude && shop.longitude) {
    distanceKm = calculateHaversineDistance(
      userCoords.lat,
      userCoords.lng,
      shop.latitude,
      shop.longitude
    ).toFixed(1);
  }

  return (
    <div
      className={`group rounded-3xl bg-white transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        shop.is_sponsored
          ? 'sponsored-border ring-2 ring-amber-400/60'
          : 'border border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl'
      }`}
    >
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={shop.main_image_url || "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46"}
            alt={`${shop.name} Nashik`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {shop.is_sponsored ? (
              <span className="badge-sponsored shadow-md">
                <Award className="w-3.5 h-3.5" /> Featured Spot
              </span>
            ) : shop.is_chulhivarchi ? (
              <span className="bg-slate-900/90 text-amber-300 text-[11px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> Wood Stove
              </span>
            ) : <span />}

            {distanceKm ? (
              <span className="bg-emerald-950/90 text-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-full backdrop-blur-md border border-emerald-500/40 flex items-center gap-1 shadow-md">
                <Navigation className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> {distanceKm} km away
              </span>
            ) : shop.video_url ? (
              <span className="bg-slate-900/90 text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md border border-orange-500/40 flex items-center gap-1">
                <Film className="w-3 h-3 text-orange-400" /> 10s Reel
              </span>
            ) : null}
          </div>

          {/* Title & Area Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-lg font-black tracking-tight group-hover:text-amber-200 transition-colors drop-shadow-sm">
              {shop.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-200 font-medium mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{shop.area}, Nashik</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Crowd Meter Badge */}
          <div className="flex items-center justify-between">
            <CrowdMeterBadge status={shop.crowd_status} />
            <span className="text-xs font-black text-slate-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
              {formatPrice(shop.price_per_plate)} / plate
            </span>
          </div>

          {/* Animated Spicy Meter */}
          <div className="pt-1">
            <SpicyMeter level={shop.spicy_level} size="sm" />
          </div>

          {/* Ratings */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <RatingStars rating={shop.avg_rating} totalReviews={shop.total_reviews} size="sm" />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <a
          href={shop.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address + ' Nashik')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 border border-slate-200 dark:border-slate-700"
          title="Open in Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
          <span>Map</span>
        </a>

        <Link
          to={`/misal/${shop.slug}`}
          className="flex-1 py-2.5 px-4 bg-amber-100/80 hover:bg-brand-600 text-brand-900 hover:text-white rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 group/btn shadow-sm"
        >
          View Spot Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
