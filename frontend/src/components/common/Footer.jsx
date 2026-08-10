import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-amber-900/30 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Flame className="w-5 h-5 fill-amber-200" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Nashik's Best Misal
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The #1 directory and review platform for discovering authentic Chulhivarchi, Zanzanit, and heritage Misal joints in Nashik. Rated by locals, built for foodies.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Covering Gangapur Road, Panchavati, College Road & MIDC</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore Spots
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/directory?is_chulhivarchi=true" className="hover:text-brand-400 transition-colors">
                  Chulhivarchi Misal
                </Link>
              </li>
              <li>
                <Link to="/directory?spicy_level=5" className="hover:text-brand-400 transition-colors">
                  Zanzanit (Level 5 Spice)
                </Link>
              </li>
              <li>
                <Link to="/directory?area=Gangapur+Road" className="hover:text-brand-400 transition-colors">
                  Gangapur Road Joints
                </Link>
              </li>
              <li>
                <Link to="/directory?area=Panchavati" className="hover:text-brand-400 transition-colors">
                  Panchavati Misal
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business / Monetization */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              For Shop Owners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/merchant/dashboard" className="hover:text-brand-400 font-black text-emerald-400 transition-colors flex items-center gap-1">
                  <span>🏪 Merchant Coupon Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-brand-400 font-extrabold text-amber-400 transition-colors flex items-center gap-1">
                  <span>⭐ Partner Sponsorship Plans</span>
                </Link>
              </li>
              <li>
                <Link to="/submit-shop" className="hover:text-brand-400 font-semibold transition-colors">
                  Promote Your Misal Shop
                </Link>
              </li>
              <li>
                <a href="/api/v1/seo/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-brand-400 transition-colors">
                  SEO XML Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Nashik's Best Misal Directory. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <span>Website Maker: <strong className="text-amber-400 font-bold">Tejas Thakare</strong></span>
            <span>•</span>
            <span>PhonePe: <strong className="text-white font-mono font-bold">7058638277</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
