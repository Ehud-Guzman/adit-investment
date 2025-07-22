// App.jsx
import { useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout & UI
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "@/layout/Footer/Footer";
import AuthModal from "./components/AuthModal";


// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// Pages (eagerly loaded)
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

// Lazy-loaded (for perf)
const SettingPage = lazy(() =>
  import("./components/Admin/settings/SettingsPage")
);
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const ResendVerification = lazy(() =>
  import("./pages/Auth/ResendVerification")
);

// RBAC wrapper (create this in /components)
import RequireRole from "./components/RequireRole";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-zinc-100 relative">
        {/* 🧭 Navbar */}
        <Navbar
          setAuthModalOpen={setAuthModalOpen}
          setAuthMode={setAuthMode}
          authModalOpen={authModalOpen}
          authMode={authMode}
        />

        {/* 📦 Route Views */}
        <main className="flex-grow mt-[72px] px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={<div className="text-center py-10">Loading...</div>}
          >
            <Routes location={location}>
              {/* 🌐 Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route
                path="/resend-verification"
                element={<ResendVerification />}
              />

              {/* 🔐 Admin Portal (open access, handles login itself) */}
              <Route path="/admin" element={<Admin />} />

              {/* ⚙️ Settings & Integrations - Super Admin Only */}
              <Route
                path="/admin/settings"
                element={
                  <RequireRole allowedRoles={["superadmin"]}>
                    <SettingPage />
                  </RequireRole>
                }
              />

              {/* 🧼 Catch-all route (optional) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* 🔻 Footer */}
        <Footer />

        {/* 🔐 Auth Modal */}
        <div className="relative z-[60]">
          <AuthModal
            isOpen={authModalOpen}
            onClose={handleCloseAuthModal}
            authMode={authMode}
            setAuthMode={setAuthMode}
          />
        </div>
      </div>

      {/* 🍞 Global Toasts */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000} // ⏱️ Standard toast duration (adjust as needed)
        limit={6} // ✅ Show more toasts without overwhelming
        newestOnTop={true} // 🆕 Always see the latest first
        closeOnClick={true} // 👆 Let users dismiss easily
        pauseOnFocusLoss={false} // 🚫 Don’t pause when switching tabs (for speed)
        pauseOnHover={true} // 🖱️ Let users hover to pause if needed
        draggable={false} // 🚫 Keep UX clean; no dragging required
        hideProgressBar={true} // 🧼 Clean UI — no jittery progress
        theme="colored" // 🎨 Vibrant and consistent styling
      />
    </>
  );
}
