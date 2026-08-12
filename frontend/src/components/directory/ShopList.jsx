import React, { useEffect, useState } from 'react';
import { useFilters } from '../../context/FilterContext';
import { fetchShops } from '../../services/api';
import ShopCard from './ShopCard';
import AdSlot from '../common/AdSlot';
import { Flame, Loader2, Frown } from 'lucide-react';

export const ShopList = () => {
  const {
    searchQuery,
    selectedArea,
    spicyLevel,
    isChulhivarchi,
    activitySlug,
    sortBy,
    page,
    setPage,
  } = useFilters();

  const [shopsData, setShopsData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {
      skip: (page - 1) * 12,
      limit: 12,
      search: searchQuery || undefined,
      area: selectedArea || undefined,
      spicy_level: spicyLevel !== null ? spicyLevel : undefined,
      is_chulhivarchi: isChulhivarchi !== null ? isChulhivarchi : undefined,
      activity_slug: activitySlug || undefined,
      sort_by: sortBy,
    };

    fetchShops(params)
      .then((data) => setShopsData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedArea, spicyLevel, isChulhivarchi, activitySlug, sortBy, page]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <p className="text-sm font-bold text-slate-600">
          Fetching Nashik's finest misal spots...
        </p>
      </div>
    );
  }

  const itemsList = Array.isArray(shopsData?.items) ? shopsData.items : [];

  if (itemsList.length === 0) {
    return (
      <div className="min-h-[400px] bg-white rounded-2xl border border-dashed border-amber-300 p-8 text-center flex flex-col items-center justify-center space-y-3">
        <Frown className="w-12 h-12 text-amber-500" />
        <h3 className="text-base font-extrabold text-slate-800">
          No Misal Spots Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          No shops match your active filter criteria. Try resetting the spice level or selecting a broader area.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Result Count */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-amber-100/50 px-4 py-2 rounded-xl border border-amber-200/60">
        <span>Showing {itemsList.length} of {shopsData?.total || itemsList.length} Misal Joints</span>
        {itemsList.some((s) => s.is_sponsored) && (
          <span className="text-amber-800 font-extrabold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-brand-600 fill-brand-600" /> Featured Placements Active
          </span>
        )}
      </div>

      {/* Grid of Shop Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(shopsData?.items) ? shopsData.items : []).map((shop, index) => (
          <React.Fragment key={shop.id}>
            <ShopCard shop={shop} />

            {/* In-feed Monetization Ad Slot after every 4th item */}
            {(index + 1) % 4 === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 my-2">
                <AdSlot slotName="in_feed_ad" className="w-full" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Pagination Controls */}
      {shopsData.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: shopsData.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                page === p
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;
