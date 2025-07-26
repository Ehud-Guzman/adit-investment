import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useCreateOrder";

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
    city: "",
    postalCode: "",
    shippingNote: "",
    paymentMethod: "cash",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validItems = useMemo(() => {
    const filtered = (cart || []).filter(
      (item) =>
        item?.productId &&
        item?.quantity > 0 &&
        typeof item.productId === "string"
    );

    return filtered.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price ?? 0,
      title: item.title ?? "Untitled",
      image: item.image ?? "",
    }));
  }, [cart]);

  const totalAmount = useMemo(() => {
    const total = validItems.reduce((sum, item) => {
      const subtotal = item.price * item.quantity;
      return isNaN(subtotal) ? sum : sum + subtotal;
    }, 0);
    console.log("💰 Calculated totalAmount:", total);
    return total;
  }, [validItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, phone, address, city, postalCode, paymentMethod } =
      formData;

    if (!fullName || !phone || !address || !city || !postalCode) {
      toast.error("🚫 Please fill out all required fields.");
      return;
    }

    if (!validItems.length) {
      toast.error("🛒 No valid cart items to checkout.");
      console.warn("🚨 Aborting order: validItems is empty.");
      return;
    }

    const shippingAddress = {
      address,
      city,
      postalCode,
      note: formData.shippingNote || "",
    };



 const orderPayload = {
  customer: {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
  },
  items: validItems.map(({ productId, quantity, price, title, image }) => ({
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



    console.log("✅ ORDER PAYLOAD SENT:", JSON.stringify(orderPayload, null, 2));


    try {
      await createOrder(orderPayload);
      clearCart();
      toast.success("✅ Order placed successfully!");
      navigate("/order-confirmation");
    } catch (err) {
      console.error("❌ Order placement failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to place order.";
      toast.error(`❌ ${msg}`);
    }
  };
  

  // Calculate form completion percentage
  const requiredFields = ['fullName', 'phone', 'address', 'city', 'postalCode'];
  const completedFields = requiredFields.filter(field => formData[field]?.trim()).length;
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Center: Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Secure Checkout
              </h1>
              <p className="text-sm text-gray-600 mt-1">Complete your purchase safely and securely</p>
            </div>

            {/* Right: Progress Indicator */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <div className="text-sm text-gray-600">Progress:</div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 min-w-[32px]">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Shipping Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Contact & Shipping Information</h2>
                    <p className="text-sm text-gray-600">Where should we deliver your order?</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ContactAndShippingForm
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>

            {/* Shipping Notes Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Delivery Instructions</h2>
                    <p className="text-sm text-gray-600">Any special notes for our delivery team? (Optional)</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ShippingNoteForm
                  value={formData.shippingNote}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-600">How would you like to pay?</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <PaymentMethodForm
                  form={formData}
                  handleChange={handleInputChange}
                />
              </div>
            </div>

            {/* Place Order Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>By placing this order, you agree to our Terms & Conditions</span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 min-w-[200px]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Complete Order</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <OrderSummary totalAmount={totalAmount} />
              
              {/* Trust Signals */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Why shop with us?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Fast & Free Delivery</p>
                      <p className="text-xs text-gray-600">Free shipping on orders over KES 100,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">30-Day Returns</p>
                      <p className="text-xs text-gray-600">Easy returns and exchanges</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">24/7 Support</p>
                      <p className="text-xs text-gray-600">We're here to help anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;