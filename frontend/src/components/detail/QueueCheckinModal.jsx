import React, { useState } from 'react';
import { X, Clock, Users, MessageSquare, Check, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import triggerConfetti from '../animations/ConfettiBurst';

const WAIT_OPTIONS = [
  { mins: 5, label: "0-5 Mins", desc: "Quick Table Available", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { mins: 15, label: "15 Mins", desc: "Moderate Queue", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { mins: 30, label: "30 Mins", desc: "Heavy Peak Rush", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { mins: 45, label: "45+ Mins", desc: "Packed Weekend Crowd", color: "bg-rose-100 text-rose-800 border-rose-300" }
];

export const QueueCheckinModal = ({ isOpen, onClose, shop, onCheckinSuccess }) => {
  const { passport } = useAuth();
  const [selectedMins, setSelectedMins] = useState(15);
  const [selectedCrowd, setSelectedCrowd] = useState('moderate');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !shop) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/v1/queue/checkin', {
        shop_id: shop.id,
        reporter_name: passport?.user_name || 'Nashik Foodie',
        wait_time_mins: selectedMins,
        crowd_level: selectedCrowd,
        comment: comment.trim() || undefined
      });

      triggerConfetti();
      if (onCheckinSuccess) onCheckinSuccess();
      onClose();
    } catch (_err) {
      alert("Failed to submit check-in report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden border border-amber-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-brand-600 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Community Crowd Reporter
            </div>
            <h3 className="text-xl font-black text-slate-900">Check-In Live Wait Time ⏱️</h3>
            <p className="text-xs text-amber-700 font-bold">{shop.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Wait Time Options */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4 text-brand-600" /> Current Queue Wait Time *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WAIT_OPTIONS.map((opt) => (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => {
                    setSelectedMins(opt.mins);
                    setSelectedCrowd(opt.mins <= 5 ? 'low' : opt.mins <= 15 ? 'moderate' : opt.mins <= 30 ? 'crowded' : 'full');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    selectedMins === opt.mins
                      ? 'ring-2 ring-brand-500 shadow-md scale-102 ' + opt.color
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black">{opt.label}</span>
                    {selectedMins === opt.mins && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold block opacity-80 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Crowd Level */}
          <div>
            <label htmlFor="queue-crowd-level" className="block text-xs font-black uppercase text-slate-500 mb-1 flex items-center gap-1">
              <Users className="w-4 h-4 text-brand-600" /> Crowd Level
            </label>
            <select
              id="queue-crowd-level"
              name="crowdLevel"
              value={selectedCrowd}
              onChange={(e) => setSelectedCrowd(e.target.value)}
              className="w-full p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="low">🟢 Low Rush (Comfortable Seating)</option>
              <option value="moderate">🟡 Moderate Rush (10-15 Min Table Wait)</option>
              <option value="crowded">🟠 Heavy Queue (20-35 Min Waiting Area)</option>
              <option value="full">🔴 Packed (Standing Room Only)</option>
            </select>
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="queue-note-comment" className="block text-xs font-black uppercase text-slate-500 mb-1 flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-brand-600" /> Live Update Note (Optional)
            </label>
            <input
              id="queue-note-comment"
              name="queueComment"
              type="text"
              placeholder="e.g., Wood stove active, 10 table queue!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            {submitting ? "Submitting Check-In..." : "Submit Live Check-In Report ⏱️"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QueueCheckinModal;
