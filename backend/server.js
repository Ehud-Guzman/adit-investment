// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { upload } from './cloudinary.js'; // Adjust path as needed

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://adit-investment.netlify.app',
    'https://adit-investment-1.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DATABASE SETUP =====
const client = new MongoClient(process.env.MONGO_URI);
let db, products, users, cart, wishlist;

try {
  await client.connect();
  console.log('🧠 Connected to MongoDB');
  db = client.db('ADIT-website');
  products = db.collection('products');
  users = db.collection('users');
  cart = db.collection('cart');
  wishlist = db.collection('wishlist');
} catch (err) {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
}

const getQueryId = (id) => /^[0-9a-fA-F]{24}$/.test(id)
  ? { _id: new ObjectId(id) }
  : { id };

// ===== HEALTH CHECK =====
app.get('/api/ping', async (req, res) => {
  try {
    const status = await db.command({ ping: 1 });
    res.json({ message: '✅ MongoDB is alive', status: status.ok === 1 ? 'ok' : 'not ok' });
  } catch (err) {
    res.status(500).json({ message: '❌ MongoDB dead', error: err.message });
  }
});

// ===== PRODUCTS =====
app.get('/api/products', async (req, res) => {
  try {
    const data = await products.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch products', error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const item = await products.findOne(getQueryId(req.params.id));
    item
      ? res.json(item)
      : res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching product', error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: '⚠️ Request body is empty' });
    }

    const result = await products.insertOne(body);
    const insertedProduct = await products.findOne({ _id: result.insertedId });

    res.status(201).json(insertedProduct);
  } catch (err) {
    console.error('❌ POST /products error:', err.message);
    res.status(500).json({ message: '❌ Error creating product', error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const result = await products.updateOne(getQueryId(req.params.id), { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Error updating product', error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const filter = getQueryId(req.params.id);
    const product = await products.findOne(filter);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const deleteProduct = await products.deleteOne(filter);
    const deleteFromCart = await cart.deleteMany({ productId: req.params.id });
    const deleteFromWishlist = await wishlist.deleteMany({ productId: req.params.id });

    res.json({
      message: '✅ Product and related data deleted',
      deletedProduct: deleteProduct.deletedCount,
      removedFromCart: deleteFromCart.deletedCount,
      removedFromWishlist: deleteFromWishlist.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting product', error: err.message });
  }
});

// ===== IMAGE UPLOAD =====
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file?.path) throw new Error('No image returned from Cloudinary');
    res.status(201).json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: '❌ Upload failed', error: err.message });
  }
});

// ===== USERS =====
app.get('/api/users', async (req, res) => {
  try {
    const data = await users.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch users', error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const result = await users.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add user', error: err.message });
  }
});

// ===== CART =====
app.get('/api/cart', async (req, res) => {
  try {
    const data = await cart.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch cart', error: err.message });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const result = await cart.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add to cart', error: err.message });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const result = await cart.updateOne(getQueryId(req.params.id), { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to update cart', error: err.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const result = await cart.deleteOne(getQueryId(req.params.id));
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: '🗑️ Cart item removed successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting cart item', error: err.message });
  }
});

// ===== WISHLIST =====
app.get('/api/wishlist', async (req, res) => {
  try {
    const data = await wishlist.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch wishlist', error: err.message });
  }
});

app.post('/api/wishlist', async (req, res) => {
  try {
    const result = await wishlist.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add to wishlist', error: err.message });
  }
});

app.delete('/api/wishlist/:id', async (req, res) => {
  try {
    const result = await wishlist.deleteOne(getQueryId(req.params.id));
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.json({ message: '🗑️ Wishlist item removed successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error deleting wishlist item', error: err.message });
  }
});

// ===== CLEANUP ORPHANED CART/WISHLIST =====
app.delete('/api/cleanup', async (req, res) => {
  try {
    const productDocs = await products.find({}, { projection: { _id: 1 } }).toArray();
    const productIds = productDocs.map(p => p._id.toString());

    const removedCart = await cart.deleteMany({ productId: { $nin: productIds } });
    const removedWishlist = await wishlist.deleteMany({ productId: { $nin: productIds } });

    res.json({
      message: '🧹 Cleanup complete',
      removedFromCart: removedCart.deletedCount,
      removedFromWishlist: removedWishlist.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Cleanup failed', error: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 ADIT backend live on port ${PORT}`);
});
