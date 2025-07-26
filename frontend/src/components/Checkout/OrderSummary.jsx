import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useCart } from "@/hooks/useCart";
import PriceDisplay from "@/components/common/PriceDisplay";

const OrderSummary = ({ onTotalChange }) => {
  const { cart = [] } = useCart();

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = Number(item?.price ?? 0);
      const qty = Number(item?.quantity ?? 0);
      const valid = !isNaN(price) && !isNaN(qty) && price >= 0 && qty >= 0;

      if (!valid) {
        if (import.meta.env.DEV) {
          console.warn("⚠️ Invalid cart item detected:", item);
        }
        return sum;
      }

      return sum + price * qty;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  useEffect(() => {
    if (typeof onTotalChange === "function") {
      onTotalChange(total);
    }
  }, [total, onTotalChange]);

  const isEmpty = cart.length === 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order Summary
        </h3>
        {!isEmpty && (
          <p className="text-sm text-gray-600 mt-1">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        )}
      </div>

      <div className="p-6">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {isEmpty ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.35 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some items to get started</p>
            </div>
          ) : (
            cart.map((item, idx) => {
              const title = item?.title || "Untitled Product";
              const qty = Number(item?.quantity || 0);
              const price = Number(item?.price || 0);
              const image = item?.image || "";
              const lineTotal = price * qty;

              return (
                <div
                  key={item.id || `item-${idx}`}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
                      style={{ display: image ? 'none' : 'flex' }}
                    >
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm leading-5 mb-1 line-clamp-2">
                      {title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Qty:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">
                          {qty}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Unit:</span>
                        <PriceDisplay amount={price} className="text-xs font-semibold" />
                      </span>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="flex-shrink-0 text-right">
                    <PriceDisplay 
                      amount={lineTotal} 
                      className="font-bold text-gray-900" 
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Totals */}
        {!isEmpty && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <PriceDisplay amount={subtotal} className="font-semibold" />
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium flex items-center gap-2">
                    Shipping
                    {shippingFee === 0 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        
                      </span>
                    )}
                  </span>
                  <PriceDisplay amount={shippingFee} className="font-semibold" />
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Tax</span>
                  <PriceDisplay amount={tax} className="font-semibold" />
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <PriceDisplay 
                      amount={total} 
                      className="text-xl font-bold text-gray-900" 
                    />
                    {cart.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {cart.reduce((sum, item) => sum + (item?.quantity || 0), 0)} items total
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Callout (if applicable) */}
            {subtotal > 100 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    You'll save on shipping! Free delivery on orders over KES 100,000.
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  onTotalChange: PropTypes.func,
};

export default OrderSummary;