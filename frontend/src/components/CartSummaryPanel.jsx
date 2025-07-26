// components/CartSummaryPanel.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartSummaryPanel = ({
  subtotal,
  shippingFee,
  total,
  onClose,
  currentUser,
  setAuthModalOpen,
  setAuthMode,
}) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser) {
      // 🧠 Not logged in? Prompt login first
      onClose?.(); // UX: close cart sidebar
      setAuthModalOpen(true);
      setAuthMode("login");
      return;
    }

    // 🚀 Logged in? Redirect to checkout
    onClose?.();
    navigate("/checkout");
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-white rounded-2xl p-5 shadow-lg space-y-4 w-full max-w-md mx-auto"
    >
      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
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
          
          <span className="text-blue-600">KSh {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Promo Code (Disabled for now) */}
      <div className="relative mt-2">
        <input
          type="text"
          placeholder="Enter promo code"
          disabled
          className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-full text-sm bg-gray-100 cursor-not-allowed"
        />
        <button
          disabled
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-4 py-1.5 rounded-full text-xs opacity-70 cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>

      {/* CTA Buttons */}
      <div className="grid gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg hover:opacity-90 transition text-sm font-medium"
        >
          Proceed to Checkout
        </motion.button>
        <button
          onClick={onClose}
          className="w-full bg-white text-gray-800 py-3.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </motion.div>
  );
};

export default CartSummaryPanel;
