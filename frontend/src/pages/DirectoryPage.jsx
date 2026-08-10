import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import ShopFilter from '../components/directory/ShopFilter';
import ShopList from '../components/directory/ShopList';
import AdSlot from '../components/common/AdSlot';
import { UtensilsCrossed } from 'lucide-react';

export const DirectoryPage = () => {
  return (
    <>
      <SEOHead
        title="All Misal Shops in Nashik - Smart Directory & Filters"
        description="Filter and search all famous misal spots in Nashik. Filter by spicy level (zanzanit), traditional wood stove (chulhivarchi), location, and customer ratings."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title Header */}
        <div className="border-b border-amber-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-7 h-7 text-brand-600" />
              Nashik Misal Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Explore authentic misal joints, compare spice levels, and read verified local reviews.
            </p>
          </div>
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
