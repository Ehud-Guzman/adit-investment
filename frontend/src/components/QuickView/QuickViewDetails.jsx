// ✅ QuickViewDetails.jsx
const QuickViewDetails = ({ product }) => {
  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
            product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
        {product.stock > 0 && (
          <span className="text-xs sm:text-sm text-gray-600">
            {product.stock} units available
          </span>
        )}
        {product.sku && (
          <span className="text-xs sm:text-sm text-gray-500">SKU: {product.sku}</span>
        )}
      </div>

      <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5">
        {product.description || "No description available"}
      </p>

      {(product.specs || []).length > 0 && (
        <div className="mb-5 sm:mb-6">
          <h3 className="font-semibold text-lg mb-3 sm:mb-4">Specifications</h3>
          <div className="space-y-3 sm:space-y-4">
            {product.specs.map((spec, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base"
              >
                <span className="col-span-1 text-gray-600">{spec.label}</span>
                <span className="col-span-2 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickViewDetails;