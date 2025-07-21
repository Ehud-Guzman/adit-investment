import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx';
import './index.css';

import { api } from './services/api/index.js';

// 🔐 Inject access token into Axios headers
const token = localStorage.getItem('accessToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 🔁 React Query Client Config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 min cache
      refetchOnWindowFocus: false,  // Disable refetch on tab switch
      retry: 1,                      // Retry failed queries once
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>

     
  
    </QueryClientProvider>
  </React.StrictMode>
);
