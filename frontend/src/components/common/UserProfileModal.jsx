import React, { useState } from 'react';
import { X, User, Mail, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import triggerConfetti from '../animations/ConfettiBurst';

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
];

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { passport, createOrLoginProfile, switchProfile } = useAuth();
  const [fullName, setFullName] = useState(passport?.user_name || '');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSubmitting(true);
    try {
      await createOrLoginProfile(fullName.trim(), email.trim(), selectedAvatar);
      triggerConfetti();
      onClose();
    } catch (_err) {
      alert("Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden border border-amber-200">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-brand-600 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Foodie Passport Profile
            </div>
            <h3 className="text-xl font-black text-slate-900">Create / Switch My Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Your Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Tejas Thakare"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Email Address (Optional)</label>
            <div className="relative">
              <input
                type="email"
                placeholder="tejas@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-2">Choose Avatar Icon</label>
            <div className="flex items-center gap-3">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all relative ${
                    selectedAvatar === url ? 'border-brand-600 ring-2 ring-brand-500/50 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  {selectedAvatar === url && (
                    <div className="absolute inset-0 bg-brand-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white font-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Profile Switcher */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 block">Switch to Demo Profiles:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { switchProfile(1); onClose(); }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200"
              >
                Rajesh Patil (Default)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {submitting ? "Saving Profile..." : "Save Profile & Launch Passport 🏆"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
