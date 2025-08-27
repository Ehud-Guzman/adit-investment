import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const paymentOptions = ["pending", "paid", "refunded"];

export default function PaymentStatusSelect({
  order,
  updatePayment,
  isUpdating,
  disabled,
}) {
  const [selected, setSelected] = useState(
    order.paymentStatus || (order.isPaid ? "paid" : "pending")
  );

  const handleChange = (val) => {
    
    if (val === selected) return;

    setSelected(val); // required to control the UI
    updatePayment({ orderId: order._id, paymentStatus: val });
  };

  return (
    <Select
      value={selected}
      onChange={handleChange}
      disabled={isUpdating || disabled}
    >
      <SelectTrigger className="w-[120px] h-8 text-xs">
        <SelectValue value={selected} placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {paymentOptions.map((status) => (
          <SelectItem key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
