import React from 'react';
import { MapPin, Phone, Clock, Flame, Award, Navigation, Share2 } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import SpicyMeter from '../common/SpicyMeter';
import CrowdMeterBadge from './CrowdMeterBadge';
import { formatPrice } from '../../utils/helpers';

export const ShopHeader = ({ shop, onOpenReviewModal, onOpenQueueModal }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${shop.name} - Nashik's Best Misal`,
        text: `🔥 Check out ${shop.name} in ${shop.area}, Nashik! Spicy Level: ${shop.spicy_level}/5 🌶️`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🔥 *${shop.name}* (${shop.area}, Nashik)\n` +
      `🌶️ Spicy Level: ${shop.spicy_level}/5 | ⭐ Rating: ${shop.avg_rating} Stars\n` +
      `📍 Address: ${shop.address}\n\n` +
      `Check details & reviews here:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-6">
      {/* Media Hero */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={shop.main_image_url || "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46"}
          alt={`${shop.name} Nashik`}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {shop.is_sponsored && (
              <span className="badge-sponsored shadow-lg">
                <Award className="w-4 h-4" /> Platinum Featured Spot
              </span>
            )}
            {shop.is_chulhivarchi && (
              <span className="bg-slate-900/90 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 border border-amber-500/30">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" /> Traditional Wood Stove
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black backdrop-blur-md transition-all shadow-md flex items-center gap-1 cursor-pointer"
              title="Share on WhatsApp"
            >
              💬 WhatsApp Share
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Bottom Content */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <CrowdMeterBadge status={shop.crowd_status} onCheckinClick={onOpenQueueModal} />
            <span className="text-xs font-bold bg-amber-400/90 text-slate-900 px-3 py-1 rounded-full">
              {formatPrice(shop.price_per_plate)} / plate
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
            {shop.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{shop.address}, {shop.area}, Nashik</span>
            </div>
            <RatingStars rating={shop.avg_rating} totalReviews={shop.total_reviews} size="md" />
          </div>

          {/* Spicy Meter */}
          <div className="pt-1">
            <SpicyMeter level={shop.spicy_level} size="md" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-amber-100">
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-semibold">
          {shop.opening_time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{shop.opening_time} - {shop.closing_time || '04:00 PM'}</span>
            </div>
          )}
          {shop.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-brand-600" />
              <a href={`tel:${shop.phone}`} className="hover:underline">{shop.phone}</a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {shop.google_maps_url && (
            <a
              href={shop.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <Navigation className="w-4 h-4 text-amber-400" /> Get Directions
            </a>
          )}
          <button
            onClick={onOpenReviewModal}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all transform hover:-translate-y-0.5"
          >
            ★ Write Review & Earn Stamp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
