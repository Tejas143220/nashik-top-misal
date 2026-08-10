import React from 'react';
import SEOHead from '../components/seo/SEOHead';
import { useAuth } from '../context/AuthContext';
import PassportCard from '../components/gamification/PassportCard';
import BoilingCurryLoader from '../components/animations/BoilingCurryLoader';
import { Stamp, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PassportPage = () => {
  const { passport, loading } = useAuth();

  return (
    <>
      <SEOHead
        title="Digital Misal Passport & Badges - Nashik's Best Misal"
        description="Track your misal journey across Nashik! Collect digital stamps, unlock achievement badges like Spicy Warrior, and earn food rewards."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300">
            <Stamp className="w-3.5 h-3.5 text-brand-600" /> Digital Misal Passport
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Your Nashik Misal Achievements & Badges 🏆
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Review misal spots across Nashik to collect virtual stamps, level up your Foodie Rank, and unlock free discount vouchers & food perks!
          </p>
        </div>

        {loading ? (
          <BoilingCurryLoader message="Loading your Misal Passport..." />
        ) : (
          <PassportCard passport={passport} />
        )}

        {/* CTA Banner */}
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-center space-y-3">
          <h3 className="text-base font-black text-slate-900">Want to earn another stamp for your passport?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Visit any misal spot in Nashik and submit your review with a thali photo to automatically earn your next stamp!
          </p>
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" /> Browse Spots & Write Review
          </Link>
        </div>
      </div>
    </>
  );
};

export default PassportPage;
