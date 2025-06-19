// server.js
import express from 'express';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3001;

const app = express();

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://adit-investment.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Serve static frontend assets
app.use(express.static(join(__dirname, 'dist')));

// JSON Server setup for mock API


// Fallback: serve index.html for all non-API routes (React Router fix)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server is live on port ${PORT}`);
});
