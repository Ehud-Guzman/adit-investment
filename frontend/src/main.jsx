// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { api } from "./services/api/index.js";
import { registerDevCreditShortcut } from "./utils/registerDevCreditToast";

// ✅ Inject dev toast shortcut
registerDevCreditShortcut();

// 🔐 Admin token logic
const adminToken = localStorage.getItem("adminAccessToken");
if (adminToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
}

// 🧪 Log base URL for sanity check
console.log("🌐 VITE_API_URL:", import.meta.env.VITE_API_URL);

// ⚙️ React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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
