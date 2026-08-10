import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext';
import MisalQuizModal from '../quiz/MisalQuizModal';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedArea, setSelectedArea, spicyLevel, setSpicyLevel, setIsChulhivarchi } = useFilters();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/directory');
  };

  return (
    <>
      <section className="relative min-h-[600px] sm:min-h-[660px] flex items-center justify-center text-white overflow-hidden border-b-4 border-amber-500/80 shadow-2xl bg-slate-950">
        
        {/* 📸 1. AUTHENTIC HIGH-RES MISAL PAV BACKGROUND PHOTO */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/hero_misal_pav_bg.png"
            alt="Authentic Nashik Misal Pav Thali"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 hover:scale-100 transition-transform duration-1000"
          />
        </div>

        {/* 🎥 2. VIDEO FALLBACK OVERLAY LAYER */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero_misal_pav_bg.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 opacity-40 mix-blend-overlay pointer-events-none"
        >
          <source src="/misal-hero.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-cooking-food-in-a-pot-41555-large.mp4" type="video/mp4" />
        </video>

        {/* 🎥 3. DARK GLASSMORPHIC OVERLAY & RADIAL GLOW */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/70 to-slate-950/95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.35),transparent_70%)] z-10 pointer-events-none" />

        {/* 🌶️ 4. FLOATING SPICE PARTICLES (Framer Motion) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[
            { id: 1, left: '10%', delay: 0, emoji: '🌶️' },
            { id: 2, left: '28%', delay: 1.2, emoji: '🔥' },
            { id: 3, left: '55%', delay: 0.5, emoji: '🌶️' },
            { id: 4, left: '78%', delay: 1.8, emoji: '✨' },
            { id: 5, left: '90%', delay: 0.8, emoji: '🔥' },
          ].map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: [-20, -220], opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, delay: p.delay, ease: 'linear' }}
              className="absolute text-xl sm:text-2xl filter drop-shadow-md select-none transform-gpu"
              style={{ left: p.left }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </div>

        {/* 🚀 5. HERO CONTENT BODY */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 text-center space-y-6">
          
          {/* Top Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full shadow-lg"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>#1 SEO Ranked Nashik Misal Directory</span>
          </motion.div>

          {/* Marathi Main Headline & Subheadline */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-2xl"
            >
              नाशिकची खरी <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent underline decoration-amber-400 decoration-wavy">झणझणीत मिसळ</span> अनुभवा! 🌶️
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-lg text-amber-100/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              Find the best <span className="text-amber-300 font-bold">Chulhivarchi</span>, <span className="text-orange-300 font-bold">Zanzanit (Level 5 Spice)</span>, and unique Misal spots across Gangapur Road, Panchavati, & College Road.
            </motion.p>
          </div>

          {/* 🔍 6. GLASSMORPHIC SEARCH BAR WITH DROPDOWNS */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border-2 border-white/20 p-3 rounded-3xl shadow-2xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-2 text-slate-800"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/90 rounded-2xl sm:rounded-xl">
              <Search className="w-5 h-5 text-brand-600 shrink-0" />
              <input
                type="text"
                placeholder="Search Sadhana, Grape Embassy, Panchavati..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Location Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-2xl sm:rounded-xl">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="">All Areas in Nashik</option>
                <option value="Gangapur Road">Gangapur Road</option>
                <option value="Panchavati">Panchavati</option>
                <option value="College Road">College Road</option>
                <option value="Peth Road">Peth Road</option>
                <option value="Ambad MIDC">Ambad MIDC</option>
              </select>
            </div>

            {/* Spicy Level Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-2xl sm:rounded-xl">
              <Flame className="w-4 h-4 text-red-600 shrink-0" />
              <select
                value={spicyLevel !== null ? spicyLevel : ''}
                onChange={(e) => setSpicyLevel(e.target.value ? Number(e.target.value) : null)}
                className="w-full text-xs font-bold text-slate-900 focus:outline-none bg-transparent cursor-pointer"
              >
                <option value="">All Spice Levels</option>
                <option value="1">Mild (Level 1)</option>
                <option value="2">Medium (Level 2)</option>
                <option value="3">Hot (Level 3)</option>
                <option value="4">Extra Spicy (Level 4)</option>
                <option value="5">Zanzanit 🔥 (Level 5)</option>
              </select>
            </div>

            {/* Marathi Search Button ("सर्च करा") */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-brand-600 via-orange-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white px-7 py-3 rounded-2xl sm:rounded-xl text-xs sm:text-sm font-black shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 cursor-pointer transform-gpu"
            >
              सर्च करा <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.form>

          {/* ⚡ 7. QUICK ACTION PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-extrabold">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brand-700 fill-brand-700" /> "Find Your Perfect Misal" Quiz
            </button>
            <button
              onClick={() => { setIsChulhivarchi(true); navigate('/directory'); }}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-amber-200 px-3.5 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> Wood Stove (Chulhivarchi)
            </button>
            <button
              onClick={() => { setSpicyLevel(5); navigate('/directory'); }}
              className="bg-red-600/80 hover:bg-red-600 border border-red-400 text-white px-3.5 py-2 rounded-full backdrop-blur-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              🌶️ Level 5 Zanzanit
            </button>
          </div>

        </div>
      </section>

      {/* Quiz Modal */}
      <MisalQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </>
  );
};

export default HeroSection;
