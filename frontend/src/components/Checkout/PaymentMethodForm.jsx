import React from "react";

const PaymentMethodForm = ({ form, handleChange }) => {
  const isMpesa = form.paymentMethod === "mpesa";
  const phone = form.phone?.trim();

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

        {/* M-Pesa Option */}
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="mpesa"
            checked={isMpesa}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span className="text-gray-700">M-Pesa (STK Push)</span>
        </label>

        {/* Dynamic Preview */}
        {isMpesa && (
          <div className="ml-6 mt-2 bg-yellow-50 border border-yellow-300 p-4 rounded-md text-sm text-yellow-800 space-y-1">
            <p>📲 You’ll receive a payment prompt on:</p>
            {phone ? (
              <p className="font-semibold">{phone}</p>
            ) : (
              <p className="text-red-600 font-medium">⚠️ Please enter your phone number above.</p>
            )}
          </div>
        )}

        {/* Future Placeholder */}
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
