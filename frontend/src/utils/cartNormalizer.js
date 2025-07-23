// utils/cartNormalizer.js
export const normalizeCartItems = (items = []) =>
  items.map((item) => ({
    ...item,
    id: item._id?.toString?.() || item.id || `guest-${Date.now()}`,
  }));
