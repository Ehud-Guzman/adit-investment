// server.js
import express from 'express';
import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 3001;

const app = express();

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://adit-investment.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// JSON Server setup
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: join(__dirname, 'dist')
});
app.use('/api', middlewares, router);

// Serve React frontend (dist folder)
app.use(express.static(join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
