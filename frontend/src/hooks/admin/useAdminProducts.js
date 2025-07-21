import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api/adminProducts";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function useAdminProducts() {
  const { isAuthenticated, isAdmin } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
      const errMsg = "Unauthorized: Admin access only";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    try {
      setLoading(true);
      const res = await getAdminProducts();
      const data = Array.isArray(res) ? res : res?.products || [];

      if (!Array.isArray(data)) throw new Error("Unexpected product format");
      setProducts(data);
      return data;
    } catch (err) {
      const msg = err?.message || "Failed to fetch products";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const handleCreate = async (data) => {
    if (!isAuthenticated || !isAdmin) {
      toast.error("Unauthorized: Can't create product");
      return;
    }

    try {
      setCreating(true);
      const res = await createProduct(data);
      const created = res?.product || res;

      if (!created?._id) throw new Error("Invalid response after creation");

      setProducts((prev) => [created, ...prev]);
      
      return created;
    } catch (err) {
      const msg = err?.message || "Create failed";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id, data) => {
    if (!isAuthenticated || !isAdmin) {
      toast.error("Unauthorized: Can't update product");
      return;
    }

    try {
      setUpdating(true);
      const res = await updateProduct(id, data);
      const updated = res?.product || res;

      if (!updated?._id) throw new Error("Invalid update response");

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
      );
      toast.success("✅ Product updated");
      return updated;
    } catch (err) {
      const msg = err?.message || "Update failed";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated || !isAdmin) {
      toast.error("Unauthorized: Can't delete product");
      return;
    }

    try {
      setDeleting(true);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("🗑️ Product deleted");
    } catch (err) {
      const msg = err?.message || "Delete failed";
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {
    products,
    editing,
    setEditing,
    loading,
    creating,
    updating,
    deleting,
    error,
    fetchProducts,
    handleCreate,
    handleUpdate,
    handleDelete,
    setProducts,
  };
}
