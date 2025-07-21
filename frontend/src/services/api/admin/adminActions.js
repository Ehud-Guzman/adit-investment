// src/services/api/admin/adminActions.js
import adminApi from "../adminApi";

export const adminLogin = async (credentials) => {
  const res = await adminApi.post("/auth/login", credentials);

  const token = res.data?.token;
  const user = res.data?.user;

  if (!user?.isAdmin) {
    throw new Error("Access denied: Not an admin");
  }

  return { token, user };
};

export const adminLogout = async () => {
  await adminApi.post("/auth/logout");
};
