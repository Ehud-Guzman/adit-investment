// src/hooks/useCreateOrder.js
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/api/orders";
import { toast } from "react-toastify";

/**
 * 🔄 useCreateOrder Hook
 * Handles placing an order via POST /api/orders
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (res) => {
      console.log("✅ Order Created:", res);
    },
    onError: (err) => {
      console.error("❌ Order Creation Failed:", err);
      toast.error("Something went wrong while placing your order.");
    },
  });
};