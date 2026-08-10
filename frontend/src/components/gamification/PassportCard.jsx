import React, { useState } from 'react';
import { Award, Stamp, CheckCircle2, Share2, Sparkles, Gift, Zap, ArrowRight, Camera } from 'lucide-react';
import BadgeGrid from './BadgeGrid';
import { Link } from 'react-router-dom';
import TopFiveRankCardModal from '../share/TopFiveRankCardModal';

export const PassportCard = ({ passport }) => {
  const [isTopFiveOpen, setIsTopFiveOpen] = useState(false);

  const userName = passport?.user_name || "Nashik Foodie";
  const stampsList = passport?.stamps || [];
  const badgesList = passport?.badges || [];
  const totalStamps = passport?.total_stamps || stampsList.length || 0;

  // Level Rank Calculation
  let levelName = "Rookie Misal Explorer 🧭";
  let currentLevel = 1;
  let nextTarget = 3;
  let prevTarget = 0;

  if (totalStamps >= 8) {
    levelName = "Nashik Misal Legend 🏆";
    currentLevel = 4;
    nextTarget = 8;
    prevTarget = 8;
  } else if (totalStamps >= 5) {
    levelName = "Spicy Veteran 🔥";
    currentLevel = 3;
    nextTarget = 8;
    prevTarget = 5;
  } else if (totalStamps >= 3) {
    levelName = "Tarri Enthusiast 🌶️";
    currentLevel = 2;
    nextTarget = 5;
    prevTarget = 3;
  }

  const progressPct = currentLevel === 4 
    ? 100 
    : Math.min(100, Math.round(((totalStamps - prevTarget) / (nextTarget - prevTarget)) * 100));

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🏆 My Official Nashik Misal Passport!\nName: ${userName}\nRank: Level ${currentLevel} - ${levelName}\nStamps Collected: ${totalStamps} 🏷️\nCheck out Nashik's Best Misal Guide: https://nashikmisal.in/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl border border-amber-500/30 relative overflow-hidden">
        {/* Decorative Stamp Seal */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <Stamp className="w-48 h-48 text-amber-300" />
        </div>

        {/* Passport Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 border-b border-slate-700 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-amber-300 shrink-0">
              {userName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                OFFICIAL NASHIK MISAL PASSPORT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{userName}</h2>
              <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Level {currentLevel}: {levelName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[9px] uppercase font-bold text-amber-300 block">Stamps</span>
              <span className="text-lg font-black text-white">{totalStamps} 🏷️</span>
            </div>

            <button
              onClick={() => setIsTopFiveOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" /> Create Top 5 Story 📸
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Share 📲
            </button>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span className="text-amber-300">Level {currentLevel} Progression</span>
            <span className="text-white">
              {currentLevel === 4 ? "Max Level Reached! 🏆" : `${totalStamps} / ${nextTarget} Stamps (${progressPct}%)`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 via-amber-400 to-orange-400 rounded-full transition-all duration-700" 
              style={{ width: `${progressPct}%` }} 
            />
          </div>
          <p className="text-[11px] text-slate-300">
            {currentLevel === 4 
              ? "Congratulations! You have achieved the highest foodie status in Nashik!" 
              : `Collect ${nextTarget - totalStamps} more stamp${nextTarget - totalStamps > 1 ? 's' : ''} to unlock Level ${currentLevel + 1}!`}
          </p>
        </div>

        {/* Unlocked Foodie Perk Rewards */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Gift className="w-4 h-4" /> Unlocked Food Perks & Voucher Deals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-2xl border transition-all ${
              totalStamps >= 1 ? 'bg-amber-500/15 border-amber-400/40 text-white' : 'bg-white/5 border-white/10 opacity-50'
            }`}>
              <span className="text-[9px] font-black uppercase text-amber-300 px-2 py-0.5 rounded bg-amber-400/20">
                {totalStamps >= 1 ? 'UNLOCKED ✅' : 'LOCKED 🔒'}
              </span>
              <h4 className="text-xs font-black text-white mt-2">Free Solkadhi Glass 🥤</h4>
              <p className="text-[10px] text-slate-300 mt-1">Claimable with 1+ stamp at partner joints.</p>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              totalStamps >= 3 ? 'bg-amber-500/15 border-amber-400/40 text-white' : 'bg-white/5 border-white/10 opacity-50'
            }`}>
              <span className="text-[9px] font-black uppercase text-amber-300 px-2 py-0.5 rounded bg-amber-400/20">
                {totalStamps >= 3 ? 'UNLOCKED ✅' : 'LOCKED (3 STAMPS) 🔒'}
              </span>
              <h4 className="text-xs font-black text-white mt-2">Free Hot Jalebi Plate 🍮</h4>
              <p className="text-[10px] text-slate-300 mt-1">Claimable at Sadhana Chulhivarchi Misal.</p>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              totalStamps >= 5 ? 'bg-amber-500/15 border-amber-400/40 text-white' : 'bg-white/5 border-white/10 opacity-50'
            }`}>
              <span className="text-[9px] font-black uppercase text-amber-300 px-2 py-0.5 rounded bg-amber-400/20">
                {totalStamps >= 5 ? 'UNLOCKED ✅' : 'LOCKED (5 STAMPS) 🔒'}
              </span>
              <h4 className="text-xs font-black text-white mt-2">15% Off Total Bill 🍇</h4>
              <p className="text-[10px] text-slate-300 mt-1">Claimable for group dining above ₹500.</p>
            </div>
          </div>
        </div>

        {/* Next Spot Challenge Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-amber-900 to-slate-900 p-4 rounded-2xl border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-white">Next Misal Challenge</h4>
              <p className="text-[11px] text-slate-300">Visit and review 1 more Chulhivarchi wood stove spot to unlock your next badge!</p>
            </div>
          </div>
          <Link
            to="/directory"
            className="shrink-0 bg-white text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-amber-100 transition-all flex items-center gap-1"
          >
            Explore Misal Spots <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Achievement Badges Grid */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Unlocked Achievement Badges
          </h3>
          <BadgeGrid badges={badgesList} />
        </div>

        {/* Stamps Visited Grid */}
        <div className="space-y-3 relative z-10 pt-4 border-t border-slate-700">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Stamp className="w-4 h-4" /> Stamp Collection ({stampsList.length})
          </h3>
          {stampsList.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No stamps collected yet. Write a review to earn your first stamp!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stampsList.map((stamp) => (
                <div
                  key={stamp.id}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/40">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{stamp.shop_name}</h4>
                    <span className="text-[10px] text-amber-200">{stamp.shop_area || 'Nashik'}, Nashik</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Modal */}
      <TopFiveRankCardModal isOpen={isTopFiveOpen} onClose={() => setIsTopFiveOpen(false)} />
    </>
  );
};

export default PassportCard;
