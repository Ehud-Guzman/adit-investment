// 🔥 Polished & bug-proof CartSidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";
import PriceDisplay from "./PriceDisplay";
import QuantitySelector from "./QuantitySelector";

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
  const subtotal =
    cart.reduce((sum, item) => {
      const product = products.find((p) => p._id?.toString?.() === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0) || 0;

  const shippingFee = subtotal > 100000 ? 0 : 500;
  const total = subtotal + shippingFee;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[100] shadow-xl flex flex-col"
          >
            <div className="p-4 sm:p-6 flex-1 flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiShoppingCart className="text-blue-600 w-6 h-6" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">
                    Your Cart{" "}
                    <span className="text-blue-600">({cart.length})</span>
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Empty State */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="bg-gray-100 rounded-full p-6 mb-6">
                    <FiShoppingCart className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    Your cart feels lonely
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Add some gadgets to make it happy! Explore our latest tech
                    collection.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Browse Products <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 flex-1 pr-1 py-2">
                    {cart.map((item, index) => {
                      const key = item.id || item._id || `cart-item-${index}`;
                      const cartItemId = item.id || item._id;
                      const product = products.find(
                        (p) => p._id === item.productId
                      );

                      if (!product) {
                        return (
                          <div
                            key={key}
                            className="text-sm text-gray-500 italic"
                          >
                            Product not found for cart item {key}
                          </div>
                        );
                      }

                      return (
                        <motion.div
                          key={key}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex gap-4 pb-4 group"
                        >
                          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
                            <img
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.jpg")
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                {product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove from cart"
                              >
                                <FiX size={18} />
                              </button>
                            </div>
                            <PriceDisplay
                              price={product.price}
                              originalPrice={product.originalPrice}
                              size="sm"
                              className="mb-2"
                            />
                            <div className="flex items-center justify-between">
                              <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={(amt) =>
                                  updateCartQuantity(
                                    cartItemId,
                                    item.quantity + amt
                                  )
                                }
                                onDecrease={(amt) =>
                                  updateCartQuantity(
                                    cartItemId,
                                    Math.max(1, item.quantity - amt)
                                  )
                                }
                                max={product.stock}
                                min={1}
                                size="sm"
                                showMaxWarning={false}
                              />
                              <span className="text-sm font-medium text-gray-800">
                                KSh{" "}
                                {(
                                  product.price * item.quantity
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Summary + Checkout */}
                  <div className="border-t pt-4 mt-4 space-y-4 sticky bottom-0 bg-white pb-2">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          KSh {subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {shippingFee === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `KSh ${shippingFee.toLocaleString()}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-base border-t pt-2">
                        <span>Total:</span>
                        <span className="text-blue-600">
                          KSh {total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        disabled
                        className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                      />
                      <button
                        disabled
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-4 py-1.5 rounded-full text-xs opacity-70 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>

                    <div className="grid gap-3 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!cart.length) return;
                          if (!currentUser) {
                            onClose();
                            setAuthModalOpen(true);
                            setAuthMode("login");
                            return;
                          }
                          // Proceed to checkout elsewhere
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        Proceed to Checkout
                      </motion.button>
                      <button
                        onClick={onClose}
                        className="w-full bg-white text-gray-800 py-3.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
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
    </>
  );
};

export default CartSidebar;
