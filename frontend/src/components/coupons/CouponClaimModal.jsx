import React, { useState } from 'react';
import { X, QrCode, Copy, CheckCircle2, Gift } from 'lucide-react';
import axios from 'axios';

export const CouponClaimModal = ({ coupon, onClose }) => {
  const [claimedVoucher, setClaimedVoucher] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const { data } = await axios.post('/api/v1/coupons/claim', { coupon_id: coupon.id });
      setClaimedVoucher(data);
    } catch (err) {
      alert("Failed to claim coupon deal.");
    } finally {
      setClaiming(false);
    }
  };

  const handleCopyCode = () => {
    if (!claimedVoucher) return;
    navigator.clipboard.writeText(claimedVoucher.voucher_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!coupon) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-amber-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-amber-50"
        >
          <X className="w-6 h-6" />
        </button>

        {!claimedVoucher ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Gift className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black text-brand-600 uppercase tracking-wider">{coupon.badge}</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{coupon.title}</h3>
              <p className="text-sm font-bold text-slate-600">{coupon.shop_name} ({coupon.shop_area})</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{coupon.description}</p>
            </div>

            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {claiming ? "Generating Digital Voucher..." : "Claim Free Coupon Deal 🎁"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Coupon Claimed!</span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{claimedVoucher.coupon_title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{claimedVoucher.shop_name} • Valid until {claimedVoucher.expiry_date}</p>
            </div>

            {/* Voucher Code Box */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
              <p className="text-[10px] uppercase font-bold text-amber-800">Your Exclusive Voucher Code</p>
              <p className="text-xl font-mono font-black text-slate-900 tracking-widest">{claimedVoucher.voucher_code}</p>
              <button
                onClick={handleCopyCode}
                className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> {copied ? "Copied Code!" : "Copy Voucher Code"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
              <QrCode className="w-5 h-5 text-slate-700" />
              <span>Show this voucher screen to your server at billing time.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-sm"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponClaimModal;
