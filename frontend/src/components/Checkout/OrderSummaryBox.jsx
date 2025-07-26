import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useCart } from "@/hooks/useCart";
import PriceDisplay from "@/components/PriceDisplay";

const OrderSummary = ({ onTotalChange }) => {
  const { cart = [] } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(200); // Static for now
  const [taxAmount, setTaxAmount] = useState(0); // Optional

  // 🔄 Recalculate totals when cart changes
  useEffect(() => {
    const calcSubtotal = cart.reduce((acc, item) => {
      const itemPrice = Number(item?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return acc + itemPrice * quantity;
    }, 0);

    setSubtotal(calcSubtotal);
    const total = calcSubtotal + shippingFee + taxAmount;

    onTotalChange?.(total);
  }, [cart, shippingFee, taxAmount, onTotalChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>

      <div className="space-y-4">
        {cart.map((item, index) => (
          <div key={item.id || index} className="border-b pb-3 last:border-none">
            <div className="text-gray-700 font-medium">
              {item?.title || "Unnamed Product"}
            </div>
            <div className="text-sm text-gray-500">Qty: {item?.quantity || 1}</div>
            <div className="text-sm">
              <PriceDisplay amount={item?.price || 0} />
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-sm text-gray-700 mb-2">
        <span>Subtotal</span>
        <PriceDisplay amount={subtotal} />
      </div>
      <div className="flex justify-between text-sm text-gray-700 mb-2">
        <span>Shipping</span>
        <PriceDisplay amount={shippingFee} />
      </div>
      <div className="flex justify-between text-sm text-gray-700 mb-2">
        <span>Tax</span>
        <PriceDisplay amount={taxAmount} />
      </div>

      <div className="flex justify-between text-base font-semibold text-gray-900 mt-4 border-t pt-4">
        <span>Total</span>
        <PriceDisplay amount={subtotal + shippingFee + taxAmount} />
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  onTotalChange: PropTypes.func, // For Checkout to receive total
};

export default OrderSummary;
