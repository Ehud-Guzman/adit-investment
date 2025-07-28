// CartSidebar.jsx - Enhanced premium cart component with better product visibility
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiX, FiArrowRight, FiHeart, FiStar, FiTruck, FiZap, FiMinus, FiPlus } from "react-icons/fi";
import PriceDisplay from "./PriceDisplay";
import QuantitySelector from "./QuantitySelector";
import CartSummaryPanel from "./CartSummaryPanel";
import UpsellMiniSection from "./UpsellMiniSection";
import { useUpsellSuggestions } from "@/hooks/useUpsellSuggestions";

const CartSidebar = ({
  isOpen,
  onClose,
  cart = [],
  products = [],
  updateCartQuantity = () => {},
  removeFromCart = () => {},
  currentUser,
  setAuthModalOpen,
  setAuthMode,
}) => {
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => {
      const product = products.find((p) => p._id?.toString?.() === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0) || 0, [cart, products]
  );

  const shippingFee = subtotal > 100000 ? 0 : 200;
  const total = subtotal + shippingFee;
  const suggestions = useUpsellSuggestions(cart, products);

  // Premium features
  const [showSummary, setShowSummary] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);
  const [removingItems, setRemovingItems] = useState(new Set());

  // Free shipping progress
  const freeShippingThreshold = 100000;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Estimated delivery
  const estimatedDelivery = useMemo(() => {
    const today = new Date();
    const deliveryDays = subtotal > 100000 ? 1 : 3;
    const deliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }, [subtotal]);

  // Enhanced scroll handling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentY = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const progress = maxScroll > 0 ? (currentY / maxScroll) * 100 : 0;
      
      const isScrollingDown = currentY > lastScrollY.current;
      
      setScrollProgress(progress);
      setIsScrolling(true);
      setShowSummary(!isScrollingDown || currentY < 50);
      
      lastScrollY.current = currentY;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
        setShowSummary(true);
      }, 1000);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Enhanced remove animation
  const handleRemoveItem = useCallback((itemId) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 300);
  }, [removeFromCart]);

  return (
    <>
      {/* Premium Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90]"
            style={{
              background: `
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)
              `,
              backdropFilter: 'blur(12px)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Premium Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", scale: 0.95 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ x: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md shadow-2xl z-[100] flex flex-col overflow-hidden"
            style={{
              borderRadius: "24px 0 0 24px",
              background: "linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FiShoppingCart className="text-white w-5 h-5" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Shopping Cart
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                      {subtotal > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <FiTruck className="w-3 h-3" />
                            <span>Arrives {estimatedDelivery}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
                  aria-label="Close cart"
                >
                  <FiX size={20} />
                </motion.button>
              </div>


            </div>

            <div
              ref={scrollRef}
              className="flex-1 flex flex-col overflow-y-auto bg-slate-50"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(59, 130, 246, 0.3) transparent"
              }}
            >
              {/* Premium Empty State */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-8"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8 shadow-inner">
                      <FiShoppingCart className="w-20 h-20 text-blue-500" />
                    </div>
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center"
                    >
                      <FiHeart className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Your cart awaits</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      Discover amazing products and start building your perfect collection
                    </p>
                  </motion.div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center gap-2">
                      <FiZap className="w-5 h-5" />
                      Explore Products
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FiArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Cart Items - Clean & Balanced */}
                  <div className="px-5 py-4 space-y-3 flex-1">
                    <AnimatePresence>
                      {cart.map((item, index) => {
                        const key = item.id || item._id || `cart-item-${index}`;
                        const cartItemId = item.id || item._id;
                        const product = products.find((p) =>
                          p._id?.toString?.() === item.productId?.toString?.()
                        );

                        if (!product) {
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-red-50 border-2 border-red-200 rounded-2xl p-4"
                            >
                              <p className="text-sm text-red-600 font-medium">
                                ⚠️ Product not found for item {key}
                              </p>
                            </motion.div>
                          );
                        }

                        const isRemoving = removingItems.has(cartItemId);
                        const itemTotal = product.price * item.quantity;

                        return (
                        <motion.div
  key={key}
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ 
    opacity: isRemoving ? 0.3 : 1, 
    y: 0,
    x: isRemoving ? 100 : 0
  }}
  exit={{ opacity: 0, scale: 0.9, x: 100 }}
  whileHover={{ 
    scale: 1.01,
    boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)"
  }}
  className="group bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
>

                            {/* Subtle accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                            
                            <div className="flex gap-4">
                              {/* Clean Product Image - Just Right Size */}
                              <div className="relative flex-shrink-0">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200"
                                >
                                  <img
                                    src={product.images?.[0] || "/placeholder.jpg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover p-1"
                                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                                  />
                                </motion.div>
                                
                                {/* Simple quantity badge */}
                                <motion.div
                                  key={item.quantity}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                                >
                                  {item.quantity}
                                </motion.div>
                              </div>

                              {/* Product Details - Clean & Simple */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-slate-900 text-sm leading-5 line-clamp-2 pr-2">
                                    {product.name}
                                  </h4>
                                  <motion.button
                                    onClick={() => handleRemoveItem(item.id)}
                                    whileHover={{ scale: 1.1 }}
                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"

                                    aria-label="Remove from cart"
                                  >
                                    <FiX size={16} />
                                  </motion.button>
                                </div>

                                {/* Simple Price Display */}
                                <div className="mb-3">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-slate-900">
                                      KSh {product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="text-sm text-slate-500 line-through">
                                        KSh {product.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Clean Quantity & Total */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1">
                                    <button
                                      onClick={() => updateCartQuantity(cartItemId, Math.max(1, item.quantity - 1))}
                                      className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                                      disabled={item.quantity <= 1}
                                    >
                                      <FiMinus size={12} />
                                    </button>
                                    
                                    <span className="w-8 text-center font-medium text-sm">
                                      {item.quantity}
                                    </span>
                                    
                                    <button
                                      onClick={() => updateCartQuantity(cartItemId, item.quantity + 1)}
                                      className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                                      disabled={item.quantity >= product.stock}
                                    >
                                      <FiPlus size={12} />
                                    </button>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="font-bold text-slate-900">
                                      KSh {itemTotal.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      Total
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Upsell Section */}
                  <UpsellMiniSection suggestions={suggestions} />

                  {/* Floating Summary with smart visibility */}
                  <AnimatePresence mode="wait">
                    {showSummary && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="sticky bottom-0 bg-white border-t-2 border-slate-200 shadow-2xl"
                      >
                        <CartSummaryPanel
                          subtotal={subtotal}
                          shippingFee={shippingFee}
                          total={total}
                          onClose={onClose}
                          currentUser={currentUser}
                          setAuthModalOpen={setAuthModalOpen}
                          setAuthMode={setAuthMode}
                          estimatedDelivery={estimatedDelivery}
                          itemCount={cart.length}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Scroll indicator when summary is hidden */}
                  <AnimatePresence>
                    {!showSummary && isScrolling && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-xl z-10 flex items-center gap-3"
                        onClick={() => setShowSummary(true)}
                      >
                        <FiShoppingCart className="w-5 h-5" />
                        <div className="text-sm font-bold">
                          KSh {total.toLocaleString()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Loading State Overlay */}
            <AnimatePresence>
              {removingItems.size > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;