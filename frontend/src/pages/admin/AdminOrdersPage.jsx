import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orders } from "@/services/api/index";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const {
    data: ordersList = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orders.fetchAll,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: orders.updateStatus,
    onSuccess: () => {
      toast.success("✅ Order status updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err) => {
      toast.error("❌ Failed to update status: " + err.message);
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">🧾 Orders</h1>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : isError ? (
        <div className="text-red-600 font-semibold">
          ❌ Failed to load orders: {error.message}
        </div>
      ) : ordersList.length === 0 ? (
        <div className="text-gray-500 text-center py-20">
          No orders found.
        </div>
      ) : (
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="overflow-x-auto p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersList.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm text-gray-700">
                      #{order._id.slice(-6)}
                    </TableCell>
                    <TableCell>{order.userEmail || "—"}</TableCell>
                    <TableCell>${order.total?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) =>
                          updateStatus({
                            orderId: order._id,
                            status: value,
                          })
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[150px] capitalize">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? format(new Date(order.createdAt), "dd MMM yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
