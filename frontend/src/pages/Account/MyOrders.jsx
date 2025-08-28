// components/MyOrders.jsx
import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders } from "@/services/api/orders";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
  FiMapPin,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CancelOrderButton from "@/components/CancelOrderButton";
//import OrderReceiptPDF from "@/components/OrderReceiptPDF";

// 🔧 Status styling map
const statusConfig = {
  pending: {
    bg: "bg-gradient-to-r from-yellow-50 to-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
    icon: "⏳",
    dot: "bg-yellow-500",
  },
  processing: {
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    icon: "🔄",
    dot: "bg-blue-500",
  },
  shipped: {
    bg: "bg-gradient-to-r from-sky-50 to-sky-100",
    text: "text-sky-700",
    border: "border-sky-300",
    icon: "🚚",
    dot: "bg-sky-500",
  },
  delivered: {
    bg: "bg-gradient-to-r from-green-50 to-green-100",
    text: "text-green-700",
    border: "border-green-300",
    icon: "✅",
    dot: "bg-green-600",
  },
  cancelled: {
    bg: "bg-gradient-to-r from-red-50 to-rose-100",
    text: "text-red-700",
    border: "border-red-300",
    icon: "❌",
    dot: "bg-red-500",
  },
};

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    enabled: !!currentUser,
  });

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // 🔑 Not logged in
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/20 rounded-full flex items-center justify-center mx-auto">
            <FiShoppingBag className="w-10 h-10 text-[#00A651]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Sign In Required
          </h3>
          <p className="text-gray-600">
            Please log in to view your order history and track your purchases.
          </p>
          <button className="bg-gradient-to-r from-[#00A651] to-[#007a40] text-white px-6 py-3 rounded-xl font-medium mt-4 hover:from-[#007a40] hover:to-[#006030] transition-all duration-300 shadow-md hover:shadow-lg">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // 🔄 Loading
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <LoadingSpinner className="text-[#00A651]" size="lg" />
        <p className="text-gray-500 animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  // ❌ Error
  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">😵</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600">
            {error?.response?.data?.message || "Failed to load your orders."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#1e90ff] to-[#0066cc] text-white px-6 py-3 rounded-xl font-medium mt-4 hover:from-[#0066cc] hover:to-[#0050a3] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  // 🕸 Empty
  if (!orders.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/20 rounded-full flex items-center justify-center mx-auto">
            <FiPackage className="w-12 h-12 text-[#00A651]" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            No orders yet
          </h3>
          <p className="text-gray-500">
            Your shopping journey starts here! Discover amazing products and
            make your first order.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A651] to-[#007a40] text-white px-8 py-3 rounded-xl font-medium mt-4 hover:from-[#007a40] hover:to-[#006030] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <FiShoppingBag className="w-5 h-5" />
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  // ✅ Orders
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00A651] to-[#007a40] rounded-lg flex items-center justify-center">
            <FiPackage className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00A651] to-[#007a40] bg-clip-text text-transparent">
            My Orders
          </h1>
        </div>
        <p className="text-gray-500 ml-11">
          Track and manage all your purchases
        </p>
        <div className="ml-11 mt-3 text-sm text-gray-400 flex gap-2 items-center">
          <div className="w-2 h-2 bg-[#1e90ff] rounded-full" />
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, index) => {
          const isExpanded = expandedOrderId === order._id;
          const statusStyle =
            statusConfig[order.orderStatus] || statusConfig.processing;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-xl border-0 shadow-md",
                  isExpanded && "shadow-lg scale-[1.01]"
                )}
              >
                <div className={cn("absolute inset-0", statusStyle.bg)} />
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-1",
                    statusStyle.dot
                  )}
                />

                <CardContent className="relative p-6">
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-3 flex-1">
                      {/* ID & Status */}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{statusStyle.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                              statusStyle.text,
                              statusStyle.border,
                              statusStyle.bg
                            )}
                          >
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                statusStyle.dot
                              )}
                            />
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Quick Facts */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCreditCard className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-800">
                            Ksh {order.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiPackage className="w-4 h-4 text-gray-400" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                      </div>
                    </div>

                    {/* Expand Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg",
                        "transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium",
                        "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#00A651] hover:to-[#007a40]"
                      )}
                      onClick={() => toggleExpand(order._id)}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details <FiChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Details <FiChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Expandable Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Items */}
                        <div className="pt-4 border-t border-gray-100/50 mt-4">
                          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiPackage className="w-4 h-4 text-[#00A651]" />
                            Order Items
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => {
                              const subtotal =
                                (item?.price || 0) * (item?.quantity || 1);
                              const image =
                                item?.image?.replace(/\\/g, "/") ||
                                "/placeholder.jpg";

                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100"
                                >
                                  <div className="relative">
                                    <img
                                      src={image}
                                      alt={item?.title}
                                      className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                                      onError={(e) =>
                                        (e.target.src = "/placeholder.jpg")
                                      }
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1e90ff] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                      {item?.quantity || 1}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                      {item?.title || "Untitled"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Ksh {item?.price?.toLocaleString()} ×{" "}
                                      {item?.quantity} ={" "}
                                      <span className="font-bold text-gray-800">
                                        Ksh {subtotal.toLocaleString()}
                                      </span>
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {/* Shipping */}
                          <div className="p-4 bg-white/60 rounded-xl border border-gray-100">
                            <h5 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                              <FiMapPin className="w-4 h-4 text-[#00A651]" />
                              Shipping Address
                            </h5>
                            {order.shippingAddress ? (
                              <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium">
                                  {order.shippingAddress.address}
                                </p>
                                <p>
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.postalCode}
                                </p>
                                {order.shippingAddress.note && (
                                  <p className="text-gray-500 italic mt-2">
                                    Note: {order.shippingAddress.note}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">
                                No address provided
                              </p>
                            )}
                          </div>

                          {/* Payment */}
                          <div className="p-4 bg-white/60 rounded-xl border border-gray-100">
                            <h5 className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                              <FiCreditCard className="w-4 h-4 text-[#00A651]" />
                              Payment Details
                            </h5>
                            <div className="text-sm text-gray-600 space-y-2">
                              <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-medium">
                                  {order.paymentMethod || "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span
                                  className={cn(
                                    "px-2 py-1 rounded text-xs font-medium",
                                    order.paymentStatus === "paid"
                                      ? "bg-[#00A651]/10 text-[#006341]"
                                      : "bg-[#1e90ff]/10 text-[#0066cc]"
                                  )}
                                >
                                  {order.paymentStatus || "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cancel Button */}
                        {order.orderStatus === "pending" && (
                          <div className="mt-6 flex justify-end">
                            <CancelOrderButton orderId={order._id} />
                          </div>
                        )}
                      </motion.div>
                    )}
                    <div className="mt-4 flex justify-end">
                    {/* {order ? (
                        <OrderReceiptPDF order={order} />
                      ) : (
                        <p>Loading receipt...</p>
                      )} */}
                    </div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MyOrders;
