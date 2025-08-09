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
import PaymentStatusSelect from "./PaymentStatusSelect";
import OrderDetails from "./OrderDetailsPanel";

export default function OrderCard({
  order = {},
  updateStatus,
  updatePaymentStatus,
  isUpdatingGlobal = false,
  updatingOrderId = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUpdating = updatingOrderId === order._id;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const paymentStatus = order.paymentStatus || (order.isPaid ? "paid" : "pending");
  const formattedAmount = typeof order.totalAmount === "number"
    ? order.totalAmount.toFixed(2)
    : "0.00";

  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), "dd MMM yyyy")
    : "—";


  return (
    <div className="border border-gray-200 rounded-xl shadow-sm bg-white transition-all">
      {/* Card Header */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left Block: Order Identity */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 font-mono text-sm text-gray-700">
            {isUpdating && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            )}
            <span className="font-semibold">
              Order #{order._id?.slice(-6) || "XXXXXX"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <User2 className="w-4 h-4" />
            <span className="font-medium">{order.userName || "Guest"}</span>
            <span className="text-gray-500 text-xs">
              ({order.userEmail || "—"})
            </span>
          </div>
        </div>

        {/* Right Block: Order Status, Payment, Date */}
        <div className="flex flex-wrap items-center gap-4 sm:justify-end sm:text-right text-sm">

          {/* Total Amount */}
          <div>
            <span className="text-gray-500">Amount:</span>{" "}
            <span className="font-semibold">KES {formattedAmount}</span>
          </div>

          {/* Order Fulfillment Status */}
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-400" />
            <StatusBadge status={order.orderStatus} />
            <OrderStatusSelect
              order={order}
              updateStatus={updateStatus}
              isUpdating={isUpdating || isUpdatingGlobal}
            />
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <PaymentBadge status={paymentStatus} />
          <PaymentStatusSelect
  order={order}
  updatePayment={(updatePaymentStatus ?? (() => {}))} // fallback just in case
  isUpdating={isUpdating || isUpdatingGlobal}
  disabled={order.orderStatus === "cancelled"}
/>

          </div>

          {/* Date */}
          <div className="text-gray-400 text-xs">
            {formattedDate}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={toggleExpand}
          className="text-gray-600 hover:text-black ml-auto transition"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        
        <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl">
         
          <OrderDetails order={order} />
        </div>
      )}
    </div>
  );
}
