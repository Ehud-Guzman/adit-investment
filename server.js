import express from 'express';
import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// JSON Server setup
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
app.use('/api', middlewares, router); // Serve API at /api/products, /api/cart, etc.

// Serve React frontend
app.use(express.static(join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
const port = 3001; // Hardcoded for local testing
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});