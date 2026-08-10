import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, totalReviews, size = "sm", showValue = true }) => {
  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const currentSize = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${currentSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 fill-slate-100'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-slate-800 ml-1">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500 font-medium">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
