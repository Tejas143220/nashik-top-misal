import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import ShopFilter from '../components/directory/ShopFilter';
import ShopList from '../components/directory/ShopList';
import AdSlot from '../components/common/AdSlot';
import { UtensilsCrossed, Search, X, Flame, MapPin } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

export const DirectoryPage = () => {
  const { searchQuery, setSearchQuery, selectedArea, setSelectedArea, isChulhivarchi, setIsChulhivarchi, spicyLevel, setSpicyLevel } = useFilters();

  return (
    <>
      <SEOHead
        title="All Misal Shops in Nashik - Smart Directory & Filters"
        description="Filter and search all famous misal spots in Nashik. Filter by spicy level (zanzanit), traditional wood stove (chulhivarchi), location, and customer ratings."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Live Search Header */}
        <div className="border-b border-amber-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-7 h-7 text-brand-600 dark:text-amber-400" />
              Nashik Misal Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore authentic misal joints, compare spice levels, and read verified local reviews.
            </p>
          </div>

          {/* Live Search Input */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="directory-search-input"
              name="directorySearch"
              type="text"
              aria-label="Search by shop name, area or landmark"
              placeholder="Search by shop name, area or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-2xl pl-10 pr-9 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Tag Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider mr-1">Quick Filters:</span>
          
          <button
            onClick={() => setIsChulhivarchi(isChulhivarchi === true ? null : true)}
            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              isChulhivarchi === true
                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-slate-800 hover:border-brand-500'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Chulhivarchi Wood Stove
          </button>

          <button
            onClick={() => setSpicyLevel(spicyLevel === 5 ? null : 5)}
            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              spicyLevel === 5
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-slate-800 hover:border-brand-500'
            }`}
          >
            🌶️ Zanzanit Level 5
          </button>

          <button
            onClick={() => setSelectedArea(selectedArea === 'Gangapur Road' ? '' : 'Gangapur Road')}
            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedArea === 'Gangapur Road'
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-slate-800 hover:border-brand-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" /> Gangapur Road
          </button>

          <button
            onClick={() => setSelectedArea(selectedArea === 'Panchavati' ? '' : 'Panchavati')}
            className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedArea === 'Panchavati'
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-amber-200 dark:border-slate-800 hover:border-brand-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" /> Panchavati
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar & Ad Slot */}
          <aside className="lg:col-span-1 space-y-6">
            <ShopFilter />
            {/* Sidebar Monetization Ad Slot */}
            <AdSlot slotName="directory_sidebar" />
          </aside>

          {/* Right Column: Shop Listings Grid */}
          <main className="lg:col-span-3">
            <ShopList />
          </main>
        </div>
      </div>
    </>
  );
};

export default DirectoryPage;
