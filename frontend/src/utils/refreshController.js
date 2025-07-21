import { api } from "@/services/api/index.js"; // Axios instance

export const getRefreshPromise = async () => {
  try {
    const res = await api.post("/auth/refresh");
    const { token: accessToken } = res.data;

    if (!accessToken) throw new Error("No token returned from refresh");

    return { accessToken };
  } catch (err) {
    console.error("❌ Refresh failed: likely missing cookie or CORS misconfig", err);
    throw err;
  }
};
