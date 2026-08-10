import React, { useState, useEffect, useCallback } from 'react';
import SEOHead from '../components/seo/SEOHead';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, XCircle, Key, RefreshCw, Ticket, TrendingUp, Store } from 'lucide-react';
import axios from 'axios';
import triggerConfetti from '../components/animations/ConfettiBurst';

export const MerchantDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('merchant_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [voucherCode, setVoucherCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/v1/merchant/analytics');
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, fetchAnalytics]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '7058') {
      setIsAuthenticated(true);
      sessionStorage.setItem('merchant_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. (Default demo PIN is 7058)');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    setLoadingVerify(true);
    setRedeemSuccess(null);
    try {
      const { data } = await axios.post('/api/v1/merchant/verify-coupon', {
        voucher_code: voucherCode.trim()
      });
      setVerifyResult(data);
    } catch (err) {
      console.error(err);
      setVerifyResult({
        status: 'ERROR',
        message: 'Failed to verify voucher. Please check network connection.',
        is_valid: false
      });
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleRedeem = async () => {
    if (!verifyResult || !verifyResult.voucher_code) return;
    setLoadingRedeem(true);
    try {
      const { data } = await axios.post('/api/v1/merchant/redeem-coupon', {
        voucher_code: verifyResult.voucher_code,
        merchant_pin: '7058'
      });
      setRedeemSuccess(data);
      setVerifyResult(null);
      setVoucherCode('');
      triggerConfetti();
      fetchAnalytics();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to redeem voucher.');
    } finally {
      setLoadingRedeem(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead title="Merchant Portal Login - Nashik's Best Misal" description="Shop manager login for verifying customer discount vouchers." />
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-brand-600 flex items-center justify-center mx-auto border border-amber-300">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Portal Access</h1>
              <p className="text-xs text-slate-500">Enter your 4-digit Merchant PIN to manage customer coupon redemptions.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Merchant Security PIN *</label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter PIN (Demo: 7058)"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-amber-50/60 border border-amber-200 rounded-2xl text-center text-lg font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Key className="w-5 h-5 text-amber-600 absolute left-3.5 top-3.5" />
                </div>
                {pinError && <p className="text-xs text-rose-600 font-bold mt-1.5">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Unlock Dashboard 🔓
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Merchant Redemption Portal & Dashboard - Nashik's Best Misal"
        description="Verify and redeem customer discount vouchers in real-time."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Portal Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Merchant Partner Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Coupon Redemption Dashboard 🏪
            </h1>
            <p className="text-xs text-slate-400">Verify customer discount codes, mark deals redeemed, and track daily claims.</p>
          </div>

          <button
            onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('merchant_auth'); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            Lock Dashboard 🔒
          </button>
        </div>

        {/* Analytics Summary Bar */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-brand-600 font-black text-xl flex items-center justify-center shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Total Issued Vouchers</span>
                <h3 className="text-2xl font-black text-slate-900">{analytics.total_issued_vouchers} 🎟️</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-black text-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Total Redeemed</span>
                <h3 className="text-2xl font-black text-emerald-600">{analytics.total_redeemed_vouchers} ✅</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 font-black text-xl flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Active Deals Running</span>
                <h3 className="text-2xl font-black text-slate-900">{analytics.active_deals_count} 🔥</h3>
              </div>
            </div>
          </div>
        )}

        {/* Main Verification Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Verify Customer Voucher Code</h2>
            <p className="text-xs text-slate-500">Ask the customer for their voucher code (e.g., SADHANA-JALEBI-XYZ123) and enter below:</p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Voucher Code (e.g. PERACHI-WADI-FREE-SOLKADHI-888)"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-sm font-black tracking-wider text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-4" />
            </div>

            <button
              type="submit"
              disabled={loadingVerify}
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loadingVerify ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loadingVerify ? "Verifying..." : "Verify Voucher 🔍"}
            </button>
          </form>

          {/* Verification Result Display */}
          {verifyResult && (
            <div className={`p-6 rounded-2xl border space-y-4 transition-all ${
              verifyResult.is_valid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : verifyResult.status === 'ALREADY_REDEEMED'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-start gap-3">
                {verifyResult.is_valid ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : verifyResult.status === 'ALREADY_REDEEMED' ? (
                  <AlertCircle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    verifyResult.is_valid ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    STATUS: {verifyResult.status}
                  </span>
                  <h4 className="text-base font-black">{verifyResult.message}</h4>
                </div>
              </div>

              {verifyResult.voucher_code && (
                <div className="bg-white/80 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Customer Name</span>
                      <span className="font-black text-slate-900">{verifyResult.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Voucher Code</span>
                      <span className="font-black text-brand-600">{verifyResult.voucher_code}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Offer Deal</span>
                      <span className="font-extrabold text-slate-900">{verifyResult.offer_title}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Shop Joint</span>
                      <span className="font-extrabold text-slate-900">{verifyResult.shop_name}</span>
                    </div>
                  </div>
                </div>
              )}

              {verifyResult.is_valid && (
                <button
                  onClick={handleRedeem}
                  disabled={loadingRedeem}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loadingRedeem ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {loadingRedeem ? "Redeeming..." : "Confirm & Apply Discount to Customer Bill ✅"}
                </button>
              )}
            </div>
          )}

          {/* Redemption Success Receipt */}
          {redeemSuccess && (
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-amber-300" />
                <h3 className="text-lg font-black">Voucher Redeemed Successfully! 🎉</h3>
              </div>
              <p className="text-xs text-emerald-100">
                Discount offer <span className="font-black text-amber-300">{redeemSuccess.offer_title}</span> has been redeemed for customer <span className="font-black text-white">{redeemSuccess.customer_name}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Live Redemption Feed Table */}
        {analytics?.recent_redemptions && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900">Recent Voucher Redemptions Today</h3>
            
            {analytics.recent_redemptions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No vouchers redeemed yet today.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-200 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Voucher Code</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Offer Deal</th>
                      <th className="py-2.5 px-3">Shop</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-semibold text-slate-800">
                    {(Array.isArray(analytics?.recent_redemptions) ? analytics.recent_redemptions : []).map((item, i) => (
                      <tr key={i} className="hover:bg-amber-50/50">
                        <td className="py-3 px-3 font-black text-brand-600">{item.voucher_code}</td>
                        <td className="py-3 px-3">{item.customer_name}</td>
                        <td className="py-3 px-3">{item.offer_title}</td>
                        <td className="py-3 px-3">{item.shop_name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            REDEEMED ✅
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MerchantDashboardPage;
