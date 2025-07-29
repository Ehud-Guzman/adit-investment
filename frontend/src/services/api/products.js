import { api } from './index';

export const getProducts = async (page = 1, limit = 12, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...(filters.category && filters.category !== 'all' && { category: filters.category }),
      ...(filters.sort && { sort: filters.sort }),
      ...(filters.search && { search: filters.search })
    };
    
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);
    
    // Extract pagination data correctly
    const paginationData = response.data.pagination || {
      page,
      limit,
      total: 0,
      pages: 1,
      hasNext: false,
      hasPrev: false
    };
    
    return {
      products: response.data.data || [],
      pagination: paginationData
    };
  } catch (error) {
    console.error('API Error - getProducts:', error);
    return { 
      products: [], 
      pagination: { 
        page, 
        limit, 
        total: 0, 
        pages: 1, 
        hasNext: false, 
        hasPrev: false 
      } 
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data || null;
  } catch (error) {
    console.error('API Error - getProductById:', error);
    return null;
  }
};
export async function getFeaturedProducts(limit = 5) {
  const res = await api.get(`/products?featured=true&limit=${limit}`);
  return res.data?.data || [];
}


export const patchProduct = async (id, updates) => {
  try {
    const response = await api.patch(`/products/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("API Error - patchProduct:", error);
    throw error;
  }
};

// api/products.js
export const getRandomProduct = async () => {
  try {
    const response = await api.get(`/products/random`);
    return response.data.data || null;
  } catch (error) {
    console.error('API Error - getRandomProduct:', error);
    return null;
  }
};


export const getProductsByCategory = async (category, page = 1, limit = 12) => {
  try {
    const response = await api.get(`/products?category=${category}&page=${page}&limit=${limit}`);
    return {
      products: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: response.data.pagination || { 
        page, 
        limit, 
        total: 0, 
        pages: 1, 
        hasNext: false, 
        hasPrev: false 
      }
    };
  } catch (error) {
    console.error('API Error - getProductsByCategory:', error);
    return { 
      products: [], 
      pagination: { 
        page, 
        limit, 
        total: 0, 
        pages: 1, 
        hasNext: false, 
        hasPrev: false 
      } 
    };
  }
};