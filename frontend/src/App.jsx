// src/App.jsx
import { useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./components/Admin/AdminLayout";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// Shared Components
import ScrollToTop from "@/components/ScrollToTop";
import AuthModal from "@/components/AuthModal";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";




// Lazy
const SettingPage = lazy(() => import("@/components/Admin/settings/SettingsPage"));
const VerifyEmail = lazy(() => import("@/pages/Auth/VerifyEmail"));
const ResendVerification = lazy(() => import("@/pages/Auth/ResendVerification"));

// Route Guard
import RequireRole from "@/components/RequireRole";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const location = useLocation();
  const { currentUser, logout } = useAdminAuth(); // ✅ Admin-specific hook

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes location={location}>
          {/* 🌍 Public Routes */}
          {[
            { path: "/", element: <Home /> },
            { path: "/products", element: <Products /> },
            { path: "/services", element: <Services /> },
            { path: "/about", element: <About /> },
            { path: "/contact", element: <Contact /> },
            { path: "/checkout", element: <Checkout /> },
            { path: "/order-confirmation", element: <ThankYou /> }

            

          ].map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}>
                  {element}
                </MainLayout>
              }
            />
          ))}

          {/* 🔐 Auth pages */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* 🔒 Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout user={currentUser} onLogout={logout}>
                <Admin />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <RequireRole allowedRoles={["superadmin"]}>
                <AdminLayout user={currentUser} onLogout={logout}>
                  <SettingPage />
                </AdminLayout>
              </RequireRole>
            }
          />

          {/* 🧼 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* 🔐 Auth Modal */}
      <div className="relative z-[60]">
        <AuthModal
          isOpen={authModalOpen}
          onClose={handleCloseAuthModal}
          authMode={authMode}
          setAuthMode={setAuthMode}
        />
      </div>

      {/* 🍞 Toasts */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={6}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        hideProgressBar
        theme="colored"
      />
    </>
  );
}
