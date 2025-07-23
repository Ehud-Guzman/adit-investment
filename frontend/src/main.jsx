import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.jsx";
import "./index.css";
import { api } from "./services/api/index.js";

// 🔍 DEBUG: Check env vars are loading correctly
console.log("🌍 Full ENV dump:", import.meta.env);
console.log("🔥 API Base URL:", import.meta.env.VITE_API_URL);

// 🔐 Inject admin access token if available
const adminToken = localStorage.getItem("adminAccessToken");
if (adminToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
}

// ⚙️ Setup React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
  