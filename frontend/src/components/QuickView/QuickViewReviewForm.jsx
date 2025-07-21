import { FiLoader } from "react-icons/fi";
import RatingStars from "../RatingStars";

const QuickViewReviewForm = ({
  onSubmitReview,
  handleSubmit,
  register,
  errors,
  setValue,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmitReview)} className="mt-6">
      <h4 className="font-medium mb-3">Write a Review</h4>
      <div className="flex items-center gap-2 mb-3">
        <span>Rating:</span>
        <RatingStars
          rating={5}
          interactive={true}
          onChange={(value) => setValue("reviewRating", value)}
        />
      </div>
      <textarea
        {...register("reviewText", {
          required: "Review text is required",
          minLength: {
            value: 10,
            message: "Review must be at least 10 characters",
          },
        })}
        placeholder="Share your thoughts about this product..."
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
        rows="4"
        aria-label="Your review"
      />
      {errors.reviewText && (
        <p className="text-red-500 text-sm mb-3">
          {errors.reviewText.message}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {isSubmitting && <FiLoader className="animate-spin" size={18} />}
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default QuickViewReviewForm;
