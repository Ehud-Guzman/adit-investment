// components/contact/ContactForm.jsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  message: yup.string().required("Message cannot be empty."),
});

export default function ContactForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <motion.form
      id="contact-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl px-6 sm:px-10 py-10 border border-white/40 shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Send a Message
      </h2>

      {/* Name */}
      <div className="mb-5">
        <label className="block mb-1 font-medium text-gray-800">Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full px-4 py-3 rounded-md bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          placeholder="Your Name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block mb-1 font-medium text-gray-800">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full px-4 py-3 rounded-md bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-800">Message</label>
        <textarea
          rows="5"
          {...register("message")}
          className="w-full px-4 py-3 rounded-md bg-white/70 border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          placeholder="Type your message here..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-semibold py-3 rounded-md shadow-md hover:opacity-90 transition-all"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </motion.form>
  );
}
