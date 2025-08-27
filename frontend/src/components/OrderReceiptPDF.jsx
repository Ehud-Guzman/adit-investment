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

const OrderReceiptPDF = ({ order }) => {
  const receiptRef = useRef();
  const [fullOrder, setFullOrder] = useState(order || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order || !order._id) return setFullOrder(order);

      if (order.userName && order.userEmail && order.shippingAddress && order.items) {
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
        const res = await axios.get(`/api/orders/${order._id}`);
        const fetchedOrder = res.data.order;
        orderCache.set(order._id, fetchedOrder);
        setFullOrder(fetchedOrder);
      } catch {
        setError("Failed to fetch order details. Using available data.");
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
    fullOrder?.shippingAddress?.phone || fullOrder?.userPhone || fullOrder?.user?.phone || "N/A";
  const orderDate = fullOrder?.createdAt ? format(new Date(fullOrder.createdAt), "PPP p") : "N/A";

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !fullOrder) return;

    const element = receiptRef.current;

    // Show hidden receipt for canvas render
    element.style.position = "static";
    element.style.opacity = "1";

    await new Promise((r) => setTimeout(r, 150)); // wait to render images/fonts

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

    // Hide receipt again
    element.style.position = "absolute";
    element.style.opacity = "0";
  };

  if (error)
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

  if (isLoading)
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
           <img
  src="/assets/images/services/logo.jpg" // <— direct public path
  alt="Logo"
  style={{ width: 60, height: 60, borderRadius: "50%" }}
/>

            <div>
              <h1 style={{ margin: 0, fontSize: 22, color: colors.primary }}>ADIT INVESTMENT LTD</h1>
              <p style={{ margin: 0, fontSize: 12, color: colors.mediumGray }}>
                Premium Quality • Exceptional Service
              </p>
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
                minWidth: 60,
              }}
            >
              {fullOrder?.orderStatus || "PENDING"}
            </div>
            <p style={{ margin: 2, fontSize: 11 }}>
              Invoice: #{fullOrder?._id?.slice(-8).toUpperCase() || "UNKNOWN"}
            </p>
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
            <p>
              {fullOrder?.shippingAddress?.town || "N/A"}, {fullOrder?.shippingAddress?.postalCode || "N/A"}
            </p>
            {fullOrder?.shippingAddress?.note && <p style={{ fontStyle: "italic" }}>📝 {fullOrder.shippingAddress.note}</p>}
          </div>
        </div>

        {/* Order Summary */}
        <h3 style={{ textAlign: "center", color: colors.primary, fontSize: 16, marginTop: 30, marginBottom: 10 }}>
          Order Summary
        </h3>
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
            {orderItems.length > 0 ? (
              orderItems.map((item, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : colors.accent }}>
                  <td style={{ padding: "8px 5px" }}>{item?.title || "N/A"}</td>
                  <td style={{ padding: "8px 5px", textAlign: "center" }}>{item?.quantity || 0}</td>
                  <td style={{ padding: "8px 5px", textAlign: "right" }}>Ksh {(item?.price || 0).toLocaleString()}</td>
                  <td style={{ padding: "8px 5px", textAlign: "right", fontWeight: 700 }}>
                    Ksh {((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "8px 5px", textAlign: "center" }}>
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ textAlign: "right", fontWeight: 700, marginTop: 10, fontSize: 13 }}>
          GRAND TOTAL: Ksh {(fullOrder?.totalAmount || 0).toLocaleString()}
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: colors.mediumGray, marginTop: 20 }}>
          Thank you for shopping with Adit Investment Limited!
          <br />
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
