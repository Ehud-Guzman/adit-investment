import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/services/api/products";
import { Loader2 } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        if (!data) {
          setError("Product not found.");
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError("Failed to load product.");
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
        <span className="ml-2 text-gray-500">Loading product...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-emerald-600 font-semibold text-xl">
            KES {product.price?.toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm">{product.description || "No description provided."}</p>
          <div className="text-sm text-gray-500">Category: {product.category}</div>
          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
        </div>
      </div>
    </div>
  );
}
