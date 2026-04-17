import { useState } from "react";
import { FiSmartphone, FiCopy, FiCheck, FiChevronDown } from "react-icons/fi";

const PAYMENT_DETAILS = [
  { label: "Paybill", value: "880100", field: "paybill" },
  { label: "Account No.", value: "170027", field: "account" },
];

const STEPS = [
  "Open M-PESA → Lipa na M-PESA → Pay Bill",
  "Enter Paybill: 880100",
  "Enter Account: 170027",
  "Enter amount → confirm with M-PESA PIN",
];

export default function LipaNaMpesa() {
  const [copied, setCopied] = useState(null);
  const [stepsOpen, setStepsOpen] = useState(false);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="mx-4 sm:mx-6 my-10 rounded-2xl overflow-hidden border border-green-100 shadow-sm bg-white">
      {/* Top strip */}
      <div className="bg-[#00a650] px-5 py-3 flex items-center gap-2.5">
        <FiSmartphone className="text-white shrink-0" size={18} />
        <span className="text-white font-semibold text-sm tracking-wide">Lipa na M-PESA</span>
        <span className="ml-auto text-green-200 text-xs">Buy Goods & Services</span>
      </div>

      {/* Payment numbers + how-to toggle */}
      <div className="px-5 py-4">
        {/* Numbers row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          {PAYMENT_DETAILS.map(({ label, value, field }) => (
            <div
              key={field}
              className="flex items-center justify-between flex-1 bg-green-50 border border-green-100 rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xl font-bold text-gray-800 tracking-widest font-mono">{value}</p>
              </div>
              <button
                onClick={() => handleCopy(value, field)}
                className="ml-3 p-2 rounded-full hover:bg-green-100 transition-colors"
                aria-label={`Copy ${label}`}
              >
                {copied === field
                  ? <FiCheck className="text-green-600" size={16} />
                  : <FiCopy className="text-gray-400 hover:text-green-600" size={16} />
                }
              </button>
            </div>
          ))}
        </div>

        {/* How to pay — collapsible */}
        <button
          onClick={() => setStepsOpen(!stepsOpen)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition-colors select-none"
        >
          <FiChevronDown
            size={13}
            className={`transition-transform duration-200 ${stepsOpen ? "rotate-180" : ""}`}
          />
          How to pay
        </button>

        {stepsOpen && (
          <ol className="mt-3 space-y-1.5 pl-1">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="shrink-0 w-4 h-4 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center text-[10px]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
