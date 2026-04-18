// components/HeaderButtons.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiUser, FiPackage } from "react-icons/fi";
import { Menu } from "@headlessui/react";
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
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 md:gap-5 shrink-0">
      {/* 🛒 Cart Button */}
      <motion.button
        onClick={handleCartClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
        aria-label="Cart"
      >
        <FiShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full font-medium">
            {cartCount}
          </span>
        )}
        <span className="hidden md:inline text-sm font-medium ml-0.5">Cart</span>
      </motion.button>

      {/* 🧑‍💼 User Menu */}
      {currentUser ? (
        <Menu as="div" className="relative inline-block text-left z-50">
          <Menu.Button as="div" className="cursor-pointer flex items-center gap-2 group">
            <UserAvatar user={currentUser} clickable />

            {/* 👤 Icon + Label */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700 group-hover:text-blue-700 transition">
              <FiUser size={16} />
              <span>My Account</span>
            </div>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden z-[9999]">
            <div className="py-1.5">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleNav("/account/profile")}
                    className={`${
                      active ? "bg-gray-50" : ""
                    } flex items-center gap-3 w-full px-4 py-2.5 text-base`}
                  >
                    <FiUser className="text-gray-500" size={18} /> 
                    <span>Profile</span>
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleNav("/account/orders")}
                    className={`${
                      active ? "bg-gray-50" : ""
                    } flex items-center gap-3 w-full px-4 py-2.5 text-base`}
                  >
                    <FiPackage className="text-gray-500" size={18} /> 
                    <span>Orders</span>
                  </button>
                )}
              </Menu.Item>

              <div className="border-t my-1 border-gray-150" />

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${
                      active ? "bg-red-50" : ""
                    } flex items-center gap-3 w-full px-4 py-2.5 text-base text-red-600`}
                  >
                    <FiLogOut size={18} /> 
                    <span>Logout</span>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* 🔓 Login Button */}
          <motion.button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("login");
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium"
            aria-label="Login"
          >
            Login
          </motion.button>

          {/* 🆕 Register Button */}
          <motion.button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("register");
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all text-xs sm:text-sm font-medium shadow-sm"
            aria-label="Register"
          >
            Register
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default HeaderButtons;
