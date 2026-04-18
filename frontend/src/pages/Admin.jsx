// src/pages/Admin.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { FiPlus, FiX, FiMenu, FiUser } from "react-icons/fi";

// Auth & Hooks
import { useAdminAuth } from "@/hooks/useAdminAuth";
import useAdminProducts from "@/hooks/admin/useAdminProducts";

// Components
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import ProductForm from "@/components/Admin/ProductForm";
import ProductList from "@/components/Admin/ProductList";
import UserTable from "./admin/users/UserTable";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ErrorMessage from "@/components/common/ErrorMessage";
import AdminDashboard from "@/pages/admin/Dashboard";
import SettingsPage from "@/components/Admin/settings/SettingsPage";
import AdminNav from "@/components/Admin/AdminNav";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import { importProductsFromXlsx, exportProductsXlsx } from "@/services/api/adminProducts";

const VIEW_LABELS = {
  dashboard: "Dashboard",
  products: "Products",
  orders: "Orders",
  users: "Users",
  settings: "Settings",
};

export default function Admin() {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    isLoading,
  } = useAdminAuth();

  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

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

  const showFormModal = isAdding || !!editing;
  const closeModal = () => { setEditing(null); setIsAdding(false); setFormError(null); };

  useEffect(() => {
    document.body.style.overflow = showFormModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showFormModal]);

  // Excel import/export state
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const importInputRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportProductsXlsx();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `adit_products_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return toast.error("Select an xlsx file first");
    setImporting(true);
    setImportResult(null);
    try {
      const result = await importProductsFromXlsx(importFile);
      setImportResult(result);
      toast.success(`Import done: ${result.inserted} added, ${result.updated} updated`);
      await fetchProducts();
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout');
      if (isTimeout) {
        toast.info("Import is taking longer than expected — refresh in a moment to see the results.");
        setImportResult({ success: true, message: "Import running in background — please refresh to confirm." });
        await fetchProducts();
      } else {
        const msg = err?.response?.data?.message || err.message || "Import failed";
        toast.error(msg);
        setImportResult({ success: false, message: msg });
      }
    } finally {
      setImporting(false);
      setImportFile(null);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

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
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <AdminNav
        currentView={view}
        setView={setView}
        onLogout={logout}
        userName={currentUser?.name || "Admin"}
        userRole={currentUser?.role || "admin"}
        isSuperAdmin={isSuperAdmin}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-800">
              {VIEW_LABELS[view] || view}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiUser size={13} className="text-indigo-600" />
            </div>
            <span className="hidden sm:inline font-medium text-gray-700">
              {currentUser?.name}
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {view === "dashboard" && <AdminDashboard />}

          {view === "products" && (
            <div className="space-y-5">
              {/* Excel Import / Export */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">
                  Excel Import / Export
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  <strong>Import:</strong> upload an xlsx to add/update products.{" "}
                  <strong>Export:</strong> download all products as xlsx.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setImportFile(e.target.files[0] || null)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={handleImport}
                    disabled={importing || !importFile}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-emerald-700 transition-colors"
                  >
                    {importing ? "Importing…" : "Import"}
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                  >
                    {exporting ? "Exporting…" : "Export Excel"}
                  </button>
                </div>

                {importResult && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-sm ${
                      importResult.success
                        ? "bg-emerald-50 border border-emerald-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {importResult.success ? (
                      <>
                        <p className="font-semibold text-emerald-800 mb-1">Import complete</p>
                        <ul className="text-emerald-700 space-y-0.5">
                          <li>Inserted: <strong>{importResult.inserted}</strong></li>
                          <li>Updated: <strong>{importResult.updated}</strong></li>
                          <li>Skipped (blank name): <strong>{importResult.skipped}</strong></li>
                          {importResult.failed > 0 && (
                            <li className="text-red-600">
                              Failed: <strong>{importResult.failed}</strong>
                            </li>
                          )}
                        </ul>
                        {importResult.errors?.length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-red-600 text-xs">
                              Show errors ({importResult.errors.length})
                            </summary>
                            <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                              {importResult.errors.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </>
                    ) : (
                      <p className="text-red-700">{importResult.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Product list */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-semibold text-gray-800">
                    Manage Products{" "}
                    <span className="font-normal text-gray-400">
                      ({products.length})
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                  >
                    <FiPlus size={16} /> Add Product
                  </button>
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
              </div>
            </div>
          )}

          {view === "orders" && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <AdminOrdersPage />
            </div>
          )}

          {view === "users" && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Manage Users</h2>
              <UserTable isSuperAdmin={isSuperAdmin} />
            </div>
          )}

          {view === "settings" && (
            isSuperAdmin ? (
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <SettingsPage />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <FiUser size={24} className="text-red-400" />
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Access Denied</h2>
                <p className="text-sm text-gray-500 max-w-xs">
                  Settings are restricted to superadmins. Contact your superadmin if you need access.
                </p>
              </div>
            )
          )}
        </main>
      </div>

      {/* Product add/edit modal */}
      {showFormModal &&
        createPortal(
          <div className="fixed inset-0 z-[200]">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <div className="relative h-full overflow-y-auto">
              <div className="flex min-h-full items-start justify-center p-6">
                <div className="relative my-8 w-full max-w-3xl">
                  <button
                    onClick={closeModal}
                    className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-1.5 shadow-lg text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                  {formError && <ErrorMessage message={formError} />}
                  <ProductForm
                    key={editing?._id ?? 'new'}
                    isEditing={!!editing}
                    initialData={editing || {}}
                    onSubmit={async (data) => {
                      setFormError(null);
                      try {
                        if (editing) {
                          await handleUpdate(editing._id, data);
                        } else {
                          await handleCreate(data);
                          toast.success("Product created");
                        }
                        closeModal();
                      } catch (err) {
                        const msg =
                          err?.response?.data?.message || "Product operation failed.";
                        setFormError(msg);
                        toast.error(msg);
                      }
                    }}
                    onCancel={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
