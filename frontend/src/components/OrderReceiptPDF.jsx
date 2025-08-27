// components/OrderReceiptPDF.jsx
import React, { useRef, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import axios from "axios";

const colors = {
  primary: "#002B5B",
  secondary: "#00478E",
  accent: "#E8F4FD",
  gold: "#D4AF37",
  mediumGray: "#6C757D",
  darkGray: "#495057",
};

const OrderReceiptPDF = ({ order }) => {
  const receiptRef = useRef();
  const [fullOrder, setFullOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order) return;
      if (order.userName && order.userEmail) setFullOrder(order);
      else if (order.user && typeof order.user === "string") {
        try {
          const res = await axios.get(`/api/orders/${order._id}`);
          setFullOrder(res.data.order);
        } catch {
          setFullOrder(order);
        }
      } else setFullOrder(order);
    };
    fetchOrder();
  }, [order]);

  if (!fullOrder) return <p>Loading receipt...</p>;

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8);
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Adit_Receipt_${fullOrder._id.slice(-8).toUpperCase()}.pdf`);
  };

  const userName = fullOrder.userName || fullOrder.user?.name || "Valued Customer";
  const userEmail = fullOrder.userEmail || fullOrder.user?.email || "Not specified";
  const userPhone =
  fullOrder.shippingAddress?.phone ||
  fullOrder.userPhone ||
  fullOrder.user?.phone ||
  "Not specified";

  const orderDate = fullOrder.createdAt ? format(new Date(fullOrder.createdAt), "PPP p") : "Not specified";

  return (
    <>
      <div
        ref={receiptRef}
        style={{
          position: "absolute",
          top: "-20000px",
          left: "-20000px",
          width: 595,
          minHeight: 842,
          padding: 30,
          fontFamily: "'Inter', sans-serif",
          color: colors.darkGray,
          background: "#fff",
        }}
      >
        {/* Multiple Watermarks */}
        {[
          { top: "20%", left: "15%", rotate: -30, size: 40 },
          { top: "25%", left: "70%", rotate: 25, size: 35 },
          { top: "70%", left: "20%", rotate: 15, size: 30 },
          { top: "65%", left: "65%", rotate: -25, size: 45 },
        ].map((wm, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: wm.top,
              left: wm.left,
              fontSize: wm.size,
              color: `${colors.primary}22`,
              transform: `translate(-50%, -50%) rotate(${wm.rotate}deg)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            ICT HUB
          </div>
        ))}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <img src="/assets/images/services/logo.jpg" alt="Logo" style={{ width: 60, height: 60, borderRadius: "50%" }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 22, color: colors.primary }}>ADIT INVESTMENT LTD</h1>
              <p style={{ margin: 0, fontSize: 12, color: colors.mediumGray }}>Premium Quality • Exceptional Service</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
        <div
  style={{
    background: colors.gold,
    color: colors.primary,
    padding: "6px 10px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,       // optional, to keep size consistent
    textAlign: "center",
  }}
>
  {fullOrder.orderStatus || "PENDING"}
</div>

            <p style={{ margin: 2, fontSize: 11 }}>Invoice: #{fullOrder._id.slice(-8).toUpperCase()}</p>
            <p style={{ margin: 2, fontSize: 11 }}>Date: {orderDate}</p>
          </div>
        </div>

        {/* Customer & Shipping */}
        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <div style={{ flex: 1, padding: 15, border: `1px solid ${colors.accent}`, borderRadius: 10 }}>
            <h3 style={{ margin: 0, color: colors.primary, fontSize: 14 }}>Customer Info</h3>
            <p>Name: {userName}</p>
            <p>Email: {userEmail}</p>
            <p>Phone: {userPhone}</p>
          </div>
          <div style={{ flex: 1, padding: 15, border: `1px solid ${colors.accent}`, borderRadius: 10 }}>
            <h3 style={{ margin: 0, color: colors.primary, fontSize: 14 }}>Shipping</h3>
            {fullOrder.shippingAddress ? (
              <>
                <p>{fullOrder.shippingAddress.address}</p>
                <p>{fullOrder.shippingAddress.town}, {fullOrder.shippingAddress.postalCode}</p>
                {fullOrder.shippingAddress.note && <p style={{ fontStyle: "italic" }}>📝 {fullOrder.shippingAddress.note}</p>}
              </>
            ) : <p>No address provided</p>}
          </div>
        </div>

        {/* Order Summary */}
        <h3 style={{
          textAlign: "center",
          color: colors.primary,
          fontSize: 16,
          marginTop: 30,
          marginBottom: 10,
          zIndex: 1,
          position: "relative"
        }}>
          Order Summary
        </h3>

        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          zIndex: 1,
          position: "relative"
        }}>
          <thead style={{ background: colors.primary, color: "#fff" }}>
            <tr>
              <th style={{ padding: "8px 5px", textAlign: "left" }}>Item</th>
              <th style={{ padding: "8px 5px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "8px 5px", textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "8px 5px", textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {fullOrder.items.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : colors.accent }}>
                <td style={{ padding: "8px 5px" }}>{item.title}</td>
                <td style={{ padding: "8px 5px", textAlign: "center" }}>{item.quantity}</td>
                <td style={{ padding: "8px 5px", textAlign: "right" }}>Ksh {item.price.toLocaleString()}</td>
                <td style={{ padding: "8px 5px", textAlign: "right", fontWeight: 700 }}>Ksh {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", fontWeight: 700, marginTop: 10, fontSize: 13 }}>
          GRAND TOTAL: Ksh {fullOrder.totalAmount.toLocaleString()}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 11, color: colors.mediumGray, marginTop: 20 }}>
          Thank you for shopping with Adit Investment Limited!<br />
          Computer-generated receipt • No signature required
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-6 py-3 bg-gradient-to-r from-[#002B5B] to-[#00478E] text-white rounded-lg shadow hover:shadow-lg transition"
        style={{ fontWeight: 700 }}
      >
        📄 Download Receipt
      </button>
    </>
  );
};

export default OrderReceiptPDF;
