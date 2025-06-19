import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
console.log('🧪 [DEBUG] Render PORT:', process.env.PORT);
console.log('🧪 [DEBUG] Render MONGO_URI:', process.env.MONGO_URI);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://adit-investment.onrender.com',
    'https://adit-investment-frontend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
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

// Health Check
app.get('/api/ping', async (req, res) => {
  try {
    const status = await db.command({ ping: 1 });
    res.json({ message: '✅ MongoDB is alive', status: status.ok === 1 ? 'ok' : 'not ok' });
  } catch (err) {
    res.status(500).json({ message: '❌ MongoDB dead', error: err.message });
  }
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
  const data = await products.find().toArray();
  res.json(data);
});
app.get('/api/products/:id', async (req, res) => {
  const item = await products.findOne({ _id: new ObjectId(req.params.id) });
  item ? res.json(item) : res.status(404).json({ message: 'Not found' });
});
app.post('/api/products', async (req, res) => {
  const result = await products.insertOne(req.body);
  res.status(201).json(result);
});
app.put('/api/products/:id', async (req, res) => {
  const result = await products.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json(result);
});
app.delete('/api/products/:id', async (req, res) => {
  const result = await products.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

// USERS
app.post('/api/users', async (req, res) => {
  const result = await users.insertOne(req.body);
  res.status(201).json(result);
});
app.get('/api/users', async (req, res) => {
  const all = await users.find().toArray();
  res.json(all);
});

// CART
app.get('/api/cart', async (req, res) => {
  const data = await cart.find().toArray();
  res.json(data);
});
app.post('/api/cart', async (req, res) => {
  const result = await cart.insertOne(req.body);
  res.status(201).json(result);
});
app.put('/api/cart/:id', async (req, res) => {
  const result = await cart.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json(result);
});
app.delete('/api/cart/:id', async (req, res) => {
  const result = await cart.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

// WISHLIST
app.get('/api/wishlist', async (req, res) => {
  const data = await wishlist.find().toArray();
  res.json(data);
});
app.post('/api/wishlist', async (req, res) => {
  const result = await wishlist.insertOne(req.body);
  res.status(201).json(result);
});
app.delete('/api/wishlist/:id', async (req, res) => {
  const result = await wishlist.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 ADIT backend live on port ${PORT}`);
});
