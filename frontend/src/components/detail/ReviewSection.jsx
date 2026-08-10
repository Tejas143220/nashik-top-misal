import React from 'react';
import RatingStars from '../common/RatingStars';
import { MessageSquare, Camera } from 'lucide-react';

export const ReviewSection = ({ reviews = [], avgRating = 0, totalReviews = 0, onOpenReviewModal }) => {
  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-6 space-y-6 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-brand-600" /> Customer Reviews ({totalReviews})
          </h3>
          <div className="mt-1">
            <RatingStars rating={avgRating} totalReviews={totalReviews} size="md" />
          </div>
        </div>
        <button
          onClick={onOpenReviewModal}
          className="text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-xl border border-brand-200 transition-colors cursor-pointer"
        >
          + Write Review & Photo
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-8 text-center bg-amber-50/50 rounded-2xl border border-dashed border-amber-200 space-y-2">
          <p className="text-xs font-bold text-slate-600">Be the first to review this Misal joint!</p>
          <p className="text-[11px] text-slate-500">Share your experience about spice, taste, and thali photos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(reviews) ? reviews : []).map((rev) => (
            <div key={rev.id} className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {rev.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{rev.reviewer_name}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <RatingStars rating={rev.rating} showValue={false} size="sm" />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              {/* 📸 Attached Review Thali Photo Preview */}
              {rev.image_url && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Camera className="w-3 h-3 text-brand-600" /> Reviewer Photo
                  </span>
                  <img
                    src={rev.image_url}
                    alt="Customer Thali Photo"
                    className="w-36 h-28 object-cover rounded-xl border border-amber-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
