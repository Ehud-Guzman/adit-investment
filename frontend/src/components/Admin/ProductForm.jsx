import { useState } from 'react';
import { FiX, FiSave, FiPlus, FiImage, FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { CATEGORIES } from '@/constants/categories';
import { uploadImage } from "@/services/api/upload";

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false,
  isLoading = false,
}) {
  const [form, setForm] = useState(() => ({
    name: initialData.name ?? '',
    price: initialData.price?.toString() ?? '',
    category: initialData.category ?? '',
    description: initialData.description ?? '',
    stock: initialData.stock?.toString() ?? '0',
    images: initialData.images ?? [],
    featured: initialData.featured ?? false,
    approved: initialData.approved ?? true,
    vendor: initialData.vendor ?? '',
  }));

  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (Number(form.stock) < 0) newErrors.stock = 'Stock cannot be negative';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('❌ Please fix the form errors');
    }

    return Object.keys(newErrors).length === 0;
  };

const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  
  if (!file || !file.type.startsWith("image/")) {
    toast.error("🚫 Invalid image file");
    return;
  }

  try {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    const data = await uploadImage(formData); // 🔥 Hits correct backend via Axios

    setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
    toast.success("📷 Image uploaded!");
  } catch (err) {
    console.error("💥 Upload error:", err.message || err);
    toast.error("❌ Upload failed: " + (err.message || "Something went wrong"));
  } finally {
    setUploadingImage(false);
  }
};

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const preparedData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
    };

    try {
      await onSubmit(preparedData);
    } catch (err) {
      console.error('❌ Submit error:', err);
      toast.error(err?.message || 'Operation failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {isEditing ? 'Update Product' : 'Create New Product'}
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Admin</span>
        </h2>
        {onCancel && (
          <button onClick={onCancel} type="button" className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Premium Headphones"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Price (Ksh) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>

        {/* Multi-image Upload */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded product image ${index + 1}`}
                  className="h-28 w-28 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
                >
                  <FiTrash size={16} />
                </button>
              </div>
            ))}
          </div>

          <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${uploadingImage ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} disabled={uploadingImage} />
            {uploadingImage ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white flex-shrink-0" />
                Uploading…
              </>
            ) : (
              <>
                <FiImage size={16} /> Upload Image
              </>
            )}
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Product features..."
          />
        </div>
      </div>

      {/* Toggles + Vendor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
          />
          Featured
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="approved"
            checked={form.approved}
            onChange={(e) => setForm((prev) => ({ ...prev, approved: e.target.checked }))}
          />
          Approved
        </label>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Vendor</label>
          <select
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Vendor</option>
            <option value="vendor1">Vendor One</option>
            <option value="vendor2">Vendor Two</option>
            <option value="vendor3">Vendor Three</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white ${
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          ) : isEditing ? (
            <FiSave size={18} />
          ) : (
            <FiPlus size={18} />
          )}
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
