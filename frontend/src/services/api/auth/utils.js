export const handleAdminAuthError = (error) => {
  const status = error.response?.status;
  const isRefresh = error.config?.url?.includes("/auth/refresh");

  return {
    message: error.response?.data?.message || error.message || "Unexpected error",
    status,
    isAuthError: status === 401 || status === 403,
    isGuest: status === 401 && !isRefresh,
    isRefreshFailed: isRefresh && status === 401,
    isServerError: status >= 500,
  };
};

export const parseAdminAuthResponse = (res) => ({
  token: res.data?.token ?? null,
  user: res.data?.user ?? null,
});