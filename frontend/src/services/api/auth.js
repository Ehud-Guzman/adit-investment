import { api } from './index';

// Token management
export const TOKEN_KEY = 'accessToken';
export const REFRESH_KEY = 'refreshToken';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
export const markLoggedOut = () => {
  clearAuthToken();
  // Optionally: cancel any ongoing auth-related requests here if needed
};
export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Error handling
const handleAuthError = (error) => {
  const status = error.response?.status;
  const isRefresh = error.config?.url?.includes('/auth/refresh');

  return {
    message: error.response?.data?.message || error.message || 'Unexpected error',
    status,
    isAuthError: status === 401 || status === 403,
    isGuest: status === 401 && !isRefresh,
    isRefreshFailed: isRefresh && status === 401,
    isServerError: status >= 500,
  };
};

// Helpers
const parseAuthResponse = (res) => ({
  token: res.data?.token ?? null,
  user: res.data?.user ?? null,
});

// Auth actions
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const res = await api.get('/auth/me');
    return res.data ?? null; // removed `.user`
  } catch (err) {
  const authErr = handleAuthError(err);

  if (authErr.isGuest || authErr.isAuthError || authErr.status === 400) {
    return null; // Treat as guest
  }

  throw authErr; // Only throw true unexpected errors
}

};


export const login = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return parseAuthResponse(res);
  } catch (err) {
    const authErr = handleAuthError(err);

    // 👇 Detect backend response that email is not verified
    if (authErr.message?.toLowerCase().includes("email not verified")) {
      authErr.isUnverified = true;
    }

    throw authErr;
  }
};


export const register = async (payload) => {
  try {
    const res = await api.post('/auth/register', payload);
    return res.data; // ✅ Return the actual backend response
  } catch (err) {
    throw handleAuthError(err);
  }
};


export const logout = async () => {
  try {
    await api.post('/auth/logout');
    clearAuthToken();
  } catch (err) {
    throw handleAuthError(err);
  }
};

export const refreshToken = async () => {
  try {
    const res = await api.post('/auth/refresh');
    const token = res.data?.token;
    if (token) setAuthToken(token);
    return token;
  } catch (err) {
    clearAuthToken(); // ✅ Clean up on failure
    throw handleAuthError(err);
  }
};


// User profile
export const updateUserProfile = async (payload) => {
  try {
    const res = await api.put('/auth/update-profile', payload);
    return {
      user: res.data?.user ?? null,
      meta: res.data?.meta ?? {},
    };
  } catch (err) {
    throw handleAuthError(err);
  }
};

export const updateUserPassword = async (payload) => {
  try {
    await api.put('/auth/update-password', payload);
  } catch (err) {
    throw handleAuthError(err);
  }
};

// Password reset
export const requestPasswordReset = async (email) => {
  try {
    await api.post('/auth/request-password-reset', { email });
  } catch (err) {
    throw handleAuthError(err);
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    await api.post('/auth/reset-password', { token, newPassword });
  } catch (err) {
    throw handleAuthError(err);
  }
};

// Consolidated exports
export const auth = {
  TOKEN_KEY,
  REFRESH_KEY,
  setAuthToken,
  clearAuthToken,
  getCurrentUser,
  login,
  register,
  logout,
  refreshToken,
  updateUserProfile,
  updateUserPassword,
  requestPasswordReset,
  resetPassword
};