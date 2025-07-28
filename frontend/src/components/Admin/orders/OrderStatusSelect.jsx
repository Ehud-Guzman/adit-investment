import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({ order, updateStatus, isUpdating }) {
  return (
    <Select
      defaultValue={order.orderStatus}
      onValueChange={(value) =>
        updateStatus({ orderId: order._id, status: value })
      }
      disabled={isUpdating}
    >
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder="Set status" />
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
