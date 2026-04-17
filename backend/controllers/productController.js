import { ObjectId } from 'mongodb';

export default function ProductController(productsCollection) {
  return {
    getAll: async (req, res) => {
      try {
        const {
          page = 1,
          limit = 12,
          category,
          featured,
          search,
          discount,
          sort = "featured",
        } = req.query;

        const parsedPage = Math.max(1, parseInt(page));
        const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (parsedPage - 1) * parsedLimit;

        const query = {};

        if (category && category !== "all") {
          query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        if (featured !== undefined) {
          query.featured = featured === "true";
        }

        if (discount === "true") {
          query.discountPercentage = { $gt: 0 };
        }

        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        const sortOptions = {
          'price-low': { price: 1 },
          'price-high': { price: -1 },
          'name-asc': { name: 1 },
          'name-desc': { name: -1 },
          'rating-high': { rating: -1 },
          'newest': { createdAt: -1 },
          'featured': { featured: -1, createdAt: -1 },
        };

        const sortOption = sortOptions[sort] || sortOptions.featured;

        const [products, total] = await Promise.all([
          productsCollection
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parsedLimit)
            .toArray(),
          productsCollection.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / parsedLimit);

        res.status(200).json({
          success: true,
          data: products,
          pagination: {
            page: parsedPage,
            limit: parsedLimit,
            total,
            pages: totalPages,
            hasNext: parsedPage < totalPages,
            hasPrev: parsedPage > 1,
          }
        });
      } catch (err) {
        console.error("❌ Product fetch error:", err);
        res.status(500).json({
          success: false,
          message: "Failed to fetch products",
          error: err.message,
        });
      }
    },

    getById: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await productsCollection.findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
      } catch (err) {
        console.error("❌ Failed to fetch product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    },

    create: async (req, res) => {
      try {
        const { name, price, description, category, stock, rating, featured, discountPercentage } = req.body;

        if (!name || !price || !description || !category) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields",
          });
        }

        const newProduct = {
          name,
          price: parseFloat(price),
          description,
          category,
          stock: parseInt(stock) || 0,
          rating: parseFloat(rating) || 0,
          featured: Boolean(featured),
          discountPercentage: parseFloat(discountPercentage) || 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await productsCollection.insertOne(newProduct);
        const createdProduct = await productsCollection.findOne({ _id: result.insertedId });

        res.status(201).json({
          success: true,
          data: createdProduct,
        });
      } catch (err) {
        console.error("❌ Failed to create product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    },

    update: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const updates = {
          ...req.body,
          updatedAt: new Date(),
        };

        if (updates.price !== undefined) updates.price = parseFloat(updates.price);
        if (updates.rating !== undefined) updates.rating = parseFloat(updates.rating);
        if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);
        if (updates.discountPercentage !== undefined) updates.discountPercentage = parseFloat(updates.discountPercentage);
        if ("featured" in updates) updates.featured = Boolean(updates.featured);

        const result = await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) });

        res.status(200).json({
          success: true,
          data: updatedProduct,
        });
      } catch (err) {
        console.error("❌ Failed to update product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    },

    patch: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const updates = { ...req.body, updatedAt: new Date() };

        if ("featured" in updates) updates.featured = Boolean(updates.featured);
        if ("approved" in updates) updates.approved = Boolean(updates.approved);

        const result = await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product patched successfully" });
      } catch (err) {
        console.error("❌ Patch error:", err);
        res.status(500).json({ success: false, message: "Failed to patch product" });
      }
    },

    remove: async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
          success: true,
          message: "✅ Product deleted successfully",
        });
      } catch (err) {
        console.error("❌ Failed to delete product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    },

    getRandom: async (req, res) => {
      try {
        const randomProduct = await productsCollection.aggregate([
          { $match: { approved: true } },
          { $sample: { size: 1 } }
        ]).toArray();

        if (randomProduct.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No products available"
          });
        }

        res.status(200).json({
          success: true,
          data: randomProduct[0]
        });
      } catch (err) {
        console.error("❌ Failed to fetch random product:", err);
        res.status(500).json({
          success: false,
          message: "Internal Server Error"
        });
      }
    },
  };
}
