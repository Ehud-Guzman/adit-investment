import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

const baseURL = isLocalhost
  ? 'http://localhost:8080/api'
  : 'https://adit-investment-1.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Automatically attach token if present
api.interceptors.request.use((config) => {
 const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.config.url !== '/auth/login'
    ) {
      originalRequest._retry = true;
      try {
        const { token } = await api.post('/auth/refresh').then(res => res.data);
       localStorage.setItem('accessToken', token);
       originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
       localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

/* ============================
   🔌 PRODUCTS
============================ */
export const getProducts = () => api.get('/products').then(res => res.data);
export const getProductById = (id) => api.get(`/products/${id}`).then(res => res.data);
export const addProduct = (product) => api.post('/products', product).then(res => res.data);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product).then(res => res.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(res => res.data);

/* ============================
   🛒 CART
============================ */
export const getCart = () => api.get('/cart').then(res => res.data);

export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity }).then(res => res.data);

export const updateCartItem = (id, item) =>
  api.put(`/cart/${id}`, item).then(res => res.data);

// 🔥 This is where things break — ensure you're passing cartItem._id, not product._id!
export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/${cartItemId}`).then(res => res.data);

/* ============================
   💖 WISHLIST
============================ */
export const getWishlist = () => api.get('/wishlist').then(res => res.data);
export const addToWishlist = (productId) => api.post('/wishlist', { productId }).then(res => res.data);
export const removeFromWishlist = (wishlistItemId) => api.delete(`/wishlist/${wishlistItemId}`).then(res => res.data);

/* ============================
   🔐 AUTH
============================ */
export const login = (credentials) => api.post('/auth/login', credentials).then(res => res.data);
export const register = (userData) => api.post('/auth/register', userData).then(res => res.data);
export const logout = () => api.post('/auth/logout').then(res => res.data);
export const getCurrentUser = () => api.get('/auth/me').then(res => res.data);

/* ============================
   ⭐ REVIEWS
============================ */
export const getProductReviews = (productId) => api.get(`/reviews/${productId}`).then(res => res.data);
export const submitReview = (productId, review) => api.post(`/reviews/${productId}`, review).then(res => res.data);

/* ============================
   📡 HEALTH CHECK
============================ */
export const pingServer = () => api.get('/ping').then(res => res.data);


