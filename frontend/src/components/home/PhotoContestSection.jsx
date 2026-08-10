import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Heart, Trophy, PlusCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const PhotoContestSection = () => {
  const { t, lang } = useLanguage();
  const [contest, setContest] = useState(null);
  const [upvotedIds, setUpvotedIds] = useState([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/contest/leaderboard');
      setContest(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleUpvote = async (photoId) => {
    if (upvotedIds.includes(photoId)) return;
    try {
      await axios.post('/api/v1/contest/upvote', { photo_id: photoId });
      setUpvotedIds((prev) => [...prev, photoId]);
      fetchLeaderboard();
    } catch (_err) {
      alert("Failed to upvote photo.");
    }
  };

  if (!contest) return null;

  return (
    <section className="my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-black uppercase tracking-wider mb-2">
            <Camera className="w-4 h-4 text-purple-700" />
            {t('contestTitle')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'mr' ? 'महिनाभरातील सर्वोत्तम मिसळ थाळी फोटो 📸' : 'Top Voted Misal Thali Photos of the Month'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {t('contestSubtitle')}
          </p>
        </div>

        <Link
          to="/directory"
          className="self-start sm:self-center inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-brand-600 text-white px-5 py-3 rounded-2xl text-xs font-extrabold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {lang === 'mr' ? 'तुमचा फोटो रिव्ह्यू टाका 📸' : 'Submit Your Photo Review'}
        </Link>
      </div>

      {/* Contest Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Array.isArray(contest?.entries) ? contest.entries : []).map((entry) => {
          const hasVoted = upvotedIds.includes(entry.id);
          return (
            <div
              key={entry.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Prize Badge Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black/80 backdrop-blur-md text-amber-300 text-xs font-black px-3 py-1 rounded-full shadow-lg border border-amber-400/30">
                  {entry.badge}
                </span>
              </div>

              <div>
                <div className="h-60 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={entry.photo_url} 
                    alt={entry.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl text-white flex items-center gap-2.5">
                    <img src={entry.avatar_url} alt={entry.foodie_name} className="w-8 h-8 rounded-full border border-amber-400" />
                    <div>
                      <p className="text-xs font-black">{entry.foodie_name}</p>
                      <p className="text-[10px] text-amber-300 font-semibold">{entry.shop_name}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium italic mb-4">
                  "{entry.caption}"
                </p>

                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 flex items-center justify-between text-xs text-purple-900 font-bold mb-4">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-purple-600" /> Prize: {entry.prize}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleUpvote(entry.id)}
                className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  hasVoted 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasVoted ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
                {hasVoted ? `Liked! (${entry.upvotes})` : `Upvote Photo (${entry.upvotes})`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PhotoContestSection;
