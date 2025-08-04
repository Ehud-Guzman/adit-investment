import React from "react";

const ContactAndShippingForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Contact Info */}
      <div className="bg-white rounded-lg p-6 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg p-6 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
        <input
          type="text"
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="town"
          placeholder="town"
          value={formData.town}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
    </div>
  );
};

export default ContactAndShippingForm;
