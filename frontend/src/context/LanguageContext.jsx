import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    siteTitle: "Nashik's Best Misal",
    tagline: "Open Directory • Passport • Map",
    heroTitlePrefix: "Discover Nashik's Real",
    heroTitleHighlight: "Zanzanit Misal",
    heroTitleSuffix: "Joints",
    heroSub: "The #1 authentic guide to wood-stove Chulhivarchi, Kala Rassa, and iconic Misal Pav joints across Nashik. Rated by locals, built for foodies.",
    searchPlaceholder: "Search Sadhana, Gangapur Road, Zanzanit...",
    filterAll: "All Spots",
    filterChulhivarchi: "Wood Stove (चुलीवरची)",
    filterLevel5: "Level 5 Zanzanit 🌶️",
    navMap: "Live Map 🗺️",
    navQuiz: "Misal Quiz",
    navPricing: "Pricing & Plans",
    navPassport: "Passport",
    navAllSpots: "All Spots",
    navAddShop: "Add Shop",
    battleTitle: "Weekly Misal Battle ⚔️",
    battleSubtitle: "Cast your vote for Nashik's favorite Misal joint this week!",
    couponsTitle: "Exclusive Perks & Offers 🎟️",
    couponsSubtitle: "Show these digital vouchers at partner spots to claim free sweets & discounts!",
    contestTitle: "Snap & Win Photo Contest 📸",
    contestSubtitle: "Post your Misal thali photos & win free monthly misal passes!",
    makerCredit: "Website Maker: Tejas Thakare • PhonePe: 7058638277"
  },
  mr: {
    siteTitle: "नाशिकची सर्वोत्तम मिसळ",
    tagline: "ओपन डिरेक्टरी • पासपोर्ट • नकाशा",
    heroTitlePrefix: "अनुभवा नाशिकची खरी",
    heroTitleHighlight: "झणझणीत मिसळ",
    heroTitleSuffix: "आणि स्पेशल स्पॉट्स",
    heroSub: "नाशिकमधील ऑथेन्टिक चुलीवरची, काळा रस्सा आणि प्रसिद्ध मिसळ पावांची #1 मार्गदर्शिका. स्थानिक खवय्यांनी रेट केलेले स्पॉट्स.",
    searchPlaceholder: "साधना, गंगापूर रोड, झणझणीत शोधा...",
    filterAll: "सर्व स्पॉट्स",
    filterChulhivarchi: "चुलीवरची मिसळ 🔥",
    filterLevel5: "५/५ झणझणीत 🌶️",
    navMap: "लाइव्ह नकाशा 🗺️",
    navQuiz: "मिसळ क्विझ",
    navPricing: "प्लान्स व प्राईसिंग",
    navPassport: "पासपोर्ट",
    navAllSpots: "सर्व स्पॉट्स",
    navAddShop: "+ शॉप जोडा",
    battleTitle: "आठवड्याची महा मिसळ बॅटल ⚔️",
    battleSubtitle: "या आठवड्यातील तुमच्या आवडत्या नाशिकच्या मिसळ शॉपला मत द्या!",
    couponsTitle: "खास ऑफर्स व कूपन्स 🎟️",
    couponsSubtitle: "पार्टनर शॉपवर हे डिजिटल व्हाउचर्स दाखवा आणि मोफत जिलेबी व डिस्काउंट मिळवा!",
    contestTitle: "फोटो टाका व जिंका स्पेशल बक्षीस 📸",
    contestSubtitle: "तुमचा मिसळ थाळी फोटो अपलोड करा आणि मोफत पास व कूपन्स जिंका!",
    makerCredit: "वेबसाईट मेकर: तेजस ठाकरे • फोनपे: 7058638277"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('mr'); // Default to Marathi for local flavor

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'mr' ? 'en' : 'mr'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
