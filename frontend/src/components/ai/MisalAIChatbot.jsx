import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRESET_CHIPS = [
  "🌶️ Zanzanit Extra Spicy + Jalebi",
  "🪵 Wood Stove (Chulhivarchi) Special",
  "👨‍👩‍👧 Family Garden Seating & Parking",
  "🖤 Kala Rassa (Black Gravy) Special",
  "💰 Budget Misal Under ₹100",
  "📜 History of Nashik Misal"
];

// Comprehensive Multi-Intent Knowledge & AI Matcher Engine
const matchMisalIntent = (query) => {
  const q = query.toLowerCase().trim();

  // 1. Creator & Developer Enquiries
  if (q.includes('creator') || q.includes('developer') || q.includes('who made') || q.includes('tejas') || q.includes('owner') || q.includes('phonepe')) {
    return {
      text: '👨‍💻 This platform was designed and developed by Lead Developer Tejas Thakare! Contact: 7058638277 (UPI: 7058638277@ybl) for sponsorship or business listings.',
      linkUrl: '/pricing',
      linkText: 'View Sponsorship Plans →'
    };
  }

  // 2. Merchant & Coupon Redemption
  if (q.includes('merchant') || q.includes('redemption') || q.includes('coupon code') || q.includes('portal') || q.includes('voucher')) {
    return {
      text: '🏪 Misal Shop Merchants can verify & redeem customer vouchers at the Merchant Portal! Enter Demo PIN: 7058.',
      linkUrl: '/merchant/dashboard',
      linkText: 'Open Merchant Portal →'
    };
  }

  // 3. Price & Budget Enquiries
  if (q.includes('budget') || q.includes('cheap') || q.includes('100') || q.includes('80') || q.includes('150') || q.includes('price') || q.includes('cost')) {
    return {
      text: '💰 Budget Misal Guide: Tatus Misal and Shamsundar Misal offer delicious authentic thalis for under ₹90–₹100 with free unlimited tarri refills!',
      linkUrl: '/directory?price_desc=false',
      linkText: 'View Budget Misal Spots →'
    };
  }

  // 4. Wood Stove / Chulhivarchi / Smoky Flavor
  if (q.includes('chulhi') || q.includes('wood') || q.includes('stove') || q.includes('smoky') || q.includes('traditional') || q.includes('matka') || q.includes('earthen')) {
    return {
      text: '🪵 Wood Stove (Chulhivarchi) Legend: Visit Sadhana Chulhivarchi Misal on Gangapur Road for authentic wood-fired cooking served in earthen pots with hot Jalebi & Solkadhi!',
      linkUrl: '/misal/sadhana-chulhivarchi-misal-nashik',
      linkText: 'View Sadhana Chulhivarchi →'
    };
  }

  // 5. Spice Levels & Zanzanit
  if (q.includes('spicy') || q.includes('zanzanit') || q.includes('tikhat') || q.includes('fire') || q.includes('extra spicy') || q.includes('hot')) {
    return {
      text: '🔥 Level 5 Zanzanit Spice: Grape Embassy Misal (Peth Road) and Shamsundar Misal deliver an unmatched spicy kick! Pro-tip: Order a bowl of Dahi (curd) or Jalebi to balance the heat.',
      linkUrl: '/misal/grape-embassy-misal-nashik',
      linkText: 'View Grape Embassy →'
    };
  }

  // 6. Kala Rassa (Black Gravy) vs Red Gravy
  if (q.includes('kala') || q.includes('black') || q.includes('rassa') || q.includes('sample') || q.includes('tarri') || q.includes('gravy')) {
    return {
      text: '🖤 Authentic Kala Rassa: Shamsundar Misal in Panchavati specializes in rich, dark roasted coconut & dry spice Kala Rassa passed down for over 40 years.',
      linkUrl: '/misal/shamsundar-misal-panchavati-nashik',
      linkText: 'View Shamsundar Kala Rassa →'
    };
  }

  // 7. Mild / Kids / Non-Spicy
  if (q.includes('mild') || q.includes('kids') || q.includes('sweet') || q.includes('less spicy') || q.includes('child')) {
    return {
      text: '🍦 Mild & Family Friendly: Perachi Wadi Misal offers mild, flavorful rassa options along with fresh Solkadhi, Jalebi, and guava fruit salad for children.',
      linkUrl: '/misal/perachi-wadi-misal-nashik',
      linkText: 'View Perachi Wadi →'
    };
  }

  // 8. Family Garden Seating & Ambiance
  if (q.includes('garden') || q.includes('family') || q.includes('parking') || q.includes('play') || q.includes('outdoor') || q.includes('ambiance')) {
    return {
      text: '👨‍👩‍👧 Family Garden Spots: Perachi Wadi and Grape Embassy feature sprawling guava orchard dining, spacious parking, and outdoor play areas for kids.',
      linkUrl: '/directory?area=Gangapur+Road',
      linkText: 'View Family Garden Spots →'
    };
  }

  // 9. Location & Areas (Panchavati, Gangapur Road, Peth Road, College Road)
  if (q.includes('panchavati') || q.includes('gangapur') || q.includes('peth') || q.includes('college road') || q.includes('someshwar') || q.includes('satpur') || q.includes('near me')) {
    return {
      text: '📍 Location Guide: Panchavati is famous for Shamsundar & Ambika; Gangapur Road hosts Sadhana & Perachi Wadi; Peth Road features Grape Embassy!',
      linkUrl: '/directory',
      linkText: 'Explore Interactive Misal Map →'
    };
  }

  // 10. Combos (Jalebi, Solkadhi, Curd, Papad)
  if (q.includes('jalebi') || q.includes('solkadhi') || q.includes('dahi') || q.includes('curd') || q.includes('combo') || q.includes('papad')) {
    return {
      text: '😋 Classic Nashik Combo: Hot crisp Jalebi + Spicy Misal + Chilled Solkadhi is the ultimate Maharashtrian breakfast tradition! Offered at all top featured spots.',
      linkUrl: '/passport',
      linkText: 'View Passport Deals & Perks →'
    };
  }

  // 11. History & Culture of Nashik Misal
  if (q.includes('history') || q.includes('why') || q.includes('famous') || q.includes('origin') || q.includes('farsan') || q.includes('culture') || q.includes('matki')) {
    return {
      text: '📜 History of Nashik Misal: Originating as a hearty breakfast for farm workers, Nashik Misal stands out for its sprouted moth beans (matki), spicy tarri, crisp farsan, and sweet Jalebi pairing!',
      linkUrl: '/trail',
      linkText: 'Explore Weekend Misal Trails →'
    };
  }

  // 12. Timings & Opening Hours
  if (q.includes('timing') || q.includes('time') || q.includes('open') || q.includes('morning') || q.includes('7am') || q.includes('sunday') || q.includes('breakfast')) {
    return {
      text: '⏰ Timings: Most misal joints in Nashik open early at 7:00 AM – 8:00 AM and serve until 3:00 PM. Weekend rush is highest between 9:30 AM – 12:30 PM.',
      linkUrl: '/directory',
      linkText: 'Check Live Crowd Timers →'
    };
  }

  // Fallback AI Response
  return {
    text: `🍲 Great question! Nashik has over 50+ iconic misal joints ranging from traditional wood-stove spots to lush garden restaurants. Explore our directory or passport!`,
    linkUrl: '/directory',
    linkText: 'Browse All Misal Spots →'
  };
};

