import { getCurrentUser } from "@/services/api/auth";

/**
 * 🚀 Basic user fetcher
 * Used inside useUserQuery to separate logic from fetching
 */
export const fetchUserQuery = async () => {
  const user = await getCurrentUser();

  // ❗️ Don't throw on guest — just return null
  if (!user || !user._id) return null;

  return user;
};
