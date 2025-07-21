import RatingStars from "../RatingStars";
import { getUserInitials } from "../../utils/getUserInitials";

const QuickViewReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border-b pb-5 last:border-b-0 last:pb-0"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700"
                aria-label={review.userName || "Anonymous"}
              >
                {getUserInitials(review.userName || "Anonymous")}
              </div>
              <span className="font-medium text-gray-800 text-sm">
                {review.userName || "Anonymous"}
              </span>
            </div>
            <RatingStars rating={review.rating} size="sm" showNumber={false} />
          </div>

          <p className="text-gray-700 pl-10">{review.text}</p>
          <div className="text-xs text-gray-500 pl-10 mt-1">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickViewReviews;
