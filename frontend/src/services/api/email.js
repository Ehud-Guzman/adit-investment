// src/services/api/email.js
import { api } from "./index";

// ✅ Trigger resend verification email
export const resendVerificationEmail = async (email) => {
  const res = await api.post("/email/resend-verification", { email });
  return res.data;
};

// ✅ Manually verify email (optional, if needed outside <VerifyEmail/>)
export const verifyEmail = async (token) => {
  const res = await api.get(`/email/verify-email/${token}`);
  return res.data;
};
