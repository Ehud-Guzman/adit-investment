import React from "react";

const ShippingNoteForm = ({ shippingNote, setShippingNote }) => {
  return (
    <div className="bg-white p-6 mt-6 rounded-lg border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Notes</h2>
      <textarea
        rows="4"
        placeholder="e.g. Please leave the package at the front desk or gate"
        value={shippingNote}
        onChange={(e) => setShippingNote(e.target.value)}
        className="w-full px-4 py-3 border rounded-md resize-none"
      />
    </div>
  );
};

export default ShippingNoteForm;
