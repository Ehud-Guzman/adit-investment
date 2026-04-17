import { ObjectId } from "mongodb";
import { parseXlsx } from "../../utils/xlsxParser.js";
import { buildXlsx } from "../../utils/xlsxWriter.js";

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

// 📤 EXPORT PRODUCTS TO XLSX
export const exportProducts = async (req, res, products) => {
  try {
    const all = await products
      .find({})
      .sort({ category: 1, name: 1 })
      .toArray();

    const HEADERS = [
      'Name', 'Category', 'Price (KES)', 'Original Price (KES)', 'Discount %',
      'Stock', 'Description', 'Featured', 'Approved', 'Rating', 'Reviews',
      'Image 1', 'Image 2', 'Image 3',
    ];

    const rows = [HEADERS];
    for (const p of all) {
      const imgs = Array.isArray(p.images) ? p.images : [];
      rows.push([
        p.name              ?? '',
        p.category          ?? '',
        p.price             ?? 0,
        p.originalPrice     ?? p.price ?? 0,
        p.discountPercentage ?? 0,
        p.stock             ?? 0,
        p.description       ?? '',
        p.featured  ? 'Yes' : 'No',
        p.approved  ? 'Yes' : 'No',
        p.rating    ?? 0,
        p.reviews   ?? 0,
        imgs[0] ?? '',
        imgs[1] ?? '',
        imgs[2] ?? '',
      ]);
    }

    const buf = buildXlsx(rows);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `adit_products_${date}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buf.length);
    return res.send(buf);
  } catch (err) {
    console.error('❌ exportProducts error:', err);
    res.status(500).json({ success: false, message: 'Export failed', error: err.message });
  }
};

// 📥 IMPORT PRODUCTS FROM XLSX
export const importProducts = async (req, res, products) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "No xlsx file uploaded" });
    }

    let rows;
    try {
      rows = parseXlsx(req.file.buffer);
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: `Failed to parse xlsx: ${parseErr.message}` });
    }

    if (rows.length < 2) {
      return res.status(400).json({ success: false, message: "Spreadsheet has no data rows" });
    }

    // ── Map headers (case-insensitive) ──────────────────────────────
    const headers = rows[0].map(h => h.toString().toLowerCase().trim());
    const col = (fragment) => headers.findIndex(h => h.includes(fragment));

    const iName      = col('name');
    const iCat       = col('category');
    const iPrice     = col('price');
    const iOrigPrice = col('original price');
    const iDiscount  = col('discount');
    const iStock     = col('stock');
    const iDesc      = col('description');
    const iFeatured  = col('featured');
    const iApproved  = col('approved');
    const iRating    = col('rating');
    const iImg1      = col('image 1');
    const iImg2      = col('image 2');
    const iImg3      = col('image 3');

    if (iName === -1 || iPrice === -1) {
      return res.status(400).json({
        success: false,
        message: "Xlsx must have at least 'Name' and 'Price' columns",
      });
    }

    // ── Process rows ─────────────────────────────────────────────────
    let inserted = 0, updated = 0, skipped = 0, failed = 0;
    const errors = [];

    for (const row of rows.slice(1)) {
      const name = row[iName]?.toString().trim();
      if (!name) { skipped++; continue; }

      const price         = parseFloat(row[iPrice])     || 0;
      const originalPrice = parseFloat(row[iOrigPrice]) || price;
      const discount      = parseFloat(row[iDiscount])  || 0;
      const stock         = parseInt(row[iStock])        || 0;
      const category      = row[iCat]?.toString().trim() || 'Accessories';
      const description   = row[iDesc]?.toString().trim() || '';
      const featured      = row[iFeatured]?.toString().toLowerCase() === 'yes';
      const approved      = row[iApproved]?.toString().toLowerCase() !== 'no';
      const rating        = parseFloat(row[iRating]) || 0;

      const images = [iImg1, iImg2, iImg3]
        .filter(i => i >= 0)
        .map(i => row[i]?.toString().trim())
        .filter(Boolean);

      const doc = {
        name,
        category,
        price,
        originalPrice,
        discountPercentage: discount,
        stock,
        description,
        featured,
        approved,
        rating,
        images,
        updatedAt: new Date(),
      };

      try {
        const existing = await products.findOne({
          name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });

        if (existing) {
          await products.updateOne({ _id: existing._id }, { $set: doc });
          updated++;
        } else {
          await products.insertOne({ ...doc, createdAt: new Date() });
          inserted++;
        }
      } catch (err) {
        failed++;
        errors.push(`${name}: ${err.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Import complete: ${inserted} inserted, ${updated} updated, ${skipped} skipped, ${failed} failed`,
      inserted,
      updated,
      skipped,
      failed,
      errors: errors.slice(0, 20), // cap at 20 error details
    });
  } catch (err) {
    console.error("❌ importProducts error:", err);
    res.status(500).json({ success: false, message: "Import failed", error: err.message });
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
