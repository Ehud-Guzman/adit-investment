import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { normalizeCartItems } from "@/utils/cartNormalizer";

import ContactAndShippingForm from "@/components/Checkout/ContactAndShippingForm";
import ShippingNoteForm from "@/components/Checkout/ShippingNoteForm";
import PaymentMethodForm from "@/components/Checkout/PaymentMethodForm";
import OrderSummary from "@/components/Checkout/OrderSummary";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { mutateAsync: createOrder, isLoading: loading } = useCreateOrder();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    postalCode: "",
    shippingNote: "",
    paymentMethod: "cash",
  });

  const [enrichedCart, setEnrichedCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const enrichCart = async () => {
      setLoadingCart(true);
      try {
        const items = await normalizeCartItems(cart || []);
        setEnrichedCart(items);
      } catch (err) {
        console.error("⚠️ Failed to enrich cart:", err);
        toast.error("Something went wrong while preparing your cart.");
      } finally {
        setLoadingCart(false);
      }
    };

    enrichCart();
  }, [cart]);

  const totalAmount = useMemo(() => {
    return enrichedCart.reduce((sum, item) => {
      const subtotal = item.price * item.quantity;
      return isNaN(subtotal) ? sum : sum + subtotal;
    }, 0);
  }, [enrichedCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, phone, address, town, postalCode, paymentMethod } =
      formData;

    if (!fullName || !phone || !address || !town|| !postalCode) {
      toast.error("🚫 Please fill out all required fields.");
      return;
    }

    if (paymentMethod === "mpesa" && !phone.trim()) {
      toast.error("📵 M-Pesa payment requires a valid phone number.");
      return;
    }

    if (!enrichedCart.length) {
      toast.error("🛒 Your cart is empty or invalid.");
      return;
    }

    const shippingAddress = {
      address,
      town,
      postalCode,
      note: formData.shippingNote || "",
    };

    const orderPayload = {
      customer: {
        fullName,
        email: formData.email || "N/A",
        phone,
      },
      items: enrichedCart.map(({ productId, quantity, price, title, image }) => ({
        productId,
        quantity,
        price,
        title,
        image,
      })),
      shippingAddress,
      paymentMethod,
      totalAmount,
    };

   

    try {
      await createOrder(orderPayload);
      clearCart();
      toast.success("✅ Order placed successfully!");
      navigate("/order-confirmation");
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      toast.error(err?.response?.data?.message || "Failed to place order.");
    }
  };

  // Optional: Toast to guide M-Pesa users
  useEffect(() => {
    if (formData.paymentMethod === "mpesa" && !formData.phone.trim()) {
      toast.info("📲 Enter your phone number to receive M-Pesa STK push.");
    }
  }, [formData.paymentMethod, formData.phone]);

  const requiredFields = ["fullName", "phone", "address", "town", "postalCode"];
  const completed = requiredFields.filter((f) => formData[f]?.trim()).length;
  const completionPercentage = Math.round((completed / requiredFields.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full group"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex justify-center items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Secure Checkout
              </h1>
              <p className="text-sm text-gray-600">Complete your purchase securely</p>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">{completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            <ContactAndShippingForm formData={formData} setFormData={setFormData} />
            <ShippingNoteForm value={formData.shippingNote} onChange={handleInputChange} />
            <PaymentMethodForm form={formData} handleChange={handleInputChange} />

            {/* Place Order */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  loadingCart ||
                  (formData.paymentMethod === "mpesa" && !formData.phone.trim())
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold w-full transition-all duration-200 disabled:opacity-50"
              >
                {loading || loadingCart ? "Processing..." : "Complete Order"}
              </button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1 sticky top-6">
            <OrderSummary totalAmount={totalAmount} items={enrichedCart} loading={loadingCart} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
