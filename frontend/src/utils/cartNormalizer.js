import { getProductById } from "@/services/api/products";

const isValidObjectId = (id) =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

const extractMeta = (item) => {
  return {
    title: String(item.name || item.title || "Unnamed Product"),
    price: Number(item.discountPrice ?? item.price ?? 0),
    image: String((item.image || item.images?.[0] || "").replace(/\\/g, "/")),
  };
};

export const normalizeCartItems = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const enrichedItems = await Promise.all(
    items.map(async (item, index) => {
      const productId = item?.productId;
      if (!productId || !isValidObjectId(productId)) return null;

      try {
        const product = await getProductById(productId);
        const meta = extractMeta(product);

        // Only use API result if it's valid
        if (meta.title && meta.price) {
          return {
            id: item.id || item._id?.toString?.() || `guest-${index}-${Date.now()}`,
            productId,
            quantity: item.quantity ?? 1,
            ...meta,
          };
        }
      } catch {
        // silently fail — fallback to original item below
      }

      // ✅ Use original item as fallback
      const fallbackMeta = extractMeta(item);
      if (!fallbackMeta.title || !fallbackMeta.price) return null;

      return {
        id: item.id || item._id?.toString?.() || `guest-${index}-${Date.now()}`,
        productId,
        quantity: item.quantity ?? 1,
        ...fallbackMeta,
      };
    })
  );

  return enrichedItems.filter(Boolean);
};
