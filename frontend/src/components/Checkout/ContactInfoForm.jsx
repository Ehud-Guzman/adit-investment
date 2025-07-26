// ContactInfoForm.jsx
import React from "react";

const ContactInfoForm = ({ form, handleChange }) => {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          value={form.fullName}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Remember Info */}
      <div className="flex items-center">
        <input
          id="rememberInfo"
          name="rememberInfo"
          type="checkbox"
          checked={form.rememberInfo}
          onChange={(e) =>
            handleChange({
              target: { name: "rememberInfo", value: e.target.checked },
            })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="rememberInfo" className="ml-2 block text-sm text-gray-700">
          Remember my info
        </label>
      </div>
    </div>
  );
};

export default ContactInfoForm;
