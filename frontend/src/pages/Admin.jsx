// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// 🔐 Auth & Hooks
import { useAdminAuth } from "@/hooks/useAdminAuth";
import useAdminProducts from "@/hooks/admin/useAdminProducts";

// Components
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import ProductForm from "@/components/Admin/ProductForm";
import ProductList from "@/components/Admin/ProductList";
import UserTable from "./admin/users/UserTable";
import UserFilters from "./admin/users/UserFilters";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ErrorMessage from "@/components/common/ErrorMessage";
import AdminDashboard from "@/pages/admin/Dashboard";
import SettingsPage from "@/components/Admin/settings/SettingsPage";
import AdminNav from "@/components/Admin/AdminNav";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";



export default function Admin() {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    isLoading,
  } = useAdminAuth();

  const [view, setView] = useState("products");
  const [formError, setFormError] = useState(null);

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

  const [userFilters, setUserFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    page: 1,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts().catch((err) => {
        const msg = err?.response?.data?.message || "Failed to load products.";
        setFormError(msg);
        toast.error(msg);
      });
    }
  }, [isAdmin, fetchProducts]);

  if (isLoading) return <LoadingOverlay message="Checking admin session..." />;

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <AdminLoginForm onLogin={login} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6">
      <AdminNav currentView={view} setView={setView} onLogout={logout} />

      <div className="space-y-8">
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
                onSubmit={async (data) => {
                  setFormError(null);
                  try {
                    if (editing) {
                      await handleUpdate(editing._id, data);
                      toast.success("✅ Product updated");
                      setEditing(null);
                    } else {
                      await handleCreate(data);
                      toast.success("✅ Product created");
                    }
                  } catch (err) {
                    const msg = err?.response?.data?.message || "Product operation failed.";
                    setFormError(msg);
                    toast.error(msg);
                  }
                }}
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

        {view === "settings" && (
          <section className="bg-white p-6 rounded shadow">
            <SettingsPage />
          </section>
        )}

        {view === "users" && (
          <section className="bg-white p-6 rounded shadow space-y-6">
            <h2 className="text-2xl font-semibold">Manage Users</h2>
            <UserFilters filters={userFilters} setFilters={setUserFilters} />
            <UserTable filters={userFilters} />
          </section>
        )}

        {view === "dashboard" && (
          <section className="bg-white p-6 rounded shadow">
            <AdminDashboard />
          </section>
        )}

        {view === "orders" && (
          <section className="bg-white p-6 rounded shadow">
            <AdminOrdersPage />
          </section>
        )}
      </div>
    </div>
  );
}
