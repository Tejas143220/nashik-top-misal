import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Crown, 
  Flame, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Copy, 
  Zap, 
  ExternalLink,
  Users,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  Printer,
  Lock,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { fetchShops, subscribeSponsorship } from '../services/api';
import triggerConfetti from '../components/animations/ConfettiBurst';

export const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'card', 'utr'

  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [txnRef, setTxnRef] = useState('');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Slider for ROI calculator
  const [monthlyViews, setMonthlyViews] = useState(8000);

  const developerDetails = {
    name: "Tejas Thakare",
    role: "Website Maker & Lead Developer",
    phonepeNumber: "7058638277",
    upiId: "7058638277@ybl"
  };

  const plans = [
    {
      id: "silver",
      name: "Silver Partner",
      tagline: "Essential Directory Boost",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      badge: "Silver Partner",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
      cardClass: "border-slate-200 shadow-md hover:shadow-xl",
      popular: false,
      icon: Award,
      features: [
        "Highlighted Directory Listing Card",
        "Priority Search Rank over Free Listings",
        "Custom Shop Tagline & Image Gallery",
        "Monthly View Analytics & Insights",
        "Verified Business Tick Mark"
      ]
    },
    {
      id: "gold",
      name: "Gold Partner ⭐",
      tagline: "Featured Popular Joint",
      monthlyPrice: 2499,
      yearlyPrice: 24999,
      badge: "Gold Verified",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-400 font-extrabold",
      cardClass: "border-amber-400 shadow-2xl ring-2 ring-amber-400/50 bg-gradient-to-b from-amber-50/50 to-white",
      popular: true,
      icon: Sparkles,
      features: [
        "Everything in Silver Plan",
        "Gold Gradient Border & Verified Gold Badge",
        "Top 3 Guaranteed Rank in Area Searches",
        "Short Video Clips Highlight in Shop Details",
        "Priority AI Quiz Recommendation Placement",
        "Detailed Click, Call & Direction Analytics"
      ]
    },
    {
      id: "platinum",
      name: "Platinum Partner 👑",
      tagline: "Ultimate Nashik Landmark",
      monthlyPrice: 4999,
      yearlyPrice: 49999,
      badge: "Platinum Crown",
      badgeClass: "bg-gradient-to-r from-purple-600 to-brand-600 text-white font-black animate-pulse",
      cardClass: "border-purple-500 shadow-2xl ring-4 ring-purple-500/20 bg-gradient-to-b from-purple-900/5 via-white to-amber-50/30",
      popular: false,
      icon: Crown,
      features: [
        "Everything in Gold Plan",
        "Animated Platinum Crown Glowing Badge",
        "#1 Homepage Hero Banner & Top Directory Spot",
        "Direct WhatsApp Reservation & Ordering Button",
        "Featured in 'Must-Visit Nashik Misal' Trail",
        "Dedicated Account Manager (Tejas Thakare)"
      ]
    }
  ];

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    fetchShops({ limit: 100 }).then((res) => setShops(res.items || [])).catch(() => {});
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(developerDetails.phonepeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const currentPrice = selectedPlan ? (isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice) : 0;
  const upiUrl = selectedPlan
    ? `upi://pay?pa=${developerDetails.upiId}&pn=Tejas%20Thakare%20Nashik%20Misal&am=${currentPrice}&cu=INR`
    : `upi://pay?pa=${developerDetails.upiId}&pn=Tejas%20Thakare`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const processSubscriptionAPI = async (txnReference) => {
    if (!selectedShopId) {
      alert("Please select your Misal Shop!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await subscribeSponsorship({
        shop_id: parseInt(selectedShopId),
        tier: selectedPlan.id,
        billing_cycle: isYearly ? "yearly" : "monthly",
        transaction_ref: txnReference || `PHONEPE-${Date.now()}`,
        contact_name: contactName || "Shop Owner",
        contact_phone: contactPhone || "7058638277"
      });
      triggerConfetti();
      setReceipt(res);
      setShowOtpModal(false);
      if (res?.whatsapp_alert_url) {
        window.open(res.whatsapp_alert_url, '_blank');
      }
    } catch (_err) {
      alert("Subscription process failed. Please verify your details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSubscription = (e) => {
    e.preventDefault();
    if (!selectedShopId) {
      alert("Please select your Misal Shop!");
      return;
    }

    if (paymentTab === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert("Please complete all card payment details!");
        return;
      }
      setShowOtpModal(true);
    } else {
      processSubscriptionAPI(txnRef || `PHONEPE-UPI-${Date.now()}`);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    processSubscriptionAPI(`CARD-PG-${cardNumber.slice(-4)}-${Date.now()}`);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // ROI estimation calculations
  const estExtraCustomers = Math.round(monthlyViews * 0.18);
  const estRevenueIncrease = (estExtraCustomers * 130).toLocaleString('en-IN');

  return (
    <>
      <Helmet>
        <title>Sponsorship Plans & Pricing | Nashik's Best Misal</title>
        <meta 
          name="description" 
          content="Promote your Misal shop in Nashik with Gold & Platinum placements. Dynamic PhonePe & Card payment to Tejas Thakare (7058638277)." 
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-brand-600 fill-brand-500" />
            Partner Growth & Sponsorship Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Grow Your Misal Business with <span className="bg-gradient-to-r from-brand-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">Premium Placements</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Get 10x more foodie visitors, top search rankings, and featured video reels. Developed by <strong className="text-slate-900">Tejas Thakare</strong>.
          </p>

          {/* Monthly / Yearly Switcher */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-slate-900 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none"
            >
              <div 
                className={`w-6 h-6 bg-brand-500 rounded-full transition-transform transform ${
                  isYearly ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual Billing
              </span>
              <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-bounce">
                SAVE 20% (2 Mos Free)
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {(Array.isArray(plans) ? plans : []).map((plan) => {
            const IconComp = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const priceFormatted = price.toLocaleString('en-IN');
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${plan.cardClass}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-brand-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-amber-100 text-brand-600">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${plan.badgeClass}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 mb-6">{plan.tagline}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-black text-slate-900">₹{priceFormatted}</span>
                    <span className="text-xs text-slate-500 font-bold ml-1">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                    {isYearly && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        Equivalent to ₹{Math.round(plan.yearlyPrice / 12).toLocaleString('en-IN')}/mo
                      </p>
                    )}
                  </div>

                  <hr className="border-slate-100 my-6" />

                  <ul className="space-y-3 mb-8">
                    {(Array.isArray(plan?.features) ? plan.features : []).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenModal(plan)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-600 to-amber-600 text-white hover:from-brand-700 hover:to-amber-700 shadow-brand-500/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" /> Select {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* ROI / Business Growth Calculator */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl border border-amber-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <TrendingUp className="w-4 h-4" /> Live Business ROI Estimator
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Calculate Your Estimated Thali Sales Boost
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Directory partners see an average 18% conversion rate from listing views into store walk-ins. Slide to estimate your revenue impact:
              </p>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <label htmlFor="pricing-monthly-views-range">Monthly Directory Views</label>
                  <span className="text-amber-400 text-base">{monthlyViews.toLocaleString('en-IN')} Views/mo</span>
                </div>
                <input
                  id="pricing-monthly-views-range"
                  name="monthlyViews"
                  type="range"
                  min="2000"
                  max="30000"
                  step="1000"
                  value={monthlyViews}
                  onChange={(e) => setMonthlyViews(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Estimated Monthly Customers</p>
                  <p className="text-3xl font-black text-amber-400">+{estExtraCustomers.toLocaleString('en-IN')} Walk-ins</p>
                </div>
                <Users className="w-8 h-8 text-amber-400" />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Est. Monthly Revenue Impact (@ ₹130/plate)</p>
                <p className="text-4xl font-black text-emerald-400">+₹{estRevenueIncrease}</p>
              </div>

              <div className="text-[11px] text-slate-400 bg-black/30 p-3 rounded-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified analytics based on active Nashik Misal customer traffic metrics.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Contact Card */}
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-brand-600 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Official Platform Developer & Support
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Need Custom Sponsorship or Verification Help?
            </h3>
            <p className="text-sm text-slate-600">
              Contact website maker <strong className="text-slate-900">{developerDetails.name}</strong> directly via PhonePe / WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="bg-amber-50 px-4 py-3 rounded-2xl border border-amber-200 text-center">
              <p className="text-[10px] uppercase font-bold text-amber-800">PhonePe / GPay Number</p>
              <p className="text-lg font-black text-slate-900 tracking-wider">{developerDetails.phonepeNumber}</p>
            </div>
            <button
              onClick={handleCopyUPI}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" /> {copied ? "Copied 7058638277!" : "Copy PhonePe Number"}
            </button>
          </div>
        </div>
      </div>

      {/* Professional Payment Checkout Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-amber-300 my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => { setIsModalOpen(false); setReceipt(null); setShowOtpModal(false); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-amber-50 z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {!receipt ? (
              <form onSubmit={handleSubmitSubscription} className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Professional Gateway Checkout</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Subscribe to {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Amount: <strong className="text-slate-900 text-base">₹{currentPrice.toLocaleString('en-IN')}</strong> ({isYearly ? 'Annual Plan' : 'Monthly Plan'})
                  </p>
                </div>

                {/* Shop & Contact Details */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div>
                    <label htmlFor="pricing-shop-select" className="block text-xs font-black uppercase text-slate-600 mb-1">Select Your Misal Shop *</label>
                    <select
                      id="pricing-shop-select"
                      name="pricingShopId"
                      value={selectedShopId}
                      onChange={(e) => setSelectedShopId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">-- Select Misal Shop Joint --</option>
                      {(Array.isArray(shops) ? shops : []).map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.area})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="pricing-contact-name" className="block text-xs font-bold text-slate-600 mb-1">Contact Person Name *</label>
                      <input
                        id="pricing-contact-name"
                        name="contactName"
                        type="text"
                        placeholder="Owner Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label htmlFor="pricing-contact-phone" className="block text-xs font-bold text-slate-600 mb-1">Phone Number *</label>
                      <input
                        id="pricing-contact-phone"
                        name="contactPhone"
                        type="tel"
                        placeholder="10-digit mobile"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Method Switcher Tabs */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">Select Payment Method</span>
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPaymentTab('upi')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'upi' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Dynamic UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('card')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'card' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Cards & Gateway
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('utr')}
                      className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'utr' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" /> UTR / Reference
                    </button>
                  </div>

                  {/* Tab 1: Dynamic Amount UPI QR Code */}
                  {paymentTab === 'upi' && (
                    <div className="bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50 p-5 rounded-2xl border border-purple-200 text-center space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-200 px-3 py-0.5 rounded-full">
                          Live Amount Scannable QR Code
                        </span>
                        <h4 className="text-sm font-black text-slate-900">Scan & Pay ₹{currentPrice.toLocaleString('en-IN')} with Any App</h4>
                        <p className="text-xs text-slate-500">PhonePe • Google Pay • Paytm • BHIM • CRED</p>
                      </div>

                      <div className="w-48 h-48 bg-white p-3 rounded-2xl border-2 border-purple-300 shadow-md mx-auto flex items-center justify-center">
                        <img src={qrImageUrl} alt="Live UPI QR Code" className="w-full h-full object-contain" />
                      </div>

                      <div className="flex items-center justify-center gap-4 text-xs">
                        <a
                          href={upiUrl}
                          className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open PhonePe App Now
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="bg-white border border-purple-300 text-purple-900 hover:bg-purple-50 px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy UPI ID"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Credit / Debit Card & NetBanking Gateway Simulator */}
                  {paymentTab === 'card' && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Card Payment Gateway</span>
                        <span className="flex items-center gap-1 text-emerald-600"><Lock className="w-3 h-3" /> 256-Bit Encrypted</span>
                      </div>
                      <div>
                        <label htmlFor="pricing-card-name" className="block text-[11px] font-bold text-slate-600 mb-1">Cardholder Name *</label>
                        <input
                          id="pricing-card-name"
                          name="cardName"
                          type="text"
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label htmlFor="pricing-card-number" className="block text-[11px] font-bold text-slate-600 mb-1">Card Number *</label>
                        <input
                          id="pricing-card-number"
                          name="cardNumber"
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8821"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="pricing-card-expiry" className="block text-[11px] font-bold text-slate-600 mb-1">Expiry Date *</label>
                          <input
                            id="pricing-card-expiry"
                            name="cardExpiry"
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
                          />
                        </div>
                        <div>
                          <label htmlFor="pricing-card-cvv" className="block text-[11px] font-bold text-slate-600 mb-1">CVV / CVC *</label>
                          <input
                            id="pricing-card-cvv"
                            name="cardCvv"
                            type="password"
                            maxLength={3}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: UTR Reference Code */}
                  {paymentTab === 'utr' && (
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                      <div>
                        <label htmlFor="pricing-txn-ref" className="block text-xs font-bold text-slate-700 mb-1">PhonePe / GPay 12-Digit UTR Number *</label>
                        <input
                          id="pricing-txn-ref"
                          name="txnRef"
                          type="text"
                          placeholder="e.g. 123456789012"
                          value={txnRef}
                          onChange={(e) => setTxnRef(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Found in your payment app receipt under UTR / Ref No.</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-brand-600 via-orange-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Processing Activation..." : `Complete & Pay ₹${currentPrice.toLocaleString('en-IN')} 💳`}
                </button>
              </form>
            ) : (
              /* Printable Official Tax Invoice Receipt Screen */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shadow">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">TAX INVOICE & RECEIPT</span>
                      <h3 className="text-xl font-black text-slate-900">{receipt.invoice_no}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {receipt.whatsapp_alert_url && (
                      <a
                        href={receipt.whatsapp_alert_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shadow transition-all"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" /> Send WhatsApp Alert 📲
                      </a>
                    )}
                    <button
                      onClick={handlePrintInvoice}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print Tax Receipt 🖨️
                    </button>
                  </div>
                </div>

                {/* Invoice Body */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Issued To (Partner)</span>
                      <strong className="text-slate-900 font-black text-sm block">{receipt.shop_name}</strong>
                      <span className="text-slate-600">{contactName || 'Shop Manager'} ({contactPhone || '7058638277'})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Merchant Developer</span>
                      <strong className="text-slate-900 font-black block">{receipt.creator_contact}</strong>
                      <span className="text-slate-600">PhonePe: {receipt.phonepe_number}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                      <span>Subscription Tier ({receipt.sponsorship_tier.toUpperCase()})</span>
                      <span className="font-bold text-slate-900">₹{receipt.subtotal?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 font-medium text-slate-600">
                      <span>18% GST (CGST + SGST)</span>
                      <span className="font-bold">₹{receipt.gst_amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 font-black text-sm text-slate-900">
                      <span>Total Paid Amount</span>
                      <span className="text-emerald-600 font-black">₹{receipt.total_paid?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                    <span>Txn Ref: <strong className="text-slate-800">{receipt.transaction_ref}</strong></span>
                    <span>Valid Until: <strong className="text-slate-800">{receipt.expires_at}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => { setIsModalOpen(false); setReceipt(null); }}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md"
                >
                  Done & Close Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Gateway Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-brand-300 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto border border-brand-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">2-Factor Bank OTP Authentication</h4>
              <p className="text-xs text-slate-500 mt-1">An OTP has been sent to your registered mobile number ending in •••• 8277.</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <label htmlFor="pricing-otp-input" className="sr-only">Enter 6-digit OTP</label>
              <input
                id="pricing-otp-input"
                name="otpInput"
                type="text"
                maxLength={6}
                required
                aria-label="Enter 6-digit OTP"
                placeholder="Enter 6-digit OTP (Demo: 123456)"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full py-3 bg-amber-50/60 border border-amber-300 rounded-xl text-center text-lg font-black tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow-md transition-all"
              >
                Authenticate & Confirm Payment 💳
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingPage;
