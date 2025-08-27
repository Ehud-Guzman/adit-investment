// components/CancelOrderButton.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/services/api/orders";
import { toast } from "react-toastify";

const CancelOrderButton = ({ orderId }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onMutate: async () => {
      // Cancel any outgoing fetches to avoid race conditions
      await queryClient.cancelQueries(["myOrders"]);

      // Snapshot previous value
      const prevData = queryClient.getQueryData(["myOrders"]);

      // Optimistically update UI
      queryClient.setQueryData(["myOrders"], (old) => ({
        ...old,
        orders: old.orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "cancelled" } : order
        ),
      }));

      return { prevData };
    },
    onError: (err, _, context) => {
      // Revert to previous state
      queryClient.setQueryData(["myOrders"], context.prevData);
      toast.error(err?.response?.data?.message || "❌ Failed to cancel order.");
    },
    onSuccess: () => {
      toast.success("✅ Order cancelled successfully!");
    },
    onSettled: () => {
      // Ensure data is fresh
      queryClient.invalidateQueries(["myOrders"]);
    },
  });

  return (
    <button
      disabled={isLoading}
      onClick={() => mutate()}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 disabled:opacity-50 transition"
    >
      {isLoading ? "Cancelling..." : "Cancel Order"}
    </button>
  );
};

export default CancelOrderButton;
