// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; // ✅ Render picks this up automatically

// === MIDDLEWARE ===
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://adit-investment.netlify.app', // If still using Netlify
    'https://adit-investment.onrender.com', // This is your own backend domain
    
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// === DATABASE CONNECTION ===
const client = new MongoClient(process.env.MONGO_URI);

let db, products, users;

try {
  await client.connect();
  console.log('🧠 Connected to MongoDB');

  db = client.db('ADIT-website');
  products = db.collection('products');
  users = db.collection('users');
} catch (err) {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
}

// === ROUTES ===

// Health check
app.get('/api/ping', async (req, res) => {
  try {
    const status = await db.command({ ping: 1 });
    res.json({ message: '✅ MongoDB is alive', status: status.ok === 1 ? 'ok' : 'not ok' });
  } catch (err) {
    res.status(500).json({ message: '❌ MongoDB dead', error: err.message });
  }
});

// ==== PRODUCTS ====
app.get('/api/products', async (req, res) => {
  try {
    const all = await products.find({}).toArray();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch products', error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await products.findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch product', error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const result = await products.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add product', error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const result = await products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to update product', error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await products.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to delete product', error: err.message });
  }
});

// ==== USERS ====
app.post('/api/users', async (req, res) => {
  try {
    const result = await users.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add user', error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const all = await users.find({}).toArray();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch users', error: err.message });
  }
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 ADIT backend live on port ${PORT}`);
});
