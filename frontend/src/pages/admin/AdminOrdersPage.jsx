import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orders } from "@/services/api/index";
import { toast } from "react-toastify";

// UI
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, XCircle } from "lucide-react";

// Custom Components
import OrderCard from "@/components/Admin/orders/OrderCard";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orders.fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const ordersList = data?.data ?? [];

  const { mutate: updateStatus, isPending: isGlobalUpdating } = useMutation({
    mutationFn: orders.updateStatus,
    onMutate: ({ orderId }) => {
      // optional: set local state if needed
    },
    onSuccess: () => {
      toast.success("✅ Order status updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err) => {
      toast.error("❌ Failed to update status: " + err.message);
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            Orders Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          Total: {ordersList.length} orders
        </Badge>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 mx-auto text-red-500 mb-3" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load orders</h2>
          <p className="text-red-600">{error.message}</p>
          <button
            onClick={() => queryClient.refetchQueries(["admin-orders"])}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      ) : ordersList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-500">All orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersList.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              updateStatus={updateStatus}
              isUpdatingGlobal={isGlobalUpdating}
              updatingOrderId={null} // optional: pass specific ID if tracking
            />
          ))}
        </div>
      )}
    </div>
  );
}
