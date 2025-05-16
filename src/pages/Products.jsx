import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiX, 
  FiPlus, 
  FiMinus, 
  FiImage, 
  FiFilter, 
  FiStar, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight,
  FiSearch,
  FiLoader,
  FiCheck,
  FiClock,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiChevronDown
} from 'react-icons/fi';

import debounce from 'lodash/debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import * as api from '../services/api';

// Constants
const PRODUCTS_PER_PAGE = 12;
const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: '🛒' },
  { value: 'printers', label: 'Printers', icon: '🖨️' },
  { value: 'computers', label: 'Computers', icon: '🖥️' },
  { value: 'laptops', label: 'Laptops', icon: '💻' },
  { value: 'monitors', label: 'Monitors', icon: '🖥️' },
  { value: 'accessories', label: 'Accessories', icon: '⌨️' },
  { value: 'storage', label: 'Storage', icon: '💾' },
  { value: 'toners', label: 'Toners', icon: '🖨️' },
  { value: 'cartridge', label: 'Cartridge', icon: '🖨️'}
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured', icon: '⭐' },
  { value: 'price-low', label: 'Price: Low to High', icon: '⬆️' },
  { value: 'price-high', label: 'Price: High to Low', icon: '⬇️' },
  { value: 'name-asc', label: 'Name: A-Z', icon: '🔤' },
  { value: 'name-desc', label: 'Name: Z-A', icon: '🔠' },
  { value: 'rating-high', label: 'Highest Rated', icon: '🌟' },
  { value: 'newest', label: 'Newest Arrivals', icon: '🆕' }
];

const BENEFITS = [
  { icon: <FiTruck className="text-blue-500" />, text: "Free shipping on orders over KSh 50,000" },
  { icon: <FiShield className="text-blue-500" />, text: "Free Expert Guide" },
  { icon: <FiClock className="text-blue-500" />, text: "Same-day dispatch for orders before 3PM" },
  { icon: <FiCreditCard className="text-blue-500" />, text: "Secure payment processing" }
];

// Utility Components
const RatingStars = ({ rating, size = 5, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            className={`${interactive ? 'cursor-pointer' : ''}`}
            onMouseEnter={interactive ? () => setHoverRating(star) : null}
            onMouseLeave={interactive ? () => setHoverRating(0) : null}
            onClick={interactive ? () => onChange(star) : null}
            disabled={!interactive}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <FiStar 
              className={`w-${size} h-${size} ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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

const PriceDisplay = ({ price, originalPrice, size = 'base', className = '' }) => {
  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl font-bold'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-blue-600 font-bold ${sizeClasses[size]}`}>
        KSh {price.toLocaleString()}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={`text-gray-500 line-through ${sizeClasses[size]}`}>
            KSh {originalPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
};

const QuantitySelector = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  max, 
  min = 1,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  };

  return (
    <div className={`flex items-center border rounded-lg ${sizeClasses[size]}`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`disabled:opacity-50 ${quantity <= min ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
        aria-label="Decrease quantity"
      >
        <FiMinus size={size === 'sm' ? 14 : 18} />
      </button>
      <span className={`mx-2 ${size === 'sm' ? 'w-6' : 'w-8'} text-center`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`disabled:opacity-50 ${quantity >= max ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
        aria-label="Increase quantity"
      >
        <FiPlus size={size === 'sm' ? 14 : 18} />
      </button>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Main Component
export default function Products() {
  // State Management
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const queryClient = useQueryClient();

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data Fetching
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
    staleTime: 1000 * 60 * 5,
    onError: () => toast.error('Failed to load products. Please try again later.'),
  });

  const { data: cart = [], isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: api.getCart,
    staleTime: 1000 * 60 * 5,
  });

  const { data: wishlist = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: api.getWishlist,
    staleTime: 1000 * 60 * 5,
  });

  // Add to Cart
  const addToCartMutation = useMutation({
    mutationFn: api.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Added to cart');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to add to cart'),
  });

  // Update Cart
  const updateCartMutation = useMutation({
    mutationFn: ({ id, item }) => api.updateCartItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart updated');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to update cart'),
  });

  // Remove from Cart
  const removeFromCartMutation = useMutation({
    mutationFn: api.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.info('Removed from cart');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to remove from cart'),
  });

  // Add to Wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: api.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      toast.success('Added to wishlist');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to add to wishlist'),
  });

  // Remove from Wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: api.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      toast.info('Removed from wishlist');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Failed to remove from wishlist'),
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = category === 'all' 
      ? [...products] 
      : products.filter(p => p.category === category);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term) ||
        (p.specs && p.specs.some(s => 
          s.label.toLowerCase().includes(term) || 
          s.value.toLowerCase().includes(term)
        ))
      );
    }

    switch (sortBy) {
      case 'price-low': return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'name-asc': return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-high': return result.sort((a, b) => b.rating - a.rating);
      case 'newest': return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'featured':
      default: return result.sort((a, b) => (b.featured - a.featured) || (b.rating - a.rating));
    }
  }, [products, category, searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (productId, quantity = 1) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock - existingItem.quantity} more available`);
      return;
    }
    updateCartMutation.mutate({
      id: existingItem.id,
      item: { ...existingItem, quantity: newQuantity },
    });
  } else {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} available`);
      return;
    }
    addToCartMutation.mutate({
      productId,
      quantity,
      id: `cart-${Date.now()}`, // unique id
    });
  }
};

