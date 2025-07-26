import { ObjectId } from "mongodb";

const findProductByIdFlexible = async (collection, id) => {
  if (ObjectId.isValid(id)) {
    const objId = new ObjectId(id);
    const doc = await collection.findOne({ _id: objId });
    if (doc) return { product: doc, filter: { _id: objId } };
  }
  const doc = await collection.findOne({ _id: id });
  return doc ? { product: doc, filter: { _id: id } } : { product: null, filter: null };
};

// 🚀 GET ALL PRODUCTS (ADMIN)
export const getAdminProducts = async (req, res, products) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9999;
    const skip = (page - 1) * limit;

    const total = await products.countDocuments();
    const items = await products
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json({
      success: true,
      products: items,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
      },
    });
  } catch (err) {
    console.error("❌ getAdminProducts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

// ✅ CREATE PRODUCT (with multiple image URLs)
export const createProduct = async (req, res, products) => {
  try {
    const {
      name,
      price,
      category,
      description = "",
      stock = 0,
      images = [],
      isFeatured = false,
      approved = true,
      vendor = "",
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Missing name, price, or category" });
    }

    const product = {
      name,
      price: Number(price),
      category,
      description,
      stock: Number(stock),
      images: Array.isArray(images) ? images : [images], // Enforce array
      isFeatured: Boolean(isFeatured),
      approved: Boolean(approved),
      vendor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await products.insertOne(product);

    res.status(201).json({
      message: "Product created",
      product: { _id: result.insertedId, ...product },
    });
  } catch (err) {
    console.error("❌ createProduct error:", err);
    res.status(500).json({ message: "Error creating product" });
  }
};

// 🔁 UPDATE PRODUCT (same structure)
export const updateProduct = async (req, res, products) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const { product, filter } = await findProductByIdFlexible(products, id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updateDoc = {
      $set: {
        ...updates,
        price: Number(updates.price),
        stock: Number(updates.stock),
        isFeatured: Boolean(updates.isFeatured),
        approved: Boolean(updates.approved),
        images: Array.isArray(updates.images) ? updates.images : [updates.images],
        updatedAt: new Date(),
      },
    };

    const result = await products.updateOne(filter, updateDoc);
    const updatedProduct = await products.findOne(filter);

    res.status(200).json({
      message: "Product updated",
      product: updatedProduct,
      result,
    });
  } catch (err) {
    console.error("❌ updateProduct error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res, products) => {
  try {
    const id = req.params.id;
    const { product, filter } = await findProductByIdFlexible(products, id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const result = await products.deleteOne(filter);
    res.status(200).json({
      message: "Product deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("❌ deleteProduct error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
