// layout/MainLayout.jsx
import Navbar from "@/components/Navbar";
import Footer from "@/layout/Footer/Footer";

export default function MainLayout({ children, setAuthModalOpen, setAuthMode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-zinc-950 dark:text-zinc-100 relative">
      {/* 🧭 Main Navbar */}
      <Navbar setAuthModalOpen={setAuthModalOpen} setAuthMode={setAuthMode} />

      {/* 📦 Page Content */}
      <main className="flex-grow pt-16 md:pt-20">{children}</main>

      {/* 🔻 Global Footer */}
      <Footer />
    </div>
  );
}
