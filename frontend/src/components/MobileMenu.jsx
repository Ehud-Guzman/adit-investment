// components/MobileMenu.jsx
import React from "react";
import { FiShoppingCart, FiLogOut, FiUser } from "react-icons/fi";

const MobileMenu = ({
  cartCount,
  currentUser,
  handleCartClick,
  logout,
  setAuthModalOpen,
  setAuthMode,
  closeMenu,
}) => {
  return (
    <div className="py-2 space-y-1 border-t">
      <button
        onClick={() => {
          handleCartClick();
          closeMenu();
        }}
        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <FiShoppingCart size={20} />
        <span>Cart ({cartCount})</span>
      </button>

      {currentUser ? (
        <button
          onClick={() => {
            logout();
            closeMenu();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("login");
              closeMenu();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FiUser size={20} />
            <span>Login</span>
          </button>
          <button
            onClick={() => {
              setAuthModalOpen(true);
              setAuthMode("register");
              closeMenu();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg"
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
