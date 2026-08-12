import React, { useState } from 'react';
import { submitReview } from '../../services/api';
import { X, Star, Flame, Loader2, Camera } from 'lucide-react';

export const ReviewFormModal = ({ shopId, shopName, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email] = useState('');
  const [rating, setRating] = useState(5);
  const [spiceRating, setSpiceRating] = useState(4);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) {
      setError('Please provide your name and review comment.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      await submitReview({
        shop_id: shopId,
        reviewer_name: name,
        reviewer_email: email || undefined,
        rating: Number(rating),
        spice_rating: Number(spiceRating),
        comment: comment,
        image_url: imageUrl || undefined,
      });
      alert('Thank you! Your review and thali photo have been submitted.');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-black text-slate-900">
            Write a Review for {shopName}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Share your taste experience, spice level, and attach a photo thali!
          </p>
        </div>

        {error && (
          <div className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Overall Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-spice-rating" className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-brand-600" /> Spice Kick Level (1 to 5)
            </label>
            <input
              id="review-spice-rating"
              name="spiceRating"
              type="range"
              min="1"
              max="5"
              value={spiceRating}
              onChange={(e) => setSpiceRating(e.target.value)}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>1 (Mild)</span>
              <span>3 (Hot)</span>
              <span>5 (Super Zanzanit)</span>
            </div>
          </div>

          <div>
            <label htmlFor="review-reviewer-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Your Name *
            </label>
            <input
              id="review-reviewer-name"
              name="reviewerName"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* 📸 Review Thali Photo Input */}
          <div>
            <label htmlFor="review-image-url" className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-brand-600" /> Attach Misal Thali Photo URL (Optional)
            </label>
            <input
              id="review-image-url"
              name="imageUrl"
              type="url"
              placeholder="https://images.unsplash.com/... or image link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Your Review & Feedback *
            </label>
            <textarea
              id="review-comment"
              name="comment"
              required
              rows={3}
              placeholder="How was the tari sample, farsan freshness, and seating ambience?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs bg-amber-50/50 border border-amber-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review & Earn Stamp'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;
