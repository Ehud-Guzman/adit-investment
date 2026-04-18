// components/Admin/orders/OrderDetailsPanel.jsx

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import OrderItemCard from "./OrderItemCard";
import PaymentBadge from "./PaymentBadge";
import OrderDetailSection from "./OrderDetailSection";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeCartItems } from "@/utils/cartNormalizer";
import { cancelOrder } from "@/services/api/orders";

export default function OrderDetails({ order, onOrderUpdate }) {
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const enrich = async () => {
      setLoading(true);
      const enriched = await normalizeCartItems(order.items || []);
      setEnrichedItems(enriched);
      setLoading(false);
    };
    enrich();
  }, [order]);

  const formatCurrency = (amount) =>
    `KES ${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0.00"}`;

  const formatAddress = () => {
    const { fullName, address, city, postalCode, country, phone } =
      order.shippingAddress || {};
    return (
      <>
        {fullName && <p className="font-medium">{fullName}</p>}
        {address && <p>{address}</p>}
        <p>
          {[city, postalCode].filter(Boolean).join(", ")}
          {country && `, ${country}`}
        </p>
        {phone && <p className="text-primary font-medium mt-2">{phone}</p>}
      </>
    );
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancelling(true);
      const updated = await cancelOrder(order._id); // call API
      if (onOrderUpdate) onOrderUpdate(updated); // let parent refresh
    } catch (err) {
      console.error("Failed to cancel order", err);
      toast.error(err?.response?.data?.message || "Failed to cancel order. Try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="px-6 pb-6">
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-8">
        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">
                Order Items ({enrichedItems.length})
              </h3>
            </div>

            {loading ? (
              <Skeleton className="w-full h-40 rounded-lg" />
            ) : enrichedItems.length === 0 ? (
              <p className="text-gray-500 italic">No product data found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrichedItems.map((item, index) => (
                  <OrderItemCard
                    key={`${item.productId}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Meta Sections */}
          <div className="space-y-8">
            <OrderDetailSection
              icon={<MapPin className="w-5 h-5 text-primary" />}
              title="Shipping Details"
              variant="primary"
            >
              {order.shippingAddress ? (
                <div className="space-y-1.5 text-sm">{formatAddress()}</div>
              ) : (
                <p className="text-gray-500 italic">
                  No shipping information available
                </p>
              )}
            </OrderDetailSection>

            <OrderDetailSection
              icon={<CreditCard className="w-5 h-5 text-primary" />}
              title="Payment Information"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="capitalize font-medium">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <PaymentBadge
                    status={
                      order.paymentStatus || (order.isPaid ? "paid" : "pending")
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </OrderDetailSection>

            <OrderDetailSection
              icon={<Truck className="w-5 h-5 text-primary" />}
              title="Order Timeline"
            >
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Order placed</p>
                    <p className="text-xs text-gray-500">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")
                        : "Date not available"}
                    </p>
                  </div>
                </li>

                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>Last updated</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(order.updatedAt), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  </li>
                )}

                <li
                  className={
                    order.deliveredAt
                      ? "flex items-start gap-3"
                      : "flex items-start gap-3 opacity-60"
                  }
                >
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {order.deliveredAt ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <div>
                    <p>Delivered</p>
                    {order.deliveredAt && (
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(order.deliveredAt),
                          "dd MMM yyyy, hh:mm a"
                        )}
                      </p>
                    )}
                  </div>
                </li>
              </ul>
            </OrderDetailSection>

            {/* Admin Actions */}
            {order.orderStatus !== "cancelled" && (
              <OrderDetailSection
                icon={<XCircle className="w-5 h-5 text-red-600" />}
                title="Actions"
              >
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    cancelling
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              </OrderDetailSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
