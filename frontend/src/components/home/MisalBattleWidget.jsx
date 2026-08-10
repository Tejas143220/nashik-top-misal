import React, { useState, useEffect, useCallback } from 'react';
import { Swords, Share2, CheckCircle, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

export const MisalBattleWidget = () => {
  const { t, lang } = useLanguage();
  const [battle, setBattle] = useState(null);
  const [voted, setVoted] = useState(false);
  const [votedChoice, setVotedChoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBattle = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/battle/current');
      setBattle(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchBattle();
  }, [fetchBattle]);

  const handleVote = async (choice) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      await axios.post('/api/v1/battle/vote', { shop_choice: choice });
      setVoted(true);
      setVotedChoice(choice);
      fetchBattle();
    } catch (_err) {
      alert("Voting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `⚔️ Nashik Misal Battle of the Week!\nVote between ${battle?.shop_a?.name} vs ${battle?.shop_b?.name} on Nashik's Best Misal website!\nVote here: https://nashikmisal.in/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!battle) return null;

  return (
    <section className="my-12">
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-amber-500/30 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Swords className="w-4 h-4 text-brand-500" />
              {t('battleTitle')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {battle.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              {battle.subtitle}
            </p>
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="self-start sm:self-center inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {lang === 'mr' ? 'व्हॉट्सॲपवर शेअर करा 📲' : 'Share Battle on WhatsApp'}
          </button>
        </div>

        {/* Matchup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* VS Badge Divider */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-brand-600 to-amber-500 text-white items-center justify-center font-black text-sm shadow-xl z-10 border-2 border-slate-900">
            VS
          </div>

          {/* Shop A */}
          <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border transition-all ${
            votedChoice === 'a' ? 'border-brand-500 ring-2 ring-brand-500/50 bg-white/15' : 'border-white/10'
          }`}>
            <div className="relative h-44 rounded-xl overflow-hidden mb-4">
              <img 
                src={battle.shop_a.image_url} 
                alt={battle.shop_a.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {battle.shop_a.area}
              </span>
            </div>

            <h3 className="text-xl font-black text-white">{battle.shop_a.name}</h3>

            {/* Voting Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{battle.shop_a.votes} {lang === 'mr' ? 'मते' : 'Votes'}</span>
                <span className="text-amber-400 font-extrabold text-base">{battle.shop_a.pct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-amber-400 rounded-full transition-all duration-700" 
                  style={{ width: `${battle.shop_a.pct}%` }} 
                />
              </div>
            </div>

            <button
              onClick={() => handleVote('a')}
              disabled={voted || loading}
              className={`w-full mt-5 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                votedChoice === 'a' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white shadow-md'
              }`}
            >
              {votedChoice === 'a' ? (
                <> <CheckCircle className="w-4 h-4" /> {lang === 'mr' ? 'तुम्ही याला मत दिले! ✅' : 'You Voted For This! ✅'} </>
              ) : (
                <> <Flame className="w-4 h-4 fill-current" /> {lang === 'mr' ? 'साधना ला मत द्या 🗳️' : 'Vote For Sadhana 🗳️'} </>
              )}
            </button>
          </div>

          {/* Shop B */}
          <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border transition-all ${
            votedChoice === 'b' ? 'border-brand-500 ring-2 ring-brand-500/50 bg-white/15' : 'border-white/10'
          }`}>
            <div className="relative h-44 rounded-xl overflow-hidden mb-4">
              <img 
                src={battle.shop_b.image_url} 
                alt={battle.shop_b.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
              />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {battle.shop_b.area}
              </span>
            </div>

            <h3 className="text-xl font-black text-white">{battle.shop_b.name}</h3>

            {/* Voting Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{battle.shop_b.votes} {lang === 'mr' ? 'मते' : 'Votes'}</span>
                <span className="text-amber-400 font-extrabold text-base">{battle.shop_b.pct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-brand-500 rounded-full transition-all duration-700" 
                  style={{ width: `${battle.shop_b.pct}%` }} 
                />
              </div>
            </div>

            <button
              onClick={() => handleVote('b')}
              disabled={voted || loading}
              className={`w-full mt-5 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                votedChoice === 'b' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md'
              }`}
            >
              {votedChoice === 'b' ? (
                <> <CheckCircle className="w-4 h-4" /> {lang === 'mr' ? 'तुम्ही याला मत दिले! ✅' : 'You Voted For This! ✅'} </>
              ) : (
                <> <Sparkles className="w-4 h-4" /> {lang === 'mr' ? 'ग्रेप एम्बसी ला मत द्या 🗳️' : 'Vote For Grape Embassy 🗳️'} </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Total Votes Cast: <strong className="text-white">{battle.total_votes}</strong></span>
          <span>Voting Closes in: <strong className="text-amber-400">{battle.expires_in_days} Days</strong></span>
        </div>
      </div>
    </section>
  );
};

export default MisalBattleWidget;
