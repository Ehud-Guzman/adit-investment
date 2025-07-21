import { api } from "./index";// Use the shared Axios instance

// === Get All Products with Filters, Search, Pagination ===
export const getProducts = async (page = 1, limit = 12, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...(filters.category && filters.category !== "all" && { category: filters.category }),
      ...(filters.sort && { sort: filters.sort }),
      ...(filters.search && { search: filters.search }),
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to fetch products");
    }

    return {
      products: response.data.data || [],
      pagination: response.data.pagination || {
        page,
        limit,
        total: 0,
        pages: 1,
      },
    };
  } catch (error) {
    console.error("🔴 API Error - getProducts:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

// === Get Product by ID ===
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Product not found");
    }

    return response.data.data || null;
  } catch (error) {
    console.error("🔴 API Error - getProductById:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

// === Get Featured Products (default: 4) ===
export const getFeaturedProducts = async (limit = 4) => {
  try {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("🔴 API Error - getFeaturedProducts:", error);
    return [];
  }
};

// === Get Products by Category ===
export const getProductsByCategory = async (category, page = 1, limit = 12) => {
  try {
    const response = await api.get(
      `/products?category=${category}&page=${page}&limit=${limit}`
    );
    return {
      products: response.data?.data || [],
      pagination: response.data?.pagination || {
        page,
        limit,
        total: 0,
        pages: 1,
      },
    };
  } catch (error) {
    console.error("🔴 API Error - getProductsByCategory:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products by category");
  }
};
// === Search Products ===
export const searchProducts = async (query, page = 1, limit = 12) => {
  try {
    const response = await api.get(`/products/search`, {
      params: { query, page, limit },
    });

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to search products");
    }

    return {
      products: response.data.data || [],
      pagination: response.data.pagination || {
        page,
        limit,
        total: 0,
        pages: 1,
      },
    };
  } catch (error) {
    console.error("🔴 API Error - searchProducts:", error);
    throw new Error(error.response?.data?.message || "Failed to search products");
  }
}