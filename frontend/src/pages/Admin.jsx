import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiPlus, FiEdit, FiTrash, FiX, FiLock, FiLoader, 
  FiChevronDown, FiChevronUp, FiLogOut, FiEye, FiCheck, FiCopy
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';

const CATEGORIES = ['printers', 'computers', 'laptops', 'monitors', 'accessories', 'storage', 'toners'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: CATEGORIES[0],
    description: '',
    stock: '',
    sku: '',
    rating: '',
    reviews: '',
    images: [''],
    specs: [{ label: '', value: '' }],
    featured: false,
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [expandedProduct, setExpandedProduct] = useState(null);

  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
    staleTime: 1000 * 60 * 5,
    onError: () => toast.error('Failed to load products.'),
  });

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: api.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product added successfully');
      setShowAddForm(false);
      resetForm();
    },
    onError: () => toast.error('Failed to add product.'),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }) => api.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product updated successfully');
      setEditProduct(null);
      resetForm();
    },
    onError: () => toast.error('Failed to update product.'),
  });

  const deleteProductMutation = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product.'),
  });

  // Authentication
  const handleLogin = () => {
    if (password === 'adit2025') {
      setIsAuthenticated(true);
      setPassword('');
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  // Form handling
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: CATEGORIES[0],
      description: '',
      stock: '',
      sku: '',
      rating: '',
      reviews: '',
      images: [''],
      specs: [{ label: '', value: '' }],
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e, index = null, field = null) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'images') {
      const images = [...formData.images];
      images[index] = value;
      setFormData({ ...formData, images });
    } else if (name === 'specLabel' || name === 'specValue') {
      const specs = [...formData.specs];
      specs[index][name === 'specLabel' ? 'label' : 'value'] = value;
      setFormData({ ...formData, specs });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addSpecField = () => {
    setFormData({
      ...formData,
      specs: [...formData.specs, { label: '', value: '' }],
    });
  };

  const removeSpecField = (index) => {
    setFormData({
      ...formData,
      specs: formData.specs.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || undefined,
      stock: parseInt(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviews: parseInt(formData.reviews) || 0,
      images: formData.images.filter(img => img.trim() !== ''),
      specs: formData.specs.filter(spec => spec.label.trim() !== '' && spec.value.trim() !== ''),
      id: editProduct ? editProduct.id : `prod-${Date.now()}`,
    };

    if (!product.name || !product.price || !product.category || product.stock < 0) {
      toast.error('Please fill all required fields (Name, Price, Category, Stock).');
      return;
    }

    if (editProduct) {
      updateProductMutation.mutate({ id: editProduct.id, product });
    } else {
      addProductMutation.mutate(product);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      ...product,
      images: product.images.length ? product.images : [''],
      specs: product.specs.length ? product.specs : [{ label: '', value: '' }],
    });
    setShowAddForm(true);
   
  };

  const toggleExpandProduct = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
        <p className="text-gray-600">Please refresh the page or try again later.</p>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                aria-label="Admin password"
              />
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
            <p className="text-gray-600">{products.length} products in inventory</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditProduct(null);
              resetForm();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  {editProduct && (
                    <button
                      onClick={() => {
                        setEditProduct(null);
                        resetForm();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Price (KSh) *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Original Price</label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Stock *</label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Ratings & Featured */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Rating (0-5)</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">Reviews</label>
                        <input
                          type="number"
                          name="reviews"
                          value={formData.reviews}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-gray-700 font-medium">Featured Product</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Created At</label>
                      <input
                        type="date"
                        name="createdAt"
                        value={formData.createdAt}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Enter detailed product description..."
                    />
                  </div>

                  {/* Images */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium">Product Images</label>
                    <div className="space-y-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1 flex gap-3">
                            <div className="w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-100">
                              {img ? (
                                <img
                                  src={img}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <FiEye size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                name="images"
                                value={img}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                                placeholder="Enter image URL"
                              />
                              {img && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(img)}
                                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm"
                                >
                                  <FiCopy /> Copy URL
                                </button>
                              )}
                            </div>
                          </div>
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="p-2 text-red-500 hover:text-red-700 mt-1"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImageField}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        <FiPlus /> Add Another Image
                      </button>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 font-medium">Specifications</label>
                    <div className="space-y-3">
                      {formData.specs.map((spec, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                name="specLabel"
                                value={spec.label}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Label (e.g., Print Speed)"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="specValue"
                                value={spec.value}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Value (e.g., 30ppm)"
                              />
                            </div>
                          </div>
                          {formData.specs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecField(index)}
                              className="p-2 text-red-500 hover:text-red-700"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSpecField}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        <FiPlus /> Add Specification
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      disabled={addProductMutation.isLoading || updateProductMutation.isLoading}
                    >
                      {addProductMutation.isLoading || updateProductMutation.isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <FiLoader className="animate-spin" /> Processing...
                        </span>
                      ) : editProduct ? (
                        'Update Product'
                      ) : (
                        'Add Product'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-700">Product</th>
                  <th className="p-4 text-left font-medium text-gray-700">Price</th>
                  <th className="p-4 text-left font-medium text-gray-700">Category</th>
                  <th className="p-4 text-left font-medium text-gray-700">Stock</th>
                  <th className="p-4 text-left font-medium text-gray-700">Status</th>
                  <th className="p-4 text-right font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <>
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex-shrink-0 border rounded overflow-hidden bg-gray-100">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = '/placeholder.jpg')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiEye />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku || 'No SKU'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">KSh {product.price.toLocaleString()}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            KSh {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4 capitalize">{product.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        {product.featured && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleExpandProduct(product.id)}
                            className="p-2 text-gray-600 hover:text-blue-600"
                            aria-label={`${expandedProduct === product.id ? 'Collapse' : 'Expand'} product details`}
                          >
                            {expandedProduct === product.id ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            aria-label={`Edit ${product.name}`}
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                deleteProductMutation.mutate(product.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800"
                            aria-label={`Delete ${product.name}`}
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    {expandedProduct === product.id && (
                      <tr className="border-t bg-gray-50">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                              <p className="text-gray-600">
                                {product.description || 'No description available'}
                              </p>
                              
                              <h3 className="font-medium text-gray-900 mt-4 mb-2">Images</h3>
                              <div className="flex flex-wrap gap-2">
                                {product.images.length > 0 ? (
                                  product.images.map((img, index) => (
                                    <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                                      <img
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = '/placeholder.jpg')}
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-gray-500">No images</div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                              {product.specs.length > 0 ? (
                                <ul className="space-y-2">
                                  {product.specs.map((spec, index) => (
                                    <li key={index} className="flex">
                                      <span className="font-medium text-gray-700 w-1/3">{spec.label}:</span>
                                      <span className="text-gray-600 flex-1">{spec.value}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-gray-500">No specifications</div>
                              )}
                              
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium text-gray-900 mb-2">Rating</h3>
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span>{product.rating || '0'}/5</span>
                                    <span className="text-gray-500 ml-2">
                                      ({product.reviews || '0'} reviews)
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-medium text-gray-900 mb-2">Created</h3>
                                  <div className="text-gray-600">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
            <div className="p-8 text-center">
              <FiEye className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">Add your first product to get started</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}