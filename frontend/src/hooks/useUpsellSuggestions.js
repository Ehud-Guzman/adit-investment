// hooks/useUpsellSuggestions.js
import { useMemo } from "react";
import productRelations from "@/utils/productRelations";

// ✅ Safe string normalizer
const normalize = (str) =>
  String(str || "").trim().toLowerCase().replace(/\s+/g, "-");

export const useUpsellSuggestions = (cart = [], products = []) => {
  return useMemo(() => {
    const categoriesInCart = cart
      .map((item) => {
        const product = products.find(
          (p) => p._id?.toString?.() === item.productId
        );
        return normalize(product?.category);
      })
      .filter(Boolean);

    const suggestedCategories = new Set();

    categoriesInCart.forEach((cat) => {
      const related = productRelations[cat];
      if (related) {
        related.forEach((rel) => suggestedCategories.add(normalize(rel)));
      }
    });

    const upsellProducts = products.filter((p) =>
      suggestedCategories.has(normalize(p.category))
    );

 

    return upsellProducts.slice(0, 4);
  }, [cart, products]);
};
