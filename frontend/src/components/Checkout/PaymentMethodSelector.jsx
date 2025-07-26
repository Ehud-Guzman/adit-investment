import React from "react";

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  const options = [
    { value: "card", label: "Credit/Debit Card" },
    { value: "mpesa", label: "M-PESA" },
    { value: "paypal", label: "PayPal" },
    { value: "cash", label: "Cash on Delivery" },
  ];

  return (
    <div className="bg-white p-6 mt-6 rounded-lg border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
      <div className="space-y-3">
        {options.map(({ value, label }) => (
          <label
            key={value}
            className={`flex items-center gap-3 cursor-pointer p-3 border rounded-md ${
              paymentMethod === value ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              checked={paymentMethod === value}
              onChange={() => setPaymentMethod(value)}
              className="accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
