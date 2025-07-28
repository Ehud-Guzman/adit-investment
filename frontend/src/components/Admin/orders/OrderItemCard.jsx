// components/Admin/orders/OrderItemCard.jsx

import { ShoppingBag } from "lucide-react";

export default function OrderItemCard({ item }) {
  const isValid = item && typeof item === "object" && item.productId;

  if (!isValid) {
    return (
      <div className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-md">
          <ShoppingBag className="w-6 h-6 text-gray-300" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-500 italic">Invalid product</h4>
          <p className="text-xs text-gray-400">This product may have been removed or is unavailable.</p>
        </div>
      </div>
    );
  }

  const {
    title = "Untitled Product",
    price = 0,
    quantity = 1,
    image = "/images/default.png",
    status,
  } = item;

  const formattedPrice = price.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });

  return (
    <div className="flex gap-4 items-start p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-100">
        <img
          src={image.replace(/\\/g, "/")}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "/images/default.png")}
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {title}
        </h4>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Qty: <span className="font-medium text-gray-800">{quantity}</span></span>
          <span className="font-semibold text-gray-900">{formattedPrice}</span>
        </div>

        {/* Status badge if needed */}
        {status && (
          <div className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
