import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiShield, FiArrowRight } from "react-icons/fi";
import Logo from "@components/Nav/Logo";
import NavAd from "@components/Nav/NavAd";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products", badge: "🔥" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 z-[99] w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-white/80 backdrop-blur-xl border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-6">

            <Logo />

            {/* Desktop links — centered */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map(({ to, label, badge }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {label}
                    {badge && (
                      <span className="text-xs leading-none">{badge}</span>
                    )}
                    {/* Active underline */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side: CTA + admin */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  title="Admin Dashboard"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith("/admin")
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <FiShield size={17} />
                </Link>
              )}

              <Link
                to="/contact"
                className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Get a Quote <FiArrowRight size={14} />
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FiX size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FiMenu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ to, label, badge }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={to}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                        }`}
                      >
                        {label}
                        {badge && <span className="text-xs">{badge}</span>}
                      </Link>
                    </motion.div>
                  );
                })}

                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to="/admin"
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith("/admin")
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      <FiShield size={15} /> Admin
                    </Link>
                  </motion.div>
                )}

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (NAV_LINKS.length + 1) * 0.05, duration: 0.2 }}
                  className="pt-2 pb-1"
                >
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get a Quote <FiArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <NavAd />
    </>
  );
}
