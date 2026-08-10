import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Gift, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import CouponClaimModal from '../coupons/CouponClaimModal';
import axios from 'axios';

export const PerksSection = () => {
  const { t, lang } = useLanguage();
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/coupons/');
      setCoupons(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <section className="my-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Ticket className="w-4 h-4 text-brand-600" />
            {t('couponsTitle')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'mr' ? 'अॅक्सेस करा पार्टनर शॉप्सचे खास डिस्काउंट व कूपन्स 🎟️' : 'Claim Exclusive Perks & Digital Coupons'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {t('couponsSubtitle')}
          </p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {item.badge}
              </span>
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Exp: {item.expiry_date}
              </span>
            </div>

            <div>
              <div className="h-36 rounded-2xl overflow-hidden mb-4 relative">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-extrabold">{item.shop_name} ({item.shop_area})</span>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">{item.description}</p>
            </div>

            <button
              onClick={() => setSelectedCoupon(item)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              {lang === 'mr' ? 'कूपन क्लेम करा 🎁' : 'Claim Deal Voucher 🎁'}
            </button>
          </div>
        ))}
      </div>

      {/* Claim Modal */}
      {selectedCoupon && (
        <CouponClaimModal coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
      )}
    </section>
  );
};

export default PerksSection;
