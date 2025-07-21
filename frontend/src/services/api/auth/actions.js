import adminApi from "@/services/api/adminApi";
import {
  setAdminToken,
  clearAdminToken,
  getAdminToken,
} from "./token";
import {
  handleAdminAuthError,
  parseAdminAuthResponse,
} from "./utils";

export const adminLogin = async (credentials) => {
  try {
    const res = await adminApi.post("/auth/login", credentials);
    const { token, user } = parseAdminAuthResponse(res);

    if (!user?.isAdmin) {
      throw new Error("Access denied: not an admin");
    }

    setAdminToken(token);
    return { token, user };
  } catch (err) {
    throw handleAdminAuthError(err);
  }
};

export const adminLogout = async () => {
  try {
    await adminApi.post("/auth/logout");
    clearAdminToken();
  } catch (err) {
    throw handleAdminAuthError(err);
  }
};

export const getAdminCurrentUser = async () => {
  try {
    const token = getAdminToken();
    if (!token) return null;

    const res = await adminApi.get("/auth/me");
    const user = res.data;

    if (!user?.isAdmin) throw new Error("Unauthorized: Not an admin");
    return user;
  } catch (err) {
    const authErr = handleAdminAuthError(err);
    if (authErr.status === 400) return null;
    throw authErr;
  }
};
export const refreshAdminToken = async () => {
  try {
    const res = await adminApi.post("/auth/refresh");
    const { token, user } = parseAdminAuthResponse(res);

    if (!user?.isAdmin) {
      throw new Error("Access denied: not an admin");
    }

    setAdminToken(token);
    return { token, user };
  } catch (err) {
    throw handleAdminAuthError(err);
  }
};