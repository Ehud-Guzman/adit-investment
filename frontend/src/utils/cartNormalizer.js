import { getProductById } from "@/services/api/products";

// 🔐 Validate MongoDB ObjectId format
const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

// 🚨 Trusted fields only — ensure cart enrichment can’t inject weird data
const sanitizeProductMeta = (product) => {
  if (
    !product ||
    typeof product !== "object" ||
    !product.name ||
    (!product.price && !product.discountPrice)
  ) {
    return null;
  }

  return {
    title: String(product.name),
    price: Number(product.discountPrice ?? product.price ?? 0),
    image: String((product.image || product.images?.[0] || "").replace(/\\/g, "/")),
  };
};

// 🧠 Enrich cart items with full product metadata
export const normalizeCartItems = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      const productId = item?.productId;

      // 🛡️ Skip any item that’s malformed or missing required fields
      if (!productId || !isValidObjectId(productId)) return null;

      try {
        const product = await getProductById(productId);
        const meta = sanitizeProductMeta(product);
        if (!meta) return null;

        return {
          ...item,
          id: item.id || item._id?.toString?.() || `guest-${Date.now()}`,
          ...meta,
        };
      } catch {
        // 🔒 On failure, silently drop the item
        return null;
      }
    })
  );

  // 🧹 Filter out nulls or invalids
  return enrichedItems.filter(Boolean);
};
