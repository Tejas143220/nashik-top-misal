import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Check, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import axios from 'axios';
import ShopCard from '../directory/ShopCard';

export const MisalQuizModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [spicePreference, setSpicePreference] = useState(4);
  const [cookingStyle, setCookingStyle] = useState('chulhivarchi');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleQuizSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/v1/quiz/recommend', {
        spice_preference: spicePreference,
        cooking_style: cookingStyle,
        area: area || undefined,
      });
      setResults(data || []);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setSpicePreference(4);
    setCookingStyle('chulhivarchi');
    setArea('');
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quiz Header */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Find Your Perfect Misal</h3>
            <p className="text-xs text-slate-500 font-medium">Interactive AI recommendation wizard</p>
          </div>
        </div>

        {/* Wizard Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">Question 1 of 3</span>
              <h4 className="text-base font-extrabold text-slate-800">How spicy do you like your tari/sample?</h4>
              
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicePreference(lvl)}
                    className={`py-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      spicePreference === lvl
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                        : 'bg-amber-50/50 text-slate-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <span>Lvl {lvl}</span>
                    <span>{lvl > 3 ? '🔥' : '🌶️'}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">Question 2 of 3</span>
              <h4 className="text-base font-extrabold text-slate-800">What is your preferred cooking style & ambience?</h4>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCookingStyle('chulhivarchi')}
                  className={`w-full p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    cookingStyle === 'chulhivarchi'
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                      : 'bg-amber-50/50 text-slate-700 border-amber-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> Authentic Wood Stove (Chulhivarchi)
                  </span>
                  {cookingStyle === 'chulhivarchi' && <Check className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCookingStyle('any')}
                  className={`w-full p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    cookingStyle === 'any'
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                      : 'bg-amber-50/50 text-slate-700 border-amber-200'
                  }`}
                >
                  <span>Any Style (Classic or AC Seating)</span>
                  {cookingStyle === 'any' && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">Question 3 of 3</span>
              <label htmlFor="quiz-area-select" className="text-base font-extrabold text-slate-800 block">Select area in Nashik (Optional)</label>

              <select
                id="quiz-area-select"
                name="quizArea"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs font-semibold bg-amber-50/50 border border-amber-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Any location in Nashik</option>
                <option value="Gangapur Road">Gangapur Road</option>
                <option value="Panchavati">Panchavati</option>
                <option value="College Road">College Road</option>
                <option value="Peth Road">Peth Road</option>
              </select>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleQuizSubmit}
                  disabled={loading}
                  className="w-2/3 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calculate Matches ★'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && results && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900">Your Top Recommended Misal Spots</h4>
                <button
                  onClick={resetQuiz}
                  className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3 h-3" /> Retake Quiz
                </button>
              </div>

              <div className="space-y-4">
                {(Array.isArray(results) ? results : []).map((res) => (
                  <div key={res.shop.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {res.match_percentage}% Match Match
                      </span>
                      <span className="text-slate-500 font-semibold">{res.reason}</span>
                    </div>
                    <ShopCard shop={res.shop} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MisalQuizModal;
