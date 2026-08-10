import React, { useState, useEffect, useCallback } from 'react';
import { X, Flame, Share2, Plus, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import triggerConfetti from '../animations/ConfettiBurst';

export const TopFiveRankCardModal = ({ isOpen, onClose }) => {
  const { passport } = useAuth();
  const [allShops, setAllShops] = useState([]);
  const [rankedShopIds, setRankedShopIds] = useState([1, 2, 3, 4, 5]);
  const [copied, setCopied] = useState(false);

  const fetchShops = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/shops/?limit=50');
      setAllShops(data.items || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchShops();
    }
  }, [isOpen, fetchShops]);

  if (!isOpen) return null;

  const shopMap = {};
  allShops.forEach((s) => { shopMap[s.id] = s; });

  const rankedShops = rankedShopIds.map((id) => shopMap[id]).filter(Boolean);
  const userName = passport?.user_name || 'Nashik Foodie';

  const handleAddShop = (id) => {
    if (rankedShopIds.includes(id) || rankedShopIds.length >= 5) return;
    setRankedShopIds([...rankedShopIds, id]);
  };

  const handleRemoveShop = (id) => {
    if (rankedShopIds.length <= 1) {
      alert("Rank at least 1 misal spot.");
      return;
    }
    setRankedShopIds(rankedShopIds.filter((sid) => sid !== id));
  };

  const rankingText = `🏆 ${userName}'s Top 5 Misal Joints in Nashik!\n` +
    rankedShops.map((s, idx) => `#${idx + 1} ${s.name} (${s.area}) - ${s.spicy_level}/5 🌶️`).join('\n') +
    `\n\nFind Nashik's best misal spots on https://nashikmisal.in/`;

  const handleWhatsAppShare = () => {
    triggerConfetti();
    const text = encodeURIComponent(rankingText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(rankingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl relative overflow-hidden border border-amber-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between z-10 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Instagram Story & Social Rank Card
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              My Top 5 Nashik Misal Ranking 👑
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Controls Sidebar */}
          <div className="lg:col-span-5 p-5 bg-white border-r border-amber-200 overflow-y-auto space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Your Top Spots ({rankedShopIds.length}/5)</h4>

            <div className="space-y-2">
              {rankedShops.map((shop, idx) => (
                <div key={shop.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{shop.name}</p>
                      <p className="text-[10px] text-slate-500">{shop.area}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveShop(shop.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add More Shops */}
            {rankedShopIds.length < 5 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h5 className="text-xs font-bold text-slate-700">Add Spot to Top 5:</h5>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {allShops
                    .filter((s) => !rankedShopIds.includes(s.id))
                    .map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleAddShop(shop.id)}
                        className="w-full p-2 bg-slate-50 hover:bg-amber-100 rounded-lg text-left text-xs font-semibold flex items-center justify-between border border-slate-200 cursor-pointer"
                      >
                        <span>{shop.name} ({shop.area})</span>
                        <Plus className="w-4 h-4 text-brand-600" />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Export Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" /> Share My Top 5 on WhatsApp 📲
              </button>

              <button
                onClick={handleCopyText}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Ranking Text 📋"}
              </button>
            </div>
          </div>

          {/* Styled Graphic Card Preview (9:16 Format) */}
          <div className="lg:col-span-7 bg-slate-900 p-6 flex items-center justify-center overflow-y-auto">
            <div className="w-[320px] bg-gradient-to-br from-slate-950 via-brand-950 to-amber-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-amber-500/40 space-y-6 relative overflow-hidden">
              
              {/* Header Badge */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest">
                  <Flame className="w-3.5 h-3.5 fill-amber-300" /> Nashik Misal Guide 🚩
                </div>
                <h4 className="text-lg font-black tracking-tight text-white mt-1">MY TOP 5 MISAL SPOTS</h4>
                <p className="text-[11px] text-amber-200 font-extrabold">Curated by {userName}</p>
              </div>

              {/* Ranked List Card */}
              <div className="space-y-2.5">
                {rankedShops.map((shop, idx) => (
                  <div
                    key={shop.id}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-brand-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                        #{idx + 1}
                      </span>
                      <div>
                        <h5 className="text-xs font-black text-white leading-snug">{shop.name}</h5>
                        <p className="text-[10px] text-amber-200/80">{shop.area}, Nashik</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/30 text-amber-300 shrink-0">
                      {shop.spicy_level}/5 🌶️
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Stamp */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold">Official Misal Passport</span>
                <span className="font-black text-amber-400">nashikmisal.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFiveRankCardModal;
