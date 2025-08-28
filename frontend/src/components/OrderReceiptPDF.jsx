import React, { useRef, useEffect, useState, useMemo } from "react";
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

const orderCache = new Map();

const logoBase64 =   "data:image/jpeg;base64,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"; // your full base64 string here


const OrderReceiptPDF = ({ order }) => {
  const receiptRef = useRef();
  const [fullOrder, setFullOrder] = useState(order || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full order if data is incomplete
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order?._id) return setFullOrder(order);

      if (
        order.userName &&
        order.userEmail &&
        order.shippingAddress &&
        order.items
      ) {
        orderCache.set(order._id, order);
        setFullOrder(order);
        return;
      }

      if (orderCache.has(order._id)) {
        setFullOrder(orderCache.get(order._id));
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/orders/${order._id}`);
        orderCache.set(order._id, data.order);
        setFullOrder(data.order);
      } catch {
        setError("Failed to fetch full order details. Using available data.");
        setFullOrder(order);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [order]);

  const orderItems = useMemo(() => fullOrder?.items || [], [fullOrder]);
  const userName = fullOrder?.userName || fullOrder?.user?.name || "Customer";
  const userEmail = fullOrder?.userEmail || fullOrder?.user?.email || "N/A";
  const userPhone =
    fullOrder?.shippingAddress?.phone ||
    fullOrder?.userPhone ||
    fullOrder?.user?.phone ||
    "N/A";
  const orderDate = fullOrder?.createdAt
    ? format(new Date(fullOrder.createdAt), "PPP p")
    : "N/A";

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !fullOrder) return;

    const element = receiptRef.current;
    element.style.position = "absolute";
    element.style.top = "0";
    element.style.left = "0";
    element.style.opacity = "1";
    element.style.zIndex = 1000;

    await new Promise((r) => setTimeout(r, 500)); // give browser time to render

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfImgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Adit_Receipt_${fullOrder._id?.slice(-8).toUpperCase() || "UNKNOWN"}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      element.style.position = "absolute";
      element.style.top = "-20000px";
      element.style.left = "-20000px";
      element.style.opacity = "0";
      element.style.zIndex = -1;
    }
  };

  if (error) {
    return (
      <div style={{ padding: 20, fontFamily: "'Inter', sans-serif", color: colors.darkGray }}>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={handleDownloadPDF}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-[#002B5B] to-[#00478E] text-white rounded-lg shadow hover:shadow-lg transition"
          style={{ fontWeight: 700 }}
        >
          📄 Try Downloading Anyway
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: 20, fontFamily: "'Inter', sans-serif", color: colors.darkGray }}>
        <div
          style={{
            width: "100%",
            height: 200,
            marginBottom: 20,
            background: `linear-gradient(90deg, ${colors.accent} 25%, #f0f0f0 50%, ${colors.accent} 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
    );
  }

  return (
    <>
      {/* Hidden Receipt */}
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
          opacity: 0,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <img src={logoBase64} alt="Logo" style={{ width: 60, height: 60, borderRadius: "50%" }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 22, color: colors.primary }}>ADIT INVESTMENT LTD</h1>
              <p style={{ margin: 0, fontSize: 12, color: colors.mediumGray }}>Premium Quality • Exceptional Service</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: colors.gold, color: colors.primary, padding: "6px 10px", borderRadius: 10, fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 60 }}>
              {fullOrder?.orderStatus || "PENDING"}
            </div>
            <p style={{ margin: 2, fontSize: 11 }}>Invoice: #{fullOrder?._id?.slice(-8).toUpperCase() || "UNKNOWN"}</p>
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
            <p>{fullOrder?.shippingAddress?.address || "N/A"}</p>
            <p>{fullOrder?.shippingAddress?.town || "N/A"}, {fullOrder?.shippingAddress?.postalCode || "N/A"}</p>
            {fullOrder?.shippingAddress?.note && <p style={{ fontStyle: "italic" }}>📝 {fullOrder.shippingAddress.note}</p>}
          </div>
        </div>

        {/* Order Summary */}
        <h3 style={{ textAlign: "center", color: colors.primary, fontSize: 16, marginTop: 30, marginBottom: 10 }}>Order Summary</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ background: colors.primary, color: "#fff" }}>
            <tr>
              <th style={{ padding: "8px 5px", textAlign: "left" }}>Item</th>
              <th style={{ padding: "8px 5px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "8px 5px", textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "8px 5px", textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? orderItems.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : colors.accent }}>
                <td style={{ padding: "8px 5px" }}>{item?.title || "N/A"}</td>
                <td style={{ padding: "8px 5px", textAlign: "center" }}>{item?.quantity || 0}</td>
                <td style={{ padding: "8px 5px", textAlign: "right" }}>Ksh {(item?.price || 0).toLocaleString()}</td>
                <td style={{ padding: "8px 5px", textAlign: "right", fontWeight: 700 }}>Ksh {((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: "8px 5px", textAlign: "center" }}>No items available</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ textAlign: "right", fontWeight: 700, marginTop: 10, fontSize: 13 }}>
          GRAND TOTAL: Ksh {(fullOrder?.totalAmount || 0).toLocaleString()}
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: colors.mediumGray, marginTop: 20 }}>
          Thank you for shopping with Adit Investment Limited!<br />
          Computer-generated receipt • No signature required
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-6 py-3 bg-gradient-to-r from-[#002B5B] to-[#00478E] text-white rounded-lg shadow hover:shadow-lg transition"
        style={{ fontWeight: 700 }}
        disabled={isLoading}
      >
        📄 Download Receipt
      </button>
    </>
  );
};

export default React.memo(OrderReceiptPDF);
