import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "@/services/api/orders";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    enabled: !!currentUser,
  });

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-12 text-gray-600">
        🚫 You must be logged in to view your orders.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10">
        ❌ {error?.response?.data?.message || "Failed to load your orders."}
      </div>
    );
  }

  const orders = data?.orders || [];

  if (!orders.length) {
    return (
      <div className="text-center text-gray-500 py-20">
        🛒 No orders found. Start shopping now!
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">
                    Order ID:{" "}
                    <span className="text-gray-900">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {format(new Date(order.createdAt), "dd MMM yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: <span className="font-semibold">Ksh {order.totalAmount}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: <span className="capitalize">{order.orderStatus}</span>
                  </p>
                </div>
                <button
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() => toggleExpand(order._id)}
                >
                  {expandedOrderId === order._id ? (
                    <>
                      Collapse <FiChevronUp />
                    </>
                  ) : (
                    <>
                      View Items <FiChevronDown />
                    </>
                  )}
                </button>
              </div>

              {/* Order Items */}
              {expandedOrderId === order._id && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  {order.items.map((item, idx) => {
                    const title = item?.title || "Untitled Product";
                    const quantity = item?.quantity ?? 1;
                    const price = item?.price ?? 0;
                    const image =
                      item?.image?.replace(/\\/g, "/") || "/placeholder.jpg";

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={title}
                          className="w-16 h-16 object-contain border rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {quantity} × Ksh {price}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MyOrders;
