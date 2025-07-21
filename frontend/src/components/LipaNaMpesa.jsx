import { useState } from "react";
import { FiSmartphone, FiCopy, FiCheck, FiInfo } from "react-icons/fi";

export default function LipaNaMpesa() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] to-[#e0f4ec] flex items-center justify-center p-4">
      <section className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-[#d4f0e2]">
        {/* Header */}
        <div className="bg-[#00a650] py-5 px-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <FiSmartphone className="text-white text-2xl" />
            <h2 className="text-white text-2xl font-bold tracking-tight">Lipa na M-PESA</h2>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          {/* Description */}
          <div className="text-center mb-8">
            <p className="text-gray-700 mb-4">
              Pay securely through <span className="text-[#00a650] font-medium">Buy Goods and Services</span>. 
              Use the details below to complete your payment.
            </p>
            
            <div className="inline-flex items-center bg-[#f0f9f4] px-4 py-2 rounded-lg border border-[#d4f0e2]">
              <FiInfo className="text-[#00a650] mr-2" />
              <span className="text-sm text-gray-600">Enter amount when prompted</span>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* Paybill Card */}
            <div className="border border-[#e0f4ec] rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Paybill Number</p>
                  <h3 className="text-xl font-bold text-gray-800 tracking-wider">880100</h3>
                </div>
                <button
                  onClick={() => handleCopy("880100", "paybill")}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f0f9f4] transition-colors"
                  aria-label="Copy Paybill"
                >
                  {copied === "paybill" ? (
                    <FiCheck className="text-green-500 text-lg" />
                  ) : (
                    <FiCopy className="text-gray-400 text-lg hover:text-[#00a650]" />
                  )}
                </button>
              </div>
              {copied === "paybill" && (
                <div className="mt-3 text-xs text-green-500 flex items-center animate-fadeIn">
                  <FiCheck className="mr-1" /> Copied to clipboard
                </div>
              )}
            </div>
            
            {/* Account Card */}
            <div className="border border-[#e0f4ec] rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Account Number</p>
                  <h3 className="text-xl font-bold text-gray-800 tracking-wider">170027</h3>
                </div>
                <button
                  onClick={() => handleCopy("170027", "account")}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f0f9f4] transition-colors"
                  aria-label="Copy Account"
                >
                  {copied === "account" ? (
                    <FiCheck className="text-green-500 text-lg" />
                  ) : (
                    <FiCopy className="text-gray-400 text-lg hover:text-[#00a650]" />
                  )}
                </button>
              </div>
              {copied === "account" && (
                <div className="mt-3 text-xs text-green-500 flex items-center animate-fadeIn">
                  <FiCheck className="mr-1" /> Copied to clipboard
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Steps */}
          <div className="bg-[#f8fdfa] rounded-xl border border-[#e0f4ec] p-5 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FiInfo className="text-[#00a650] mr-2" />
              Payment Instructions
            </h4>
            <ol className="text-sm text-gray-700 space-y-3 pl-1">
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">1.</span>
                <span>Go to M-PESA menu on your phone</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">2.</span>
                <div>
                  <span className="block">Select</span>
                  <span className="font-medium text-[#00a650] mt-1 block">Lipa na M-PESA</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">3.</span>
                <div>
                  <span className="block">Select</span>
                  <span className="font-medium text-[#00a650] mt-1 block">Pay Bill</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">4.</span>
                <div>
                  <span>Enter Paybill number</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded block mt-1">880100</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">5.</span>
                <div>
                  <span>Enter Account number</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded block mt-1">170027</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2 min-w-[20px]">6.</span>
                <span>Enter amount and complete transaction</span>
              </li>
            </ol>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Payments are processed instantly. Contact support for any assistance.
          </div>
        </div>
      </section>
      
      <style >{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}