import { motion } from "framer-motion";

const QuickViewImageGallery = ({
  product,
  selectedImageIndex,
  setSelectedImageIndex,
  imageLoading,
  handleImageLoad,
  handleImageError,
  setImageLoading,
}) => {
  // 💥 Guard clause to prevent undefined crash
  if (!product || !Array.isArray(product.images)) return null;

  const images = product.images;

  return (
    <div className="relative">
      <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <motion.img
          key={selectedImageIndex}
          src={images[selectedImageIndex] || "/placeholder-product.jpg"}
          alt={product.name || "Product Image"}
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

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((image, index) => (
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
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <img
                src={image}
                alt={`${product.name || "Product"} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickViewImageGallery;
