// src/components/ui/table.jsx
export function Table({ children, className = "" }) {
  return <table className={`w-full text-sm text-left text-gray-700 ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100 text-gray-700 uppercase">{children}</thead>;
}

export function TableRow({ children }) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}

export function TableHead({ children }) {
  return <th scope="col" className="px-4 py-3 font-medium">{children}</th>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-2 text-sm ${className}`}>{children}</td>;
}
