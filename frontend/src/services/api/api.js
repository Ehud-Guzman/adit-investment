import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // 💀 THIS LINE IS THE WHOLE ISSUE IF MISSING
});

export default api;
