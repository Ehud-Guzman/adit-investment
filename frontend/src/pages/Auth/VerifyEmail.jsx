import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | verified | already | failed

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        const { message, verified, alreadyVerified } = res.data;

        if (verified) {
          setStatus("verified");
          toast.success(message);
        } else if (alreadyVerified) {
          setStatus("already");
          toast.info(message);
        } else {
          setStatus("failed");
          toast.error("Something went wrong during verification.");
        }

        setTimeout(() => navigate("/login"), 3500);
      } catch (err) {
        const msg = err.response?.data?.message || "Verification failed.";
        toast.error(msg);
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token]);

  const renderMessage = () => {
    switch (status) {
      case "verifying":
        return "Verifying your email...";
      case "verified":
        return "✅ Email verified! Redirecting to login...";
      case "already":
        return "📩 Email already verified. Redirecting to login...";
      case "failed":
        return "❌ Verification failed. Please request a new link.";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Email Verification</h1>
        <p className="text-gray-600">{renderMessage()}</p>
      </div>
    </div>
  );
}
