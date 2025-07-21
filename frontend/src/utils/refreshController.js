import { api } from "@/services/api/index.js"; // Axios instance

export const getRefreshPromise = async () => {
  try {
    const res = await api.post("/auth/refresh");
    const { token: accessToken } = res.data;

    if (!accessToken) throw new Error("No token returned");

    return { accessToken };
  } catch (err) {
    console.error("❌ Refresh failed", err);
    throw err;
  }
};
