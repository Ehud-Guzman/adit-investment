import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiHeart, FiShoppingCart, FiLoader } from "react-icons/fi";
import { useForm } from "react-hook-form";
import RatingStars from "./RatingStars";
import PriceDisplay from "./PriceDisplay";
import QuantitySelector from "./QuantitySelector";
import { getUserInitials } from "../utils/getUserInitials";

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  addToCart,
  addToWishlist = () => {},
  removeFromWishlist = () => {},
  isInWishlist,
  reviews = [],
  currentUser,
  submitReview,
  setAuthModalOpen,
  setAuthMode,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      reviewRating: 5,
      reviewText: "",
    },
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [localReviews, setLocalReviews] = useState(reviews);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setImageLoading(true);
      reset();
      setLocalReviews(reviews);
    }
  }, [product, reviews, reset]);

  const onSubmitReview = (data) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      setAuthMode("login");
      return;
    }

    const newReview = {
      _id: `temp-${Date.now()}`,
      userName: currentUser.name,
      rating: Number(data.reviewRating),
      text: data.reviewText,
      createdAt: new Date().toISOString(),
      userId: currentUser._id,
    };

    setLocalReviews((prev) => [newReview, ...prev]);

    submitReview({
      productId: product._id,
      review: {
        text: data.reviewText,
        rating: Number(data.reviewRating),
        userId: currentUser._id,
      },
    });

    reset();
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    isInWishlist
      ? removeFromWishlist(product._id)
      : addToWishlist(product._id);
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-product.jpg";
    setImageLoading(false);
  };

  const handleImageLoad = () => setImageLoading(false);

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
              aria-label="Close quick view"
            >
              <FiX size={24} />
            </button>

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-2xl">
                <FiLoader className="animate-spin text-blue-600" size={32} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Product Image Section */}
              <div className="relative">
                <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-100">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <motion.img
                    key={selectedImageIndex}
                    src={product.images?.[selectedImageIndex] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: imageLoading ? 0 : 1 }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="eager"
                  />
                </div>

                {product.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {product.images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setImageLoading(true);
                        }}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all ${
                          selectedImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-4 sm:mb-5">
                  <div>
                    <h2 id="quick-view-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={product.rating || 0} size="md" showNumber />
                      <span className="text-sm text-gray-500">
                        ({localReviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full transition-colors ${
                      isInWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FiHeart size={20} fill={isInWishlist ? "white" : "none"} />
                  </motion.button>
                </div>

                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="xl"
                  className="mb-5 sm:mb-6"
                />

                {/* Availability & Description */}
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stock > 0 && (
                      <span className="text-xs sm:text-sm text-gray-600">
                        {product.stock} units available
                      </span>
                    )}
                    {product.sku && (
                      <span className="text-xs sm:text-sm text-gray-500">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5">
                    {product.description || "No description available"}
                  </p>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-3 flex-wrap mb-6 sm:mb-8">
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                    max={product.stock}
                    size="lg"
                  />
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-lg ${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors`}
                    whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                    whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                    aria-label="Add to cart"
                  >
                    <FiShoppingCart size={20} /> Add to Cart
                  </motion.button>
                </div>

                {/* Reviews Section */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

                  {localReviews.length > 0 ? (
                    <div className="space-y-5">
                      {localReviews.map((review) => (
                        <div key={review._id} className="border-b pb-5 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-700"
                                aria-label={review.userName}
                              >
                                {getUserInitials(review.userName)}
                              </div>
                              <span className="font-medium">{review.userName}</span>
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
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  )}

                  <form onSubmit={handleSubmit(onSubmitReview)} className="mt-6">
                    <h4 className="font-medium mb-3">Write a Review</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span>Rating:</span>
                      <RatingStars
                        rating={5}
                        interactive
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
                        {isSubmitting && <FiLoader className="animate-spin" size={18} />} Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
