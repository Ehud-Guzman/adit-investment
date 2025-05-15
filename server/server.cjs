// server.cjs
const express = require("express");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");
const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://adit-investment.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// JSON Server setup
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.use("/api", middlewares, router);

// Serve React frontend (dist folder)
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Start the server
app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port ${PORT}`));
