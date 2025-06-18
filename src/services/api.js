import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost';

const baseURL = isLocalhost
  ? 'http://localhost:3001/api'
  : 'https://adit-investment.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔐 Enable cookies/tokens if needed
});

// ==== PRODUCTS ====
export const getProducts = () => api.get('/products').then(res => res.data);
export const getProductById = (id) => api.get(`/products/${id}`).then(res => res.data);
export const addProduct = (product) => api.post('/products', product).then(res => res.data);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product).then(res => res.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(res => res.data);

// ==== CART ====
export const getCart = () => api.get('/cart').then(res => res.data);
export const addToCart = (item) => api.post('/cart', item).then(res => res.data);
export const updateCartItem = (id, item) => api.put(`/cart/${id}`, item).then(res => res.data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`).then(res => res.data);

// ==== WISHLIST ====
export const getWishlist = () => api.get('/wishlist').then(res => res.data);
export const addToWishlist = (item) => api.post('/wishlist', item).then(res => res.data);
export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}`).then(res => res.data);
