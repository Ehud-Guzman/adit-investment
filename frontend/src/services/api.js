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
  withCredentials: true,
});

// === PRODUCTS ===
export const getProducts = () => api.get('/products').then(res => res.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then(res => res.data);

export const addProduct = (product) => {
  const { _id, ...clean } = product; // 🧼 strip _id
  return api.post('/products', clean).then(res => res.data);
};

export const updateProduct = (id, product) => {
  const { _id, ...clean } = product;
  return api.put(`/products/${id}`, clean).then(res => res.data);
};

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then(res => res.data);

// === CART ===
export const getCart = () => api.get('/cart').then(res => res.data);

export const addToCart = (item) => {
  const { _id, ...clean } = item;
  return api.post('/cart', clean).then(res => res.data);
};

export const updateCartItem = (id, item) => {
  const { _id, ...clean } = item;
  return api.put(`/cart/${id}`, clean).then(res => res.data);
};

export const removeFromCart = (id) =>
  api.delete(`/cart/${id}`).then(res => res.data);

// === WISHLIST ===
export const getWishlist = () => api.get('/wishlist').then(res => res.data);

export const addToWishlist = (item) => {
  const { _id, ...clean } = item;
  return api.post('/wishlist', clean).then(res => res.data);
};

export const removeFromWishlist = (id) =>
  api.delete(`/wishlist/${id}`).then(res => res.data);

// === PING ===
export const pingServer = () => api.get('/ping').then(res => res.data);
