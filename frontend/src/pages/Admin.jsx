// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 🔐 Auth & Data Hooks
import { useAdminAuth } from "@/hooks/useAdminAuth";
import useAdminProducts from "@/hooks/admin/useAdminProducts";

// 🧱 Layout & UI
import AdminLayout from "@/components/Admin/AdminLayout";
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import ProductForm from "@/components/Admin/ProductForm";
import ProductList from "@/components/Admin/ProductList";
import UserTable from "./admin/users/UserTable";
import UserFilters from "./admin/users/UserFilters";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ErrorMessage from "@/components/common/ErrorMessage";
import AdminDashboard from "@/pages/admin/Dashboard";
import SettingsPage from "@/components/Admin/settings/SettingsPage";

export default function Admin() {
  const navigate = useNavigate();

  // ✅ Auth state
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    isLoading,
  } = useAdminAuth();

  // ✅ UI state
  const [view, setView] = useState("products");
  const [formError, setFormError] = useState(null);

  // ✅ Product logic
  const {
    products,
    loading: productsLoading,
    error: productsError,
    editing,
    setEditing,
    fetchProducts,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useAdminProducts();

  // ✅ User filter state
  const [userFilters, setUserFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    page: 1,
  });

  // 🚀 Fetch products on load (if admin)
  useEffect(() => {
    if (isAdmin) {
      fetchProducts().catch((err) => {
        const message =
          err?.response?.data?.message || "Failed to load products.";
        setFormError(message);
        toast.error(message);
      });
    }
  }, [isAdmin, fetchProducts]);

  // 🔒 Notify after logout
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const justLoggedOut = localStorage.getItem("adminLoggedOut");
      if (justLoggedOut === "1") {
        toast.info("👋 You’ve been securely logged out");
        localStorage.removeItem("adminLoggedOut");
      }
    }
  }, [isAuthenticated, isLoading]);

  // 📤 Handle form submit
  const handleSubmit = async (data) => {
    setFormError(null);
    try {
      if (editing) {
        await handleUpdate(editing._id, data);
        toast.success("✅ Product updated");
        setEditing(null);
      } else {
        await handleCreate(data);
       
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Product operation failed.";
      setFormError(message);
      toast.error(message);
    }
  };

  // 🔓 Handle logout
  const handleLogout = () => {
    logout();
  };

  // ⏳ Loading session
  if (isLoading) {
    return <LoadingOverlay message="Checking admin session..." />;
  }

  // 🔐 Block unauthenticated access
  if (!isAuthenticated || !isAdmin) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <AdminLoginForm onLogin={login} />
        </div>
      </AdminLayout>
    );
  }

  // ✅ Main Admin UI
  return (
    <AdminLayout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-8 p-4">
        {/* 🧭 View Switcher */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setView("products")}
            className={`px-4 py-2 rounded ${
              view === "products"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Manage Products
          </button>

          <button
            onClick={() => setView("settings")}
            className={`px-4 py-2 rounded ${
              view === "settings"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Settings
          </button>

          <button
            onClick={() => setView("users")}
            className={`px-4 py-2 rounded ${
              view === "users"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Manage Users
          </button>

          <button
            onClick={() => setView("dashboard")}
            className={`px-4 py-2 rounded ${
              view === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* 📦 Product Management */}
        {view === "products" && (
          <>
            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-semibold mb-4">
                {editing ? "Edit Product" : "Add New Product"}
              </h2>
              {formError && <ErrorMessage message={formError} />}
              <ProductForm
                isEditing={!!editing}
                initialData={editing || {}}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(null)}
              />
            </section>

            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Manage Products</h2>
                <span className="text-sm text-gray-500">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </span>
              </div>

              {productsError && <ErrorMessage message={productsError} />}
              {productsLoading ? (
                <LoadingOverlay message="Loading products..." />
              ) : (
                <ProductList
                  products={products}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              )}
            </section>
          </>
        )}

        {/* ⚙️ Settings & Integrations */}
        {view === "settings" && (
          <section className="bg-white p-6 rounded shadow space-y-6">
            <SettingsPage />
          </section>
        )}

        {/* 👥 User Management */}
        {view === "users" && (
          <section className="bg-white p-6 rounded shadow space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Manage Users</h2>
            </div>
            <UserFilters filters={userFilters} setFilters={setUserFilters} />
            <UserTable filters={userFilters} />
          </section>
        )}

        {/* 📊 Admin Dashboard */}
        {view === "dashboard" && (
          <section className="bg-white p-6 rounded shadow space-y-6">
            <AdminDashboard />
          </section>
        )}
      </div>
    </AdminLayout>
  );
}