import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import HeaderButtons from "./HeaderButtons";
import MobileMenu from "./MobileMenu";

const Header = ({
  cartCount,
  setCartOpen,
  setAuthModalOpen,
  setAuthMode,
  isScrolled,
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  // 🔔 Toast for unverified users
  useEffect(() => {
    if (currentUser && !currentUser.isVerified) {
      toast.info("⚠️ Please verify your email to unlock full access.");
    }
  }, [currentUser]);

  // 📱 Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest(".mobile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // 🛒 Cart access control
  const handleCartClick = () => {
    if (!currentUser) {
      toast.info("Please log in to view your cart");
      setAuthMode("login");
      setAuthModalOpen(true);
    } else if (!currentUser.isVerified) {
      toast.warning("Please verify your email before using the cart.");
    } else {
      setCartOpen(true);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-4 z-[90] transition-all duration-300 min-h-[88px] ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-white py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* 🔵 Left - Logo or Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
            }}
            className={`transform-gpu transition-all duration-300 bg-white/80 backdrop-blur-lg border border-blue-100 shadow-inner px-4 sm:px-6 py-2 sm:py-3 rounded-2xl ${
              isScrolled ? "scale-[0.95] origin-left" : ""
            }`}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-700 tracking-wide drop-shadow-sm">
              Explore Our Products
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 italic mt-0.5 sm:mt-1">
              Find your next deal, secure your tech.
            </p>
          </motion.div>

          {/* 🖥️ Right - Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <HeaderButtons
              cartCount={cartCount}
              currentUser={currentUser}
              handleCartClick={handleCartClick}
              logout={logout}
              setAuthModalOpen={setAuthModalOpen}
              setAuthMode={setAuthMode}
            />
          </nav>

          {/* 📱 Mobile Nav Toggle */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className={`md:hidden text-gray-700 hover:text-blue-600 p-2 transition-colors ${
              isMenuOpen ? "text-blue-600" : ""
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX size={24} className="transition-transform duration-300" />
            ) : (
              <FiMenu size={24} className="transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* 📱 Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mobile-menu-container overflow-hidden bg-white mt-3 rounded-lg shadow-xl border border-gray-100"
            >
              <MobileMenu
                cartCount={cartCount}
                currentUser={currentUser}
                handleCartClick={handleCartClick}
                logout={logout}
                setAuthModalOpen={setAuthModalOpen}
                setAuthMode={setAuthMode}
                closeMenu={closeMenu}
              />
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
