import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({ order, updateStatus, isUpdating }) {
  const [localStatus, setLocalStatus] = useState(String(order.orderStatus));

  // 🧠 Sync local status if props change
  useEffect(() => {
    setLocalStatus(String(order.orderStatus));
  }, [order.orderStatus]);

  const handleChange = (value) => {
    
    setLocalStatus(value);
    updateStatus({ orderId: order._id, status: value });
  };

  return (
    <Select
      value={localStatus}
      onChange={handleChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="min-w-[150px]">
        <SelectValue value={localStatus} placeholder="Set status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
