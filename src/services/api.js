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
  withCredentials: true, // Only needed if using cookies/auth
});

// === PRODUCTS ===
export const getProducts = () => api.get('/products').then(res => res.data);
export const getProductById = (id) => api.get(`/products/${id}`).then(res => res.data);
export const addProduct = (product) => api.post('/products', product).then(res => res.data);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product).then(res => res.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(res => res.data);

// === PING (optional health check) ===
export const pingServer = () => api.get('/ping').then(res => res.data);
