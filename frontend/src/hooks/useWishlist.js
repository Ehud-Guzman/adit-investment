import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { wishlist as wishlistAPI } from "@/services/api/index.js";

// ✅ Validate MongoDB ObjectId (24-char hex)
const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

const parseId = (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid product ID: ${id}`);
  }
  return id;
};

// 🧠 Guest wishlist (localStorage)
const getGuestWishlist = () =>
  JSON.parse(localStorage.getItem("guest_wishlist") || "[]");

const setGuestWishlist = (arr) =>
  localStorage.setItem("guest_wishlist", JSON.stringify(arr));

export const useWishlist = () => {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch wishlist
  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    enabled: !isLoadingUser,
    staleTime: 60_000,
    queryFn: async () => {
      if (isAuthenticated) {
        try {
          return await wishlistAPI.getWishlist(); // [{ productId }]
        } catch (error) {
          if (error?.response?.status === 401) {
            console.warn("🔐 Not logged in, falling back to guest wishlist");
            return getGuestWishlist().map(productId => ({ productId }));
          }
          throw error;
        }
      }
      return getGuestWishlist().map(productId => ({ productId }));
    },
    retry: (count, err) => err?.response?.status !== 401 && count < 2,
    retryDelay: 1000,
    placeholderData: [],
    onError: (err) => {
      if (![400, 401].includes(err?.response?.status)) {
        toast.error(err.message || "Failed to load wishlist");
      }
    },
  });

  const invalidate = () => queryClient.invalidateQueries(["wishlist"]);

  // 2️⃣ Authenticated Add / Remove
  const authAdd = async (pid) => {
    await wishlistAPI.addToWishlist(pid); // POST /wishlist
    invalidate();
  };

  const authRemove = async (pid) => {
    await wishlistAPI.removeFromWishlist(pid); // DELETE /wishlist/:productId
    invalidate();
  };

  // 3️⃣ Guest Add / Remove
  const guestAdd = (pid) => {
    const arr = getGuestWishlist();
    if (!arr.includes(pid)) {
      arr.push(pid);
      setGuestWishlist(arr);
      queryClient.setQueryData(
        ["wishlist"],
        arr.map(id => ({ productId: id }))
      );
    }
  };

  const guestRemove = (pid) => {
    const arr = getGuestWishlist().filter(id => id !== pid);
    setGuestWishlist(arr);
    queryClient.setQueryData(
      ["wishlist"],
      arr.map(id => ({ productId: id }))
    );
  };

  // 4️⃣ Add / Remove Mutations
  const addMutation = useMutation({
    mutationFn: async (rawId) => {
      const pid = parseId(rawId);
      return isAuthenticated ? authAdd(pid) : guestAdd(pid);
    },
    onSuccess: () => toast.success("💖 Added to wishlist"),
    onError: (err) => {
      toast.error(err.message || "Failed to add to wishlist");
      console.error("Add to wishlist error:", err);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (rawId) => {
      const pid = parseId(rawId);
      return isAuthenticated ? authRemove(pid) : guestRemove(pid);
    },
   onSuccess: () =>
  toast.success("💔 Removed from wishlist", {
    closeButton: true,
  }),

onError: (err) =>
  toast.error(err.message || "Failed to remove from wishlist", {
    closeButton: true,
  }),

  });

  // 5️⃣ Toggle + check
  const toggleWishlist = async (rawId) => {
    const pid = parseId(rawId);
    const items = wishlistQuery.data || [];
    const exists = items.some(i => i.productId === pid);
    return exists
      ? removeMutation.mutateAsync(pid)
      : addMutation.mutateAsync(pid);
  };

  const isInWishlist = (rawId) => {
    if (!isValidObjectId(rawId)) return false;
    return (wishlistQuery.data || []).some(i => i.productId === rawId);
  };

  return {
    wishlist: wishlistQuery.data,
    isLoading: wishlistQuery.isLoading,
    isFetching: wishlistQuery.isFetching,
    error: wishlistQuery.error,

    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    toggleWishlist,
    isInWishlist,
  };
};
