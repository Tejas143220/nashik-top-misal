import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import { createShop } from '../services/api';
import { PlusCircle, Award, Check, Sparkles, Send, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import triggerConfetti from '../components/animations/ConfettiBurst';

export const SubmitShopPage = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    tagline: 'Authentic Nashik Misal',
    description: '',
    phone: '',
    area: 'Gangapur Road',
    address: '',
    spicyLevel: 4,
    isChulhivarchi: false,
    pricePerPlate: 120,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
    sponsorshipTier: 'gold',
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdShop, setCreatedShop] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName || !formData.address) {
      setError('Please provide shop name and full address.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const isSponsored = formData.sponsorshipTier !== 'none';
      const payload = {
        name: formData.shopName,
        tagline: formData.tagline || 'Famous Nashik Misal Joint',
        description: formData.description || `${formData.shopName} in ${formData.area}, Nashik. Serving authentic misal rassa and fresh pav.`,
        address: formData.address,
        area: formData.area,
        city: 'Nashik',
        phone: formData.phone || undefined,
        spicy_level: Number(formData.spicyLevel),
        is_chulhivarchi: Boolean(formData.isChulhivarchi),
        price_per_plate: Number(formData.pricePerPlate) || 120,
        main_image_url: formData.imageUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
        is_sponsored: isSponsored,
        sponsorship_tier: isSponsored ? formData.sponsorshipTier : 'none',
      };

      const res = await createShop(payload);
      triggerConfetti();
      setCreatedShop(res);
      if (res?.whatsapp_alert_url) {
        window.open(res.whatsapp_alert_url, '_blank');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit shop. Please check your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Add Your Misal Shop / Claim Listing - Nashik's Best Misal"
        description="Are you a misal joint owner in Nashik? Submit your shop for a free listing or upgrade to Sponsored Placements to reach thousands of local foodies."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Business Owner Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Promote Your Misal Shop on Nashik's #1 Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Get your shop listed in front of thousands of misal lovers and tourists searching for Nashik's top food spots every week.
          </p>
        </div>

        {/* Pricing Tiers / Sponsorship Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4 relative">
            <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              Phase 1 Option
            </span>
            <h3 className="text-lg font-black text-slate-900">Basic Free Listing</h3>
            <p className="text-xs text-slate-500">Standard listing in our searchable directory grid.</p>
            <ul className="space-y-2 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" /> Listed in Directory Search
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" /> Customer Ratings & Reviews
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" /> Google Maps Directions
              </li>
            </ul>
            <div className="text-xl font-black text-slate-900 pt-2">FREE</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
            <span className="badge-sponsored inline-flex">
              <Award className="w-3.5 h-3.5" /> High ROI Monetization
            </span>
            <h3 className="text-lg font-black text-white">Gold / Platinum Sponsored Slot</h3>
            <p className="text-xs text-amber-100">Pinned to the top of homepage & directory results with custom badge.</p>
            <ul className="space-y-2 text-xs font-semibold text-white">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-200" /> Guaranteed Top #1 Page Placement
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-200" /> Gold/Platinum Featured Badge
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-200" /> 10x More Clicks & Directions
              </li>
            </ul>
            <div className="text-xl font-black text-white pt-2">Instant Setup</div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-600" /> Add Your Misal Shop Details
          </h2>

          {error && (
            <div className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {createdShop ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-5">
              <Sparkles className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <span className="text-xs font-extrabold uppercase text-emerald-700">Submission Confirmed!</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{createdShop.name}</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your shop in <strong>{createdShop.area}</strong> is now live in Nashik's Best Misal directory database!
                </p>
              </div>

              {/* Developer Instant WhatsApp Alert Button */}
              {createdShop.whatsapp_alert_url && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 max-w-md mx-auto space-y-2">
                  <p className="text-xs font-black text-emerald-950 uppercase">Instant WhatsApp Alert for Developer Verification</p>
                  <a
                    href={createdShop.whatsapp_alert_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" /> Send Alert to Tejas Thakare (7058638277) 📲
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to={`/misal/${createdShop.slug}`}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md hover:bg-slate-800 transition-colors"
                >
                  View Your Live Listing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="submit-shop-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Misal Shop Name *
                  </label>
                  <input
                    id="submit-shop-name"
                    name="shopName"
                    type="text"
                    required
                    placeholder="e.g. Hotel Samrat Misal"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="submit-tagline" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tagline / Speciality
                  </label>
                  <input
                    id="submit-tagline"
                    name="tagline"
                    type="text"
                    placeholder="e.g. Famous for Extra Zanzanit Sample & Jalebi"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="submit-phone" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    id="submit-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98220 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label htmlFor="submit-area" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Select Area in Nashik *
                  </label>
                  <select
                    id="submit-area"
                    name="area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  >
                    <option value="Gangapur Road">Gangapur Road</option>
                    <option value="Panchavati">Panchavati</option>
                    <option value="College Road">College Road</option>
                    <option value="Peth Road">Peth Road</option>
                    <option value="Ambad MIDC">Ambad MIDC</option>
                    <option value="Cidco">Cidco</option>
                    <option value="Nashik Road">Nashik Road</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="submit-spicy-level" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Spicy Level (1 to 5)
                  </label>
                  <select
                    id="submit-spicy-level"
                    name="spicyLevel"
                    value={formData.spicyLevel}
                    onChange={(e) => setFormData({ ...formData, spicyLevel: Number(e.target.value) })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  >
                    <option value="1">1 (Mild)</option>
                    <option value="2">2 (Medium)</option>
                    <option value="3">3 (Hot)</option>
                    <option value="4">4 (Extra Spicy)</option>
                    <option value="5">5 (Zanzanit 🔥)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="submit-price-per-plate" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price per Plate (INR)
                  </label>
                  <input
                    id="submit-price-per-plate"
                    name="pricePerPlate"
                    type="number"
                    value={formData.pricePerPlate}
                    onChange={(e) => setFormData({ ...formData, pricePerPlate: e.target.value })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="submit-is-chulhivarchi" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Wood Stove (Chulhivarchi)
                  </label>
                  <select
                    id="submit-is-chulhivarchi"
                    name="isChulhivarchi"
                    value={formData.isChulhivarchi}
                    onChange={(e) => setFormData({ ...formData, isChulhivarchi: e.target.value === 'true' })}
                    className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  >
                    <option value="false">No (Gas Stove)</option>
                    <option value="true">Yes (Chulhivarchi 🔥)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="submit-address" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Address *
                </label>
                <textarea
                  id="submit-address"
                  name="address"
                  required
                  rows={2}
                  placeholder="Street address, landmark, near Someshwar..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="submit-image-url" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Main Photo Image URL
                </label>
                <input
                  id="submit-image-url"
                  name="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="submit-sponsorship-tier" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sponsorship Tier
                </label>
                <select
                  id="submit-sponsorship-tier"
                  name="sponsorshipTier"
                  value={formData.sponsorshipTier}
                  onChange={(e) => setFormData({ ...formData, sponsorshipTier: e.target.value })}
                  className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                >
                  <option value="gold">🔥 Gold Sponsored Placement</option>
                  <option value="platinum">⭐ Platinum Featured Placement (Top #1 Slot)</option>
                  <option value="none">Free Listing</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Add Misal Shop & Send Developer Alert 📲</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmitShopPage;
