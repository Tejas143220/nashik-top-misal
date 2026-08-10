import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import HeroSection from '../components/home/HeroSection';
import { useFilters } from '../context/FilterContext';
import { fetchShops } from '../services/api';
import ShopCard from '../components/directory/ShopCard';
import AdSlot from '../components/common/AdSlot';
import MisalQuizModal from '../components/quiz/MisalQuizModal';
import MisalTrailModal from '../components/trail/MisalTrailModal';
import BoilingCurryLoader from '../components/animations/BoilingCurryLoader';
import MisalBattleWidget from '../components/home/MisalBattleWidget';
import PerksSection from '../components/home/PerksSection';
import PhotoContestSection from '../components/home/PhotoContestSection';
import { MapPin, Award, ArrowRight, ShieldCheck, Stamp, Sparkles, Navigation, Compass } from 'lucide-react';
import { NASHIK_AREAS } from '../utils/constants';

export const HomePage = () => {
  const navigate = useNavigate();
  const { setSelectedArea } = useFilters();
  const [featuredShops, setFeaturedShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isTrailOpen, setIsTrailOpen] = useState(false);

  useEffect(() => {
    fetchShops({ limit: 6, sort_by: 'recommended' })
      .then((res) => {
        const list = Array.isArray(res) ? res : Array.isArray(res?.items) ? res.items : [];
        setFeaturedShops(list);
      })
      .catch(() => setFeaturedShops([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEOHead
        title="Nashik's Best Misal - नाशिकची खरी झणझणीत मिसळ अनुभवा!"
        description="Discover the best misal spots in Nashik! Experience authentic Chulhivarchi wood stove misal, Zanzanit spicy sample, short video reels, and local reviews."
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Weekend Misal Trail Banner */}
        <section className="bg-gradient-to-r from-amber-900 via-brand-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-500/30">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <Compass className="w-4 h-4 text-brand-500" /> Weekend Food Crawl Feature
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Plan Your Ultimate Weekend Nashik Misal Trail 🗺️
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Visiting Nashik this weekend? Pick 3 iconic spots or choose curated trails (<span className="text-amber-300 font-bold">Chulhivarchi Trail, Kala Rassa Trail</span>) to view connected map routes, travel times, and launch 1-click Google Maps Navigation!
            </p>
          </div>

          <button
            onClick={() => setIsTrailOpen(true)}
            className="shrink-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <Navigation className="w-5 h-5 fill-current" />
            Launch Trail Planner 🗺️
          </button>
        </section>

        {/* Weekly Misal Battle Fan Voting Widget */}
        <MisalBattleWidget />

        {/* Exclusive Digital Coupons & Perks Grid */}
        <PerksSection />

        {/* Snap & Win Photo Contest Leaderboard */}
        <PhotoContestSection />

        {/* Monetization Banner Slot - Hero Header */}
        <AdSlot slotName="homepage_hero_banner" className="w-full shadow-md" />

        {/* Featured Misal Joints Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-amber-200/80 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 flex items-center gap-1">
                <Award className="w-4 h-4" /> Highly Rated & Sponsored
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top Misal Spots in Nashik
              </h2>
            </div>
            <Link
              to="/directory"
              className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              View All Misal Joints ({featuredShops.length}+)
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <BoilingCurryLoader message="Cooking Nashik's featured misal listings..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(featuredShops) ? featuredShops : []).map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </section>

        {/* Digital Passport & Quiz Teaser */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passport Teaser */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 space-y-4 shadow-xl border border-amber-500/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                <Stamp className="w-4 h-4" /> Digital Gamification
              </span>
              <h3 className="text-xl font-black text-white">Digital Misal Passport</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Collect digital stamps by visiting & reviewing spots in Nashik. Unlock badges like <span className="text-amber-300 font-bold">"Spicy Warrior"</span> and <span className="text-amber-300 font-bold">"Nashik Legend"</span>!
              </p>
            </div>
            <Link
              to="/passport"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-all w-fit"
            >
              Open My Passport 🏆
            </Link>
          </div>

          {/* Quiz Teaser */}
          <div className="bg-gradient-to-br from-brand-600 via-orange-600 to-amber-600 text-white rounded-3xl p-8 space-y-4 shadow-xl border border-amber-300/30 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-200 tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-200" /> AI Matching Quiz
              </span>
              <h3 className="text-xl font-black text-white">Find Your Perfect Misal Spot</h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                Not sure where to eat today? Answer 3 quick questions about your spice tolerance, wood stove preference, and location to get instant matches!
              </p>
            </div>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="bg-white text-brand-700 font-black text-xs px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-all w-fit flex items-center gap-2 cursor-pointer"
            >
              Start 1-Min Quiz ✨
            </button>
          </div>
        </section>

        {/* Popular Areas in Nashik Grid */}
        <section className="bg-white rounded-3xl border border-amber-200 p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Misal Joints by Area
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select your favourite location in Nashik to discover nearby misal joints with map directions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {NASHIK_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setSelectedArea(area);
                  navigate('/directory');
                }}
                className="p-4 rounded-2xl bg-amber-50/60 hover:bg-brand-600 text-slate-800 hover:text-white border border-amber-200/80 hover:border-brand-600 font-extrabold text-xs text-center transition-all duration-200 flex flex-col items-center gap-2 group shadow-sm cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors" />
                <span>{area}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Business Claim CTA Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <ShieldCheck className="w-4 h-4" /> Business Owner Program
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Do You Own a Misal Shop in Nashik?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Claim your free business listing or upgrade to <span className="text-amber-300 font-bold">Featured Sponsored Placement</span> to dominate Google search results and attract thousands of tourists every weekend.
            </p>
          </div>
          <Link
            to="/submit-shop"
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105"
          >
            Claim / List Your Shop Now →
          </Link>
        </section>
      </main>

      {/* Quiz Modal */}
      <MisalQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Misal Trail Modal */}
      <MisalTrailModal isOpen={isTrailOpen} onClose={() => setIsTrailOpen(false)} />
    </>
  );
};

export default HomePage;
