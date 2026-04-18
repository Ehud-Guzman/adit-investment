import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPackage } from 'react-icons/fi';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import ErrorMessage from './ErrorMessage';
import { useUserActivity } from "@/hooks/useUserActivity";

const ProductList = ({
  products = [],
  loading = false,
  error = null,
  pagination = {
    page: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
    total: 0,
  },
  onPageChange = () => {},
  onQuickView = () => {},
  onAddToCart = () => {},
  onWishlistToggle = () => {},
  wishlistItems = [],
  itemsPerPage = 12,
}) => {
  // ✅ Hooks always at top — before any conditional returns
  const { logActivity } = useUserActivity();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const gridClasses = useMemo(() => {
    if (itemsPerPage >= 24) {
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4';
    } else if (itemsPerPage >= 12) {
      return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  }, [itemsPerPage]);

  const cardSize = useMemo(() => {
    if (itemsPerPage >= 24) return 'small';
    if (itemsPerPage >= 12) return 'medium';
    return 'large';
  }, [itemsPerPage]);

  const itemStart = useMemo(() => (pagination.page - 1) * itemsPerPage + 1, [pagination, itemsPerPage]);
  const itemEnd = useMemo(() => Math.min(pagination.page * itemsPerPage, pagination.total), [pagination, itemsPerPage]);

  useEffect(() => {
    if (!loading && isInitialLoad) setIsInitialLoad(false);
  }, [loading, isInitialLoad]);

  const getVisiblePages = () => {
    const maxVisible = 5;
    const current = pagination.page;
    const total = pagination.pages;
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: Math.min(maxVisible, end - start + 1) }, (_, i) => start + i);
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={() => onPageChange(1)} />;
  }

  const visiblePages = getVisiblePages();
  const totalPages = pagination.pages;

  return (
    <div className="space-y-8">
      {isInitialLoad && loading ? (
        <div className={gridClasses}>
          <ProductSkeleton count={itemsPerPage} />
        </div>
      ) : (
        <>
          {products.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                <FiPackage className="text-gray-400" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-sm">
                Try adjusting your search term, category, or sort order.
              </p>
            </motion.div>
          ) : (
            <>
              <div className={gridClasses}>
                <AnimatePresence>
                  {(() => {
                    let featuredShown = 0;
                    return products.map((product, index) => {
                      const showFeatured = product.featured && featuredShown < 3;
                      if (product.featured) featuredShown++;
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, delay: index * 0.03 }}
                          className="h-full"
                        >
                          <ProductCard
                            product={{ ...product, featured: showFeatured }}
                            size={cardSize}
                            onAddToCart={onAddToCart}
                            onWishlistToggle={onWishlistToggle}
                            onQuickView={onQuickView}
                            isInWishlist={wishlistItems.some(item => item.productId === product._id)}
                          />
                        </motion.div>
                      );
                    });
                  })()}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {products.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 pb-10 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Showing {itemStart}–{itemEnd} of {pagination.total} products
                  </p>

                  <nav className="flex items-center gap-1.5" aria-label="Pagination">
                    <button
                      onClick={() => onPageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev || loading}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {visiblePages[0] > 1 && (
                      <>
                        <button
                          onClick={() => onPageChange(1)}
                          className="w-9 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                          1
                        </button>
                        {visiblePages[0] > 2 && (
                          <span className="px-1 text-gray-400 text-sm">…</span>
                        )}
                      </>
                    )}

                    {visiblePages.map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        disabled={loading}
                        className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages && (
                      <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                          <span className="px-1 text-gray-400 text-sm">…</span>
                        )}
                        <button
                          onClick={() => onPageChange(totalPages)}
                          className="w-9 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onPageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext || loading}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
