import { useState } from "react";
import { FiStar } from "react-icons/fi";

const RatingStars = ({ rating, size = 5, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onMouseEnter={interactive ? () => setHoverRating(star) : null}
            onMouseLeave={interactive ? () => setHoverRating(0) : null}
            onClick={interactive ? () => onChange(star) : null}
            disabled={!interactive}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            <FiStar
              className={`w-${size} h-${size} ${isFilled ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-1 text-sm text-gray-500">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default RatingStars;