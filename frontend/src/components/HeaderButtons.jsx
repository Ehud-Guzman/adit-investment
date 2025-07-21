// components/HeaderButtons.jsx
import React from "react";
import { FiShoppingCart, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import UserAvatar from "./UserAvatar";

const HeaderButtons = ({
  cartCount,
  currentUser,
  handleCartClick,
  logout,
  setAuthModalOpen,
  setAuthMode,
}) => {
  return (
    <>
      <motion.button
        onClick={handleCartClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="Cart"
      >
        <FiShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full">
            {cartCount}
          </span>
        )}
        <span className="hidden lg:inline">Cart</span>
      </motion.button>

      {currentUser ? (
        <>
          <UserAvatar user={currentUser} />
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors"
            aria-label="Logout"
          >
            <FiLogOut size={22} />
            <span className="hidden lg:inline">Logout</span>
          </motion.button>
        </>
      ) : (
        <>
          <motion.button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("login");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-4 py-2 rounded-lg transition-all"
            aria-label="Login"
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("register");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            aria-label="Register"
          >
            Register
          </motion.button>
        </>
      )}
    </>
  );
};

export default HeaderButtons;
