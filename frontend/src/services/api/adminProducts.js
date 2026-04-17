// services/api/adminProducts.js
import adminApi from './adminApi';

export const getAdminProducts = async () => {
  try {
    const res = await adminApi.get('/admin/products'); // 🔥 FIXED
    return res.data;
  } catch (error) {
    console.error("getAdminProducts error:", {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      fullResponse: error.response?.data
    });
    throw error;
  }
};

export const createProduct = async (productData) => {
  const res = await adminApi.post('/admin/products', productData); // 🔥 FIXED
  return res.data;
};

export const updateProduct = async (productId, productData) => {
  const res = await adminApi.put(`/admin/products/${productId}`, productData); // 🔥 FIXED
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await adminApi.delete(`/admin/products/${productId}`); // 🔥 FIXED
  return res.data;
};
export const getProductById = async (productId) => {
  const res = await adminApi.get(`/admin/products/${productId}`); // 🔥 FIXED
  return res.data;
};
export const exportProductsXlsx = async () => {
  const res = await adminApi.get('/admin/products/export', { responseType: 'blob', timeout: 60000 });
  return res.data; // Blob
};

export const importProductsFromXlsx = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await adminApi.post('/admin/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // large files may take longer
  });
  return res.data;
};

export const getAdminProductsByCategory = async (category) => {
  try {
    const res = await adminApi.get(`/admin/products/category/${category}`); // 🔥 FIXED
    return res.data;
  } catch (error) {
    console.error("getAdminProductsByCategory error:", {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      fullResponse: error.response?.data
    });
    throw error;
  }
};

