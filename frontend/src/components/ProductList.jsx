import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    total: 0
  },
  onPageChange = () => {},
  onQuickView = () => {},
  onAddToCart = () => {},
  onWishlistToggle = () => {},
  wishlistItems = [],
  itemsPerPage = 12,
}) => {
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

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Calculate item range using pagination data
  const itemStart = useMemo(() => {
    return (pagination.page - 1) * itemsPerPage + 1;
  }, [pagination, itemsPerPage]);

  const itemEnd = useMemo(() => {
    return Math.min(pagination.page * itemsPerPage, pagination.total);
  }, [pagination, itemsPerPage]);

  // Track initial load state
  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => onPageChange(1)} 
      />
    );
  }

  const { logActivity } = useUserActivity();


  // Calculate visible page numbers
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const current = pagination.page;
    const totalPages = pagination.pages;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from(
      { length: Math.min(maxVisiblePages, endPage - startPage + 1) }, 
      (_, i) => startPage + i
    );
  };

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
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No products found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className={gridClasses}>
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ProductCard
                        product={product}
                        size={cardSize}
                        onAddToCart={onAddToCart}
                        onWishlistToggle={onWishlistToggle}
                        onQuickView={onQuickView}
                        isInWishlist={wishlistItems.some(
                          (item) => item.productId === product._id
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {products.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 pb-10 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing {itemStart} to {itemEnd} of {pagination.total} items
                  </div>
                  
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => onPageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev || loading}
                      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      &larr; Prev
                    </button>

                    {visiblePages.map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-4 py-2 rounded-md min-w-[40px] transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => onPageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext || loading}
                      className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                      Next &rarr;
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