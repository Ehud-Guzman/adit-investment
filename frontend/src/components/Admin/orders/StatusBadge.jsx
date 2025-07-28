import { Badge } from "@/components/ui/badge";

const statusColors = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  delivered: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <Badge className={`capitalize ${statusColors[status] || "bg-gray-100"}`}>
      {status}
    </Badge>
  );
}
