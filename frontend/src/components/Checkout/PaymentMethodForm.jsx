// src/components/Checkout/PaymentMethodForm.jsx
import React from "react";

const PaymentMethodForm = ({ form, handleChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Payment Method
      </h2>

      <div className="space-y-3">
        {/* Cash on Delivery */}
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={form.paymentMethod === "cash"}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span className="text-gray-700">Cash on Delivery</span>
        </label>

        {/* M-Pesa */}
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="mpesa"
            checked={form.paymentMethod === "mpesa"}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span className="text-gray-700">M-Pesa</span>
        </label>

        {/* Future Options Placeholder */}
        <label className="flex items-center space-x-3 opacity-50 cursor-not-allowed">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            disabled
            className="accent-blue-600"
          />
          <span className="text-gray-500">Card (Coming Soon)</span>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
