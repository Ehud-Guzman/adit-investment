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
import RequireAuth from "@/components/RequireAuth";
import RequireRole from "@/components/RequireRole";

// Pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import Account from "@/pages/Account/Account"; // ✅ Parent layout
import MyOrders from "@/pages/Account/MyOrders"; // ✅ User orders page
import AccountProfile from "@/pages/Account/AccountProfile"; // ✅ User profile page

// Lazy-loaded
const SettingPage = lazy(() => import("@/components/Admin/settings/SettingsPage"));
const VerifyEmail = lazy(() => import("@/pages/Auth/VerifyEmail"));
const ResendVerification = lazy(() => import("@/pages/Auth/ResendVerification"));

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const location = useLocation();
  const { currentUser: adminUser, logout: adminLogout } = useAdminAuth();

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes location={location}>
          {/* 🌍 Public Routes */}
          <Route
            path="/"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><Home /></MainLayout>}
          />
          <Route
            path="/products"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><Products /></MainLayout>}
          />
          <Route
            path="/services"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><Services /></MainLayout>}
          />
          <Route
            path="/about"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><About /></MainLayout>}
          />
          <Route
            path="/contact"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><Contact /></MainLayout>}
          />
          <Route
            path="/checkout"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><Checkout /></MainLayout>}
          />
          <Route
            path="/order-confirmation"
            element={<MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}><ThankYou /></MainLayout>}
          />

          {/* 🔐 Auth routes */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* 🧑‍💼 Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout user={adminUser} onLogout={adminLogout}>
                <Admin />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <RequireRole allowedRoles={["superadmin"]}>
                <AdminLayout user={adminUser} onLogout={adminLogout}>
                  <SettingPage />
                </AdminLayout>
              </RequireRole>
            }
          />

          {/* 👤 Account Routes (User Panel) */}
          <Route
            path="/account"
            element={
              <RequireAuth>
                <MainLayout setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode}>
                  <Account />
                </MainLayout>
              </RequireAuth>
            }
          >
            <Route index element={<AccountProfile />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          {/* 🧼 Fallback */}
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
