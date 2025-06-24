// src/services/api.js

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
  withCredentials: true, // use if your backend uses cookies/session
});

// ======== 🔧 HELPERS ===========
const stripMongoMeta = (obj) => {
  const clean = { ...obj };
  delete clean._id;
  return clean;
};

// ======== 📦 PRODUCTS ===========
export const getProducts = () => api.get('/products').then(res => res.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then(res => res.data);

export const addProduct = (product) =>
  api.post('/products', stripMongoMeta(product)).then(res => res.data);

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, stripMongoMeta(product)).then(res => res.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then(res => res.data);

// ======== 🛒 CART ===========
export const getCart = () => api.get('/cart').then(res => res.data);

export const addToCart = (item) =>
  api.post('/cart', stripMongoMeta(item)).then(res => res.data);

export const updateCartItem = (id, item) =>
  api.put(`/cart/${id}`, stripMongoMeta(item)).then(res => res.data);

export const removeFromCart = (id) =>
  api.delete(`/cart/${id}`).then(res => res.data);

// ======== 💖 WISHLIST ===========
export const getWishlist = () => api.get('/wishlist').then(res => res.data);

export const addToWishlist = (item) =>
  api.post('/wishlist', stripMongoMeta(item)).then(res => res.data);

export const removeFromWishlist = (id) =>
  api.delete(`/wishlist/${id}`).then(res => res.data);

// ======== ✅ PING ===========
export const pingServer = () => api.get('/ping').then(res => res.data);
