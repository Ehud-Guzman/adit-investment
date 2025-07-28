// backend/utils/cartHelpers.js

import { ObjectId } from "mongodb";

/** 🧼 Convert _id and productId to strings for frontend use */
export const normalizeCartItems = (items = []) =>
  items.map((item) => ({
    ...item,
    id: item._id?.toString?.() || item.id,
    _id: item._id?.toString?.(),
    productId: item.productId?.toString?.(),
  }));

/** 🧪 ObjectId checker */
export const isValidObjectId = (id) =>
  id && typeof id === "string" && ObjectId.isValid(id);

/** 🧹 Remove items with missing or invalid products */
export const sanitizeGhostCartItems = async (userId, cartCollection, productsCollection) => {
  const userCart = await cartCollection.find({ userId }).toArray();

  for (const item of userCart) {
    const pid = item.productId;
    if (!isValidObjectId(pid)) {
      await cartCollection.deleteOne({ _id: item._id });
      console.warn(`🧽 Removed cart item with invalid productId: ${pid}`);
      continue;
    }

    const exists = await productsCollection.findOne({ _id: new ObjectId(pid) });
    if (!exists) {
      await cartCollection.deleteOne({ _id: item._id });
      console.warn(`🧽 Removed cart item with missing product: ${pid}`);
    }
  }
};
