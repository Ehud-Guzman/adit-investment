// src/pages/Auth/ResendVerification.jsx
import { useState } from "react";
import { email as emailApi } from "@/services/api/index";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await emailApi.resendVerificationEmail(email);
      setStatus("success");
      setMessage(res.message || "Verification email sent successfully.");
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.message || "Resend failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Resend Verification Email</h2>

        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Resend Email"}
        </button>

        {status !== "idle" && (
          <p
            className={`text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
