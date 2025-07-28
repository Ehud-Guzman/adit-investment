// components/Admin/orders/OrderCard.jsx

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  User2,
  CreditCard,
  Truck,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import OrderStatusSelect from "./OrderStatusSelect";
import OrderDetails from "./OrderDetailsPanel";

export default function OrderCard({
  order,
  updateStatus,
  isUpdatingGlobal,
  updatingOrderId,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUpdating = updatingOrderId === order._id;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 font-mono text-sm text-gray-700">
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
            <span className="font-semibold">Order #{order._id.slice(-6)}</span>
          </div>
          <div className="text-gray-600 flex items-center gap-2">
            <User2 className="w-4 h-4" />
            <span className="font-medium">{order.userName || "Guest"}</span>
            <span className="text-sm text-gray-500">({order.userEmail || "—"})</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3 text-sm sm:justify-end sm:text-right">
          <div>
            <span className="text-gray-500">Amount:</span>{" "}
            <span className="font-medium">
              KES{" "}
              {typeof order.totalAmount === "number"
                ? order.totalAmount.toFixed(2)
                : "0.00"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            <StatusBadge status={order.orderStatus} />
            <OrderStatusSelect
              order={order}
              updateStatus={updateStatus}
              isUpdating={isUpdating || isUpdatingGlobal}
            />
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <PaymentBadge
              status={order.paymentStatus || (order.isPaid ? "paid" : "pending")}
            />
          </div>
          <div className="text-gray-400 text-xs">
            {order.createdAt &&
              format(new Date(order.createdAt), "dd MMM yyyy")}
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={toggleExpand}
          className="text-gray-600 hover:text-black ml-auto"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <OrderDetails order={order} />
        </div>
      )}
    </div>
  );
}
