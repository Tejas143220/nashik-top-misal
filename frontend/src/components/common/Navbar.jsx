import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, UtensilsCrossed, PlusCircle, Menu, X, Sparkles, Stamp, MapPin, Globe, Navigation, User, Camera, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import MisalQuizModal from '../quiz/MisalQuizModal';
import MapViewModal from '../map/MapViewModal';
import MisalTrailModal from '../trail/MisalTrailModal';
import UserProfileModal from './UserProfileModal';
import TopFiveRankCardModal from '../share/TopFiveRankCardModal';
import { fetchShops } from '../../services/api';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTopFiveOpen, setIsTopFiveOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const location = useLocation();
  const { lang, toggleLanguage } = useLanguage();
  const { passport } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    fetchShops({ limit: 50 }).then((res) => setShops(res.items || [])).catch(() => {});
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-amber-200" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 via-orange-600 to-amber-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Nashik's Best Misal
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                  Open Directory • Passport • Map
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="text-xs font-black text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'mr' ? 'मराठी 🚩' : 'English 🌐'}</span>
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="text-xs font-extrabold text-slate-900 bg-amber-200/90 hover:bg-amber-300 px-3 py-1.5 rounded-full border border-amber-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm truncate max-w-[150px]"
                title="Create / Switch Passport Profile"
              >
                <User className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{passport?.user_name ? passport.user_name.split(' ')[0] : 'Profile'}</span>
              </button>

              <button
                onClick={() => setIsTopFiveOpen(true)}
                className="text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-400 hover:to-amber-300 px-3 py-1.5 rounded-full border border-amber-400 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-brand-600" /> Top 5 📸
              </button>

              <button
                onClick={() => setIsTrailOpen(true)}
                className="text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 px-3 py-1.5 rounded-full border border-amber-400 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-700" /> Misal Trail 🗺️
              </button>

              <button
                onClick={() => setIsMapOpen(true)}
                className="text-xs font-bold text-slate-800 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-full border border-amber-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Map
              </button>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="text-xs font-bold text-brand-700 bg-amber-100/80 hover:bg-amber-200/80 px-3 py-1.5 rounded-full border border-amber-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Quiz
              </button>

              <Link
                to="/passport"
                className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                  location.pathname === '/passport' ? 'text-brand-600 font-extrabold' : 'text-slate-700 hover:text-brand-600'
                }`}
              >
                <Stamp className="w-4 h-4 text-brand-600" /> Passport
              </Link>

              <Link
                to="/directory"
                className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                  location.pathname === '/directory' ? 'text-brand-600 font-extrabold' : 'text-slate-700 hover:text-brand-600'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" /> All Spots
              </Link>

              <Link
                to="/submit-shop"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white px-3.5 py-2 rounded-full text-xs font-extrabold shadow-md shadow-brand-500/20 hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Add Shop
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-brand-600 hover:bg-amber-50 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-amber-200 px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <button
              onClick={() => { setIsOpen(false); setIsTopFiveOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-amber-950 flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-brand-600" /> My Top 5 Instagram Story Card Generator 📸
            </button>
            <button
              onClick={() => { setIsOpen(false); setIsProfileOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-slate-900 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-brand-600" /> Switch / Create Passport Profile (👤 {passport?.user_name})
            </button>
            <button
              onClick={() => { setIsOpen(false); setIsTrailOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-amber-900 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-brand-600" /> Weekend Misal Trail Route Planner 🗺️
            </button>
            <button
              onClick={() => { setIsOpen(false); setIsMapOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-slate-800 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-brand-600" /> Live Misal Map
            </button>
            <button
              onClick={() => { setIsOpen(false); setIsQuizOpen(true); }}
              className="w-full text-left py-2 text-sm font-bold text-brand-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" /> Misal Matching Quiz
            </button>
            <Link
              to="/passport"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-brand-600"
            >
              🏆 Digital Misal Passport & Badges
            </Link>
            <Link
              to="/directory"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-brand-600"
            >
              All Misal Spots
            </Link>
            <Link
              to="/submit-shop"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-bold text-brand-600"
            >
              + Add Shop / Claim Business
            </Link>
          </div>
        )}
      </header>

      {/* Quiz Modal */}
      <MisalQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* Map View Modal */}
      <MapViewModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} shops={shops} />

      {/* Misal Trail Modal */}
      <MisalTrailModal isOpen={isTrailOpen} onClose={() => setIsTrailOpen(false)} />

      {/* User Profile Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Top Five Rank Card Modal */}
      <TopFiveRankCardModal isOpen={isTopFiveOpen} onClose={() => setIsTopFiveOpen(false)} />
    </>
  );
};

export default Navbar;
