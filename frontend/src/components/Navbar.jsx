import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@components/Nav/Logo";
import NavAd from "@components/Nav/NavAd";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/admin", label: "Admin" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-[99] w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-gradient-to-r from-white via-[#f0fdfa] to-[#e0ffe6] text-dark shadow-md"
            : "bg-gradient-to-r from-white/80 via-[#f0fdfa]/60 to-[#e0ffe6]/50 text-dark backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Logo />

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-2 items-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const isProducts = link.label === "Products";

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-primary to-accent text-white shadow-sm"
                        : isProducts
                        ? "text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-md animate-pulse"
                        : "text-gray-600 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {isProducts ? "🔥 Products" : link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/10 shadow-sm"
            >
              <div className="px-4 py-3 flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  const isProducts = link.label === "Products";

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-md font-medium text-sm ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-accent text-white"
                          : isProducts
                          ? "text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                      }`}
                    >
                      {isProducts ? "🔥 Products" : link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 👇 Ad just below the navbar */}
      <NavAd />
    </>
  );
}