// Remove item from cart
const removeFromCart = (cartItemId) => {
  removeFromCartMutation.mutate(cartItemId);
};

// Update cart quantity with proper remove logic when quantity is zero or less
const updateCartQuantity = (productId, newQuantity) => {
  const cartItem = cart.find(item => item.productId === productId);
  const product = products.find(p => p.id === productId);
  if (!cartItem || !product) return;

  if (newQuantity <= 0) {
    removeFromCart(cartItem.id); // remove item if quantity zero or less
    return;
  }
  if (newQuantity > product.stock) {
    toast.error(`Only ${product.stock} available`);
    return;
  }
  updateCartMutation.mutate({
    id: cartItem.id,
    item: { ...cartItem, quantity: newQuantity },
  });
};
  // Wishlist operations
  const toggleWishlist = (productId) => {
    const existingItem = wishlist.find(item => item.productId === productId);
    if (existingItem) {
      removeFromWishlistMutation.mutate(existingItem.id);
    } else {
      addToWishlistMutation.mutate({
        productId,
        id: `wishlist-${Date.now()}`,
      });
    }
  };

  // Quick View operations
  const openQuickView = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
      setSelectedImageIndex(0);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    document.body.style.overflow = '';
  };

  const changeImage = (index) => {
    setSelectedImageIndex(index);
  };

  // Derived values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // Loading and error states
  if (isLoading || cartLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-24 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">We're having trouble loading the products. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
          <motion.header 
      className={`sticky top-16 md:top-20 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ overflow: 'visible' }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.h1 
          className="text-xl sm:text-2xl font-bold text-blue-600"
          whileHover={{ scale: 1.05 }}
        >
          TechHub
        </motion.h1>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search products"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100"
            aria-label={`View cart with ${cartCount} items`}
          >
            <FiShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>

      {/* Main Content */}
          <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-7xl mt-28 md:mt-36">
        {/* Hero Section */}
       <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90"></div>
          <div className="relative z-10 px-6 sm:px-8 py-10 sm:py-12 md:py-16 text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Premium Tech Products
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover our curated collection of high-performance technology for home, school, and office
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                onClick={() => window.scrollTo({ top: document.querySelector('#products').offsetTop - 100, behavior: 'smooth' })}
                className="bg-white text-blue-600 px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                Shop Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Benefits Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {BENEFITS.map((benefit, index) => (
            <motion.div 
              key={index}
              className="bg-white p-3 sm:p-4 rounded-xl shadow-sm flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                {benefit.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">{benefit.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Products Section */}
        <section id="products" className="mb-12 sm:mb-16">
          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              {/* Mobile Filters Toggle */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="md:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
              >
                {filtersOpen ? 'Hide Filters' : 'Filters'}
                <FiFilter size={18} />
              </button>

              {/* Category Chips */}
              <div className="flex-1 w-full overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setCategory(cat.value);
                        setCurrentPage(1);
                      }}
                      className={`whitespace-nowrap px-3 sm:px-4 py-1 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base ${
                        category === cat.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={`Filter by ${cat.label}`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full md:w-auto text-sm sm:text-base"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FiChevronDown size={18} className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="relative mt-4 md:hidden w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setCategory('all');
                  setSearchTerm('');
                  setSortBy('featured');
                }}
                className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <LayoutGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      whileHover={{ 
                        y: -8,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <motion.img
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => (e.target.src = '/placeholder.jpg')}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.featured && (
                            <motion.span 
                              className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Featured
                            </motion.span>
                          )}
                          {product.originalPrice > product.price && (
                            <motion.span 
                              className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </motion.span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <motion.button
                            onClick={() => toggleWishlist(product.id)}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={
                              wishlist.some(item => item.productId === product.id) 
                                ? `Remove ${product.name} from wishlist` 
                                : `Add ${product.name} to wishlist`
                            }
                          >
                            <FiHeart 
                              size={18} 
                              className={
                                wishlist.some(item => item.productId === product.id) 
                                  ? 'text-red-500 fill-current' 
                                  : 'text-gray-700'
                              } 
                            />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => openQuickView(product.id)}
                            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Quick view ${product.name}`}
                          >
                            <FiEye size={18} className="text-gray-700" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="mb-2 sm:mb-3">
                          <RatingStars rating={product.rating} />
                        </div>
                        
                        <PriceDisplay 
                          price={product.price} 
                          originalPrice={product.originalPrice} 
                          size="lg" 
                          className="mb-3 sm:mb-4"
                        />
                        
                        <div className="mt-auto">
                          <button
                            onClick={() => addToCart(product.id)}
                            disabled={product.stock <= 0}
                            className={`w-full flex items-center justify-center gap-2 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                              product.stock <= 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <FiShoppingCart size={18} />
                            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </LayoutGroup>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm sm:text-base text-gray-600">
                    Showing {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-1 sm:py-2 border rounded-full disabled:opacity-50 flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={18} />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded-full transition-colors text-sm sm:text-base ${
                              currentPage === page 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'hover:bg-gray-100'
                            }`}
                            aria-label={`Go to page ${page}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">...</span>
                      )}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
                          aria-label={`Go to page ${totalPages}`}
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-1 sm:py-2 border rounded-full disabled:opacity-50 flex items-center gap-2 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                      aria-label="Next page"
                    >
                      Next
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Stay Updated</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
            Subscribe to our newsletter for the latest products, deals, and tech news
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 sm:py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              aria-label="Email for newsletter subscription"
            />
                       <button className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={closeQuickView}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Close product details"
              >
                <FiX size={24} />
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Product Images */}
                <div>
                  <div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-100">
                    <motion.img
                      key={selectedImageIndex}
                      src={quickViewProduct.images[selectedImageIndex] || '/placeholder.jpg'}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {(quickViewProduct.images || []).map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => changeImage(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all ${
                          selectedImageIndex === index 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        aria-label={`View image ${index + 1} of ${quickViewProduct.name}`}
                      >
                        <img
                          src={image}
                          alt={`${quickViewProduct.name} thumbnail ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{quickViewProduct.name}</h2>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={quickViewProduct.rating} />
                        <span className="text-sm text-gray-500">
                          ({quickViewProduct.reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`p-2 rounded-full ${
                        wishlist.some(i => i.productId === quickViewProduct.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      aria-label={
                        wishlist.some(i => i.productId === quickViewProduct.id) 
                          ? `Remove ${quickViewProduct.name} from wishlist` 
                          : `Add ${quickViewProduct.name} to wishlist`
                      }
                    >
                      <FiHeart 
                        size={20} 
                        fill={wishlist.some(i => i.productId === quickViewProduct.id) ? 'white' : 'none'} 
                      />
                    </button>
                  </div>
                  
                  <PriceDisplay 
                    price={quickViewProduct.price} 
                    originalPrice={quickViewProduct.originalPrice} 
                    size="xl" 
                    className="mb-4 sm:mb-6"
                  />
                  
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        quickViewProduct.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {quickViewProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {quickViewProduct.stock > 0 && (
                        <span className="text-xs sm:text-sm text-gray-600">
                          {quickViewProduct.stock} units available
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                      {quickViewProduct.description || 'No description available'}
                    </p>
                    
                    {(quickViewProduct.specs || []).length > 0 && (
                      <div className="mb-4 sm:mb-6">
                        <h3 className="font-semibold text-lg mb-2 sm:mb-3">Specifications</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {quickViewProduct.specs.map((spec, index) => (
                            <div key={index} className="grid grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base">
                              <span className="col-span-1 text-gray-600">{spec.label}</span>
                              <span className="col-span-2 font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <QuantitySelector
                      quantity={cart.find(i => i.productId === quickViewProduct.id)?.quantity || 1}
                      onIncrease={() => addToCart(quickViewProduct.id, 1)}
                      onDecrease={() => updateCartQuantity(
                        quickViewProduct.id, 
                        (cart.find(i => i.productId === quickViewProduct.id)?.quantity || 1) - 1
                      )}
                      max={quickViewProduct.stock}
                      size="lg"
                    />
                    <motion.button
                      onClick={() => addToCart(quickViewProduct.id)}
                      disabled={quickViewProduct.stock <= 0}
                      className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-lg ${
                        quickViewProduct.stock <= 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      whileHover={quickViewProduct.stock > 0 ? { scale: 1.02 } : {}}
                      whileTap={quickViewProduct.stock > 0 ? { scale: 0.98 } : {}}
                      aria-label={`Add ${quickViewProduct.name} to cart`}
                    >
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Close cart"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <FiShoppingCart className="text-5xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex gap-3 sm:gap-4 py-3 sm:py-4 border-b"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => (e.target.src = '/placeholder.jpg')}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800 line-clamp-1 text-sm sm:text-base">{product.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm"
                                aria-label={`Remove ${product.name} from cart`}
                              >
                                <FiX size={18} />
                              </button>
                            </div>
                            <PriceDisplay 
                              price={product.price} 
                              originalPrice={product.originalPrice}
                              size="sm"
                              className="my-1 sm:my-2"
                            />
                            <div className="flex items-center justify-between">
                              <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={() => updateCartQuantity(product.id, item.quantity + 1)}
                                onDecrease={() => updateCartQuantity(product.id, item.quantity - 1)}
                                max={product.stock}
                                size="sm"
                              />
                              <span className="font-medium text-sm sm:text-base">
                                KSh {(product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {subtotal > 10000 ? 'FREE' : 'KSh 500'}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          KSh {(subtotal > 10000 ? subtotal : subtotal + 500).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-3 sm:mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Promo code"
                          className="w-full pl-4 pr-20 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                          aria-label="Enter promo code"
                        />
                        <button
                          onClick={() => toast.info('Promo code functionality coming soon')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid gap-2 sm:gap-3">
                      <motion.button
                        onClick={() => {
                          if (cart.length === 0) {
                            toast.error('Your cart is empty');
                            return;
                          }
                          toast.success('Proceeding to checkout');
                        }}
                        className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        aria-label="Proceed to checkout"
                      >
                        Proceed to Checkout
                      </motion.button>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="w-full bg-gray-200 text-gray-800 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                        aria-label="Continue shopping"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="space-y-2"></div>
      </div>
    </div>
  );
}