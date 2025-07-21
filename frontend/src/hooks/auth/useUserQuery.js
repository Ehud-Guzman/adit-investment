
import { useQuery } from "@tanstack/react-query";
import { getAuthError } from "@/utils/authError";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthToken,
  removeAccessToken,
  removeRefreshToken,
  getRefreshController,
} from "@/utils/authTokens";
import { fetchUserQuery } from "./queries/fetchUserQuery";

/**
 * Custom hook to fetch the authenticated user.
 * Automatically refreshes tokens if needed, and clears tokens on unrecoverable errors.
 */
export const useUserQuery = (token, updateTokens, clearTokens) =>
  useQuery({
    queryKey: ["auth-user"],
    enabled: typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
 // only run if a token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (retryCount, err) => {
      const authErr = getAuthError(err);
      return !authErr.isAuthError && !authErr.isBadRequest && authErr.isServerError && retryCount < 2;
    },
    queryFn: async () => {
      try {
        // 🚀 Attempt to fetch the user directly
        return await fetchUserQuery();
      } catch (err) {
        const authErr = getAuthError(err);

        if (authErr.isGuest) return null; // Soft fail for unauthenticated guests
        if (authErr.isBadRequest) throw err; // Bad data — bail out

        if (authErr.isAuthError) {
          try {
            // 🔁 Token refresh flow
            const controller = getRefreshController();

            if (!controller.isRefreshing()) await controller.startRefresh();

            const { accessToken, refreshToken: newRefresh } = await controller.getRefreshPromise();

            if (!accessToken) throw new Error("Refresh failed: No access token");

            setAccessToken(accessToken);
            setRefreshToken(newRefresh);
            updateTokens(accessToken);

            return await fetchUserQuery(); // ✅ Retry after refresh
          } catch (refreshErr) {
            // 🧹 Clean-up if refresh fails
            clearAuthToken();
            removeAccessToken();
            removeRefreshToken();
            clearTokens?.();
            return null; // soft fail — treat as guest
          } finally {
            getRefreshController().resetRefresh();
          }
        }

        throw err; // Unhandled error — let it bubble up
      }
    },
  });
