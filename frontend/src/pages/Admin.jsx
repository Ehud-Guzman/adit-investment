// src/pages/Admin.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";

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
import { importProductsFromXlsx, exportProductsXlsx } from "@/services/api/adminProducts";



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

  const [userFilters, setUserFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    page: 1,
  });

  // ── Excel import/export state ───────────────────────────────────
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
      const a = document.createElement('a');
      a.href = url;
      a.download = `adit_products_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Export failed');
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
      // Refresh product list
      await fetchProducts();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Import failed";
      toast.error(msg);
      setImportResult({ success: false, message: msg });
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
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6">
      <AdminNav currentView={view} setView={setView} onLogout={logout} />

      <div className="space-y-8">
        {view === "products" && (
          <>
            {/* ── Excel Import / Export ── */}
            <section className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-3">Excel Import / Export</h2>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Import:</strong> upload an xlsx file to add/update products. <strong>Export:</strong> download all current products as xlsx.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => setImportFile(e.target.files[0] || null)}
                  className="border rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={handleImport}
                  disabled={importing || !importFile}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-green-700"
                >
                  {importing ? "Importing…" : "Import"}
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
                >
                  {exporting ? "Exporting…" : "Export Excel"}
                </button>
              </div>

              {importResult && (
                <div className={`mt-4 p-4 rounded text-sm ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {importResult.success ? (
                    <>
                      <p className="font-semibold text-green-800 mb-1">Import complete</p>
                      <ul className="text-green-700 space-y-0.5">
                        <li>Inserted: <strong>{importResult.inserted}</strong></li>
                        <li>Updated: <strong>{importResult.updated}</strong></li>
                        <li>Skipped (blank name): <strong>{importResult.skipped}</strong></li>
                        {importResult.failed > 0 && <li className="text-red-600">Failed: <strong>{importResult.failed}</strong></li>}
                      </ul>
                      {importResult.errors?.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-red-600 text-xs">Show errors ({importResult.errors.length})</summary>
                          <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                            {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                          </ul>
                        </details>
                      )}
                    </>
                  ) : (
                    <p className="text-red-700">{importResult.message}</p>
                  )}
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Manage Products</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                  >
                    <FiPlus size={16} /> Add Product
                  </button>
                </div>
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

            {/* ── Edit / Add modal ── */}
            {showFormModal && createPortal(
              <div className="fixed inset-0 z-[200]">
                {/* Backdrop — click to close */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

                {/* Scroll container — separate from backdrop so its scrollbar never triggers close */}
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
                        isEditing={!!editing}
                        initialData={editing || {}}
                        onSubmit={async (data) => {
                          setFormError(null);
                          try {
                            if (editing) {
                              await handleUpdate(editing._id, data);
                            } else {
                              await handleCreate(data);
                              toast.success("✅ Product created");
                            }
                            closeModal();
                          } catch (err) {
                            const msg = err?.response?.data?.message || "Product operation failed.";
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
