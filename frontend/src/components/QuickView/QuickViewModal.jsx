import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLoader } from "react-icons/fi";
import { useForm } from "react-hook-form";

import QuickViewImageGallery from "./QuickViewImageGallery";
import QuickViewHeader from "./QuickViewHeader";
import QuickViewDetails from "./QuickViewDetails";
import QuickViewActions from "./QuickViewActions";
import QuickViewReviews from "./QuickViewReviews";
import QuickViewReviewForm from "./QuickViewReviewForm";

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

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = (e) => {
    e.target.src = "/placeholder-product.jpg";
    setImageLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id);
  };

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
        userId: currentUser?._id,
      },
    });

    reset();
  };

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
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-md p-1.5 transition-colors"
              aria-label="Close quick view"
            >
              <FiX size={22} />
            </button>

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-2xl">
                <FiLoader className="animate-spin text-blue-600" size={32} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="relative">
                <QuickViewImageGallery
                  product={product}
                  selectedImageIndex={selectedImageIndex}
                  setSelectedImageIndex={setSelectedImageIndex}
                  imageLoading={imageLoading}
                  handleImageLoad={handleImageLoad}
                  handleImageError={handleImageError}
                  setImageLoading={setImageLoading}
                />
              </div>

              <div className="flex flex-col">
                <QuickViewHeader
                  product={product}
                  localReviews={localReviews}
                  isInWishlist={isInWishlist}
                  handleWishlistToggle={handleWishlistToggle}
                />

                <QuickViewDetails product={product} />

                <QuickViewActions
                  quantity={quantity}
                  setQuantity={setQuantity}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />

                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  <QuickViewReviews reviews={localReviews} />
                  <QuickViewReviewForm
                    onSubmitReview={onSubmitReview}
                    handleSubmit={handleSubmit}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    isSubmitting={isSubmitting}
                  />
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
