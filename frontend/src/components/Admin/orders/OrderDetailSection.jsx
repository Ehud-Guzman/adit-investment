// components/Admin/orders/OrderDetailSection.jsx

export default function OrderDetailSection({ icon, title, children, variant = "default" }) {
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="space-y-3 animate-fade-in" aria-labelledby={sectionId}>
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3
          id={sectionId}
          className="text-base font-semibold text-gray-900 tracking-tight"
        >
          {title}
        </h3>
      </div>

      <div
        className={`pl-7 text-sm leading-relaxed ${
          variant === "primary" ? "text-gray-800" : "text-gray-600"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
