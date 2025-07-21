import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api/products';

// Default pagination settings
const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0,
  pages: 1,
  hasNext: false,
  hasPrev: false
};

// Default filter settings
const DEFAULT_FILTERS = {
  category: 'all',
  sortBy: 'featured',
  search: ''
};

export default function useProducts(initialOptions = {}) {
  const [state, setState] = useState({
    products: [],
    loading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS, ...initialOptions.filters },
    pagination: { ...DEFAULT_PAGINATION, ...initialOptions.pagination }
  });

  // Memoized fetch function with proper error handling
  const fetchProducts = useCallback(async (page = 1, newFilters = null) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const activeFilters = newFilters || state.filters;
      const { limit } = state.pagination;

      // Prepare API params
      const params = {
        category: activeFilters.category !== 'all' ? activeFilters.category : undefined,
        sort: activeFilters.sortBy,
        search: activeFilters.search.trim() || undefined
      };

      // Make API call
      const { products = [], pagination = {} } = await getProducts(page, limit, params);

      setState(prev => ({
        ...prev,
        products: page === 1 ? products : [...prev.products, ...products],
        loading: false,
        filters: activeFilters,
        pagination: {
          ...prev.pagination,
          ...pagination,
          page,
          limit,
          hasNext: pagination.page < pagination.pages,
          hasPrev: pagination.page > 1
        }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch products'
      }));
    }
  }, [state.filters, state.pagination.limit]);

  // Action handlers
  const setPage = useCallback((page) => {
    fetchProducts(Math.max(1, Math.min(page, state.pagination.pages)));
  }, [fetchProducts, state.pagination.pages]);

  const setFilters = useCallback((newFilters) => {
    fetchProducts(1, { ...state.filters, ...newFilters });
  }, [fetchProducts, state.filters]);

  const setLimit = useCallback((limit) => {
    const newLimit = Math.max(1, Math.min(100, limit));
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, limit: newLimit }
    }));
    fetchProducts(1);
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchProducts(state.pagination.page);
  }, [fetchProducts, state.pagination.page]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    filters: state.filters,
    setPage,
    setFilters,
    setLimit,
    refresh
  };
}