export const MisalAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'नमस्कार! I am Misal AI 🤖. Ask me anything about Nashik misal spots, spice levels, wood stoves, family garden seating, prices, or combos!',
    },
  ]);

  const handleProcessQuery = (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    const aiResult = matchMisalIntent(queryText);

    const newAiMsg = {
      sender: 'ai',
      text: aiResult.text,
      linkUrl: aiResult.linkUrl,
      linkText: aiResult.linkText
    };

    setMessages((prev) => [...prev, userMsg, newAiMsg]);
    setInputText('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleProcessQuery(inputText);
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'नमस्कार! I am Misal AI 🤖. Ask me anything about Nashik misal spots, spice levels, wood stoves, family garden seating, prices, or combos!',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-brand-600 to-amber-600 text-white p-3.5 rounded-full shadow-2xl border-2 border-amber-300 flex items-center gap-2 font-black text-xs cursor-pointer"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline">Misal AI 🤖</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl border-2 border-amber-300 shadow-2xl flex flex-col overflow-hidden text-slate-800"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black flex items-center gap-1">
                    Misal AI Assistant <Sparkles className="w-3 h-3 text-amber-300" />
                  </h4>
                  <span className="text-[10px] text-amber-300 font-semibold">Online • Multi-Intent Knowledge Engine</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleReset} title="Reset Chat" className="text-slate-300 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips Subheader */}
            <div className="bg-amber-50 p-2.5 border-b border-amber-200 overflow-x-auto flex gap-1.5 scrollbar-none">
              {PRESET_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessQuery(chip)}
                  className="bg-white hover:bg-amber-100 text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300 shrink-0 shadow-sm transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="p-4 space-y-3 h-72 overflow-y-auto bg-amber-50/30 text-xs">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] font-medium ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white font-bold rounded-br-none shadow-sm'
                        : 'bg-white border border-amber-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.linkUrl && (
                    <Link
                      to={msg.linkUrl}
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] font-black text-brand-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full border border-amber-300 shadow-sm transition-all"
                    >
                      {msg.linkText || 'View Recommended Spot →'}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-amber-200 flex gap-2">
              <input
                id="chatbot-message-input"
                name="chatMessage"
                type="text"
                aria-label="Ask Misal AI Chatbot"
                placeholder="Ask anything: e.g. history, spicy, garden, timing..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs bg-amber-50/60 border border-amber-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MisalAIChatbot;
