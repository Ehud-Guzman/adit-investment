// ShippingAddressForm.jsx
import React from "react";

const ShippingAddressForm = ({ form, handleChange }) => {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>

      {/* Street Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={form.address}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input
          id="city"
          name="city"
          type="text"
          required
          value={form.city}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          required
          value={form.country}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Postal Code */}
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
        <input
          id="postalCode"
          name="postalCode"
          type="text"
          required
          value={form.postalCode}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default ShippingAddressForm;
