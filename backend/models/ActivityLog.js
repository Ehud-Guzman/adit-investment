import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., 'status-change', 'payment-update'
    message: { type: String, required: true },
    user: { type: String }, // Optional: admin name or ID
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    metadata: { type: Object }, // Anything extra
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
