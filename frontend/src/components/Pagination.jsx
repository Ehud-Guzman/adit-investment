import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import { useHotkeys } from 'react-hotkeys-hook';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  goToPage,
  totalItems = 0,
  itemsPerPage = 10,
  isLoading = false,
  className = "",
}) => {
  // State for page input
  const [showPageInput, setShowPageInput] = useState(false);
  const [inputPage, setInputPage] = useState(currentPage);
  const pageInputRef = useRef(null);

  // Calculate display values
  const safeTotalItems = Math.max(0, totalItems);
  const hasItems = safeTotalItems > 0;
  const canGoBack = currentPage > 1 && hasItems && !isLoading;
  const canGoForward = currentPage < totalPages && hasItems && !isLoading;

  // Calculate item range display
  const itemStart = ((currentPage - 1) * itemsPerPage) + 1;
  const itemEnd = Math.min(currentPage * itemsPerPage, safeTotalItems);

  // Keyboard navigation
  useHotkeys('left', () => canGoBack && goToPage(currentPage - 1), {
    enableOnFormElements: true,
    preventDefault: true,
  });
  
  useHotkeys('right', () => canGoForward && goToPage(currentPage + 1), {
    enableOnFormElements: true,
    preventDefault: true,
  });

  // Focus page input when shown
  useEffect(() => {
    if (showPageInput && pageInputRef.current) {
      pageInputRef.current.focus();
      pageInputRef.current.select();
    }
  }, [showPageInput]);

  // Sync input with current page
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Handle page input submission
  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = Math.max(1, Math.min(totalPages, Number(inputPage)));
    if (page !== currentPage) {
      goToPage(page);
    }
    setShowPageInput(false);
  };

  // Generate page number sequence
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Don't render if no items or single page
  if (totalPages <= 1 || !hasItems) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-6 bg-white border-t border-gray-200 ${className}`}
      >
        {/* Page Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* First Page */}
          <button
            onClick={() => goToPage(1)}
            disabled={!canGoBack}
            className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <FiChevronsLeft size={18} />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canGoBack}
            className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <FiChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(page)}
                    disabled={page === currentPage || isLoading}
                    className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Page Input */}
          <AnimatePresence mode="wait">
            {showPageInput ? (
              <motion.form
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                onSubmit={handlePageSubmit}
                className="flex items-center gap-2"
              >
                <input
                  ref={pageInputRef}
                  type="number"
                  min="1"
                  max={totalPages}
                  value={inputPage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[1-9]\d*$/.test(value)) {
                      setInputPage(value);
                    }
                  }}
                  onBlur={() => setShowPageInput(false)}
                  className="w-16 h-10 text-sm border rounded-md px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
                  aria-label="Enter page number"
                />
                <button 
                  type="submit"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="page-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPageInput(true)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-medium"
                aria-label="Enter page number"
              >
                {currentPage} of {totalPages}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Next Page */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canGoForward}
            className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <FiChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => goToPage(totalPages)}
            disabled={!canGoForward}
            className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <FiChevronsRight size={18} />
          </button>
        </div>

        {/* Item Count */}
        <div className="text-sm text-gray-600">
          {isLoading ? (
            'Loading items...'
          ) : (
            `Showing ${itemStart.toLocaleString()} to ${itemEnd.toLocaleString()} of ${safeTotalItems.toLocaleString()}`
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

Pagination.defaultProps = {
  itemsPerPage: 10,
  isLoading: false,
  className: "",
};

export default Pagination;