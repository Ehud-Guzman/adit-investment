import adminApi from "@/services/api/adminApi";

export const ADMIN_TOKEN_KEY = "adminAccessToken";

export const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    adminApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  delete adminApi.defaults.headers.common["Authorization"];
};

export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const markAdminLoggedOut = () => {
  clearAdminToken();
};