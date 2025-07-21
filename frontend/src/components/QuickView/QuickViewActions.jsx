// ✅ QuickViewActions.jsx
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import QuantitySelector from "../QuantitySelector";

const QuickViewActions = ({ product, quantity, setQuantity, handleAddToCart }) => {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-6 sm:mb-8">
      <QuantitySelector
        quantity={quantity}
        onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
        onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
        max={product.stock}
        size="lg"
      />
      <motion.button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 rounded-lg ${
          product.stock <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
        } transition-colors`}
        whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
        aria-label="Add to cart"
      >
        <FiShoppingCart size={20} />
        Add to Cart
      </motion.button>
    </div>
  );
};

export default QuickViewActions;
