import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-4 group">
      <motion.div
        initial={{ scale: 0.9, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/30 rounded-xl p-1 shadow-[0_5px_25px_-5px_rgba(0,166,81,0.45)] hover:shadow-[0_8px_35px_-5px_rgba(30,144,255,0.6)] transition-all duration-500"
      >
        <motion.img
          src="/assets/images/services/logo.jpg"
          alt="Logo"
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          whileHover={{ rotate: 2 }}
        />
        <div className="absolute inset-0 rounded-lg ring-2 ring-primary/30 group-hover:ring-accent/50 transition-all duration-300" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-white/5 to-transparent opacity-20 pointer-events-none rounded-xl" />
      </motion.div>

      <div className="flex flex-col">
        <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Adit Investment
        </span>
        <span className="text-[0.65rem] sm:text-xs text-gray-500 hidden sm:block italic font-mono tracking-wide group-hover:text-accent transition-all duration-300">
          Tech fixed. Connected. Secured.
        </span>
      </div>
    </Link>
  );
};

export default Logo;
