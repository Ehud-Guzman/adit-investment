import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

// Validation Schemas
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const registerSchema = yup.object().shape({
  name: yup.string().min(2).required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const AuthSection = ({
  authMode,
  setAuthMode,
  login,
  register,
  isLoggingIn,
  isRegistering,
  isOpen,
  onClose,
  passwordFieldType,
  confirmPasswordFieldType,
  passwordIcon,
  confirmPasswordIcon,
}) => {
  const isLogin = authMode === "login";
  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    reset();
  }, [authMode, isOpen]);

const onSubmit = async (formData) => {
  try {
    const action = isLogin ? login : register;
    const response = await action(formData);

    if (isLogin) {
      const { user } = response ?? {};
      if (!user) throw new Error("Login failed. Try again.");
      toast.success(`Welcome back, ${user.name}!`);
      onClose?.();
    } else {
      const message = response?.message || "";
      toast.success("✅ Registration successful. Check your email to verify your account.");
      setAuthMode("login");
    }
  } catch (error) {
    toast.error(error.message || "Authentication failed");
    console.warn("❌ Auth error:", error);
  }
};


  const isDisabled = isSubmitting || (isLogin ? isLoggingIn : isRegistering);

  return (
    <div className="px-6 py-8 sm:px-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login to your account" : "Create an account"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <div className="relative">
            <input
              {...formRegister("name")}
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
        )}

        <div className="relative">
          <input
            {...formRegister("email")}
            type="email"
            placeholder="Email address"
            className={`w-full px-4 py-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <input
            {...formRegister("password")}
            type={passwordFieldType}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {passwordIcon}
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {!isLogin && (
          <div className="relative">
            <input
              {...formRegister("confirmPassword")}
              type={confirmPasswordFieldType}
              placeholder="Confirm Password"
              className={`w-full px-4 py-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {confirmPasswordIcon}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-600 hover:underline font-medium"
          onClick={() => setAuthMode(isLogin ? "register" : "login")}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default AuthSection;
