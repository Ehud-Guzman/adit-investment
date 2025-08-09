// OrderReceipt.jsx

export default function OrderReceipt({ order }) {
  const formatCurrency = (amount) =>
    `KES ${amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0.00"}`;

  return (
    <div className="text-sm space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Order ID:</span>
        <span className="font-mono">{order._id}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Customer Email:</span>
        <span>{order.userEmail}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Items Count:</span>
        <span>{order.items.length}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span className="text-gray-800">Total Paid:</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  );
}
