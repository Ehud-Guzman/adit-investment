// components/MobileMenu.jsx
import React from "react";
import {
  FiShoppingCart,
  FiLogOut,
  FiUser,
  FiArrowLeft,
  FiPackage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({
  cartCount,
  currentUser,
  handleCartClick,
  logout,
  setAuthModalOpen,
  setAuthMode,
  closeMenu,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="py-2 space-y-1 border-t px-3">
      {/* 🔙 Go Back */}
      <button
        onClick={closeMenu}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 px-2 py-2"
      >
        <FiArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* 🛒 Cart */}
      <button
        onClick={() => {
          handleCartClick();
          closeMenu();
        }}
        className="flex items-center gap-3 w-full px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
      >
        <FiShoppingCart size={20} />
        <span>Cart ({cartCount})</span>
      </button>

      {currentUser ? (
        <>
          {/* 👤 My Profile */}
          <button
            onClick={() => handleNavigate("/account/profile")}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <FiUser size={20} />
            <span>My Profile</span>
          </button>

          {/* 📦 My Orders */}
          <button
            onClick={() => handleNavigate("/account/orders")}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <FiPackage size={20} />
            <span>My Orders</span>
          </button>

          {/* 🔓 Logout */}
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <>
          {/* 🔐 Login */}
          <button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("login");
              closeMenu();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <FiUser size={20} />
            <span>Login</span>
          </button>

          {/* 🆕 Register */}
          <button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("register");
              closeMenu();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
          >
            <FiUser size={20} />
            <span>Register</span>
          </button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
