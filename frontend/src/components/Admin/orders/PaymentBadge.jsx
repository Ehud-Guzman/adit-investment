import { Badge } from "@/components/ui/badge";

export default function PaymentBadge({ status }) {
  return (
    <Badge
      variant={status === "paid" ? "success" : "destructive"}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}
