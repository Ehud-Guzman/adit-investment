import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.jsx";
import "./index.css";
import { api } from "./services/api/index.js";
import { registerDevCreditShortcut } from "./utils/registerDevCreditToast.jsx";

// 🔐 Inject admin access token if available
const adminToken = localStorage.getItem("adminAccessToken");
if (adminToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
}

// 🎉 Register Glimmer dev credit shortcut
if (typeof window !== "undefined") {
  registerDevCreditShortcut();
}

// ⚙️ Setup React Query Client
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
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
