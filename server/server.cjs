// server/server.cjs
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS to allow cross-origin requests
app.use(cors({
  origin: "*",  // Allows all origins (use with caution in production)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback to index.html for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Bind to 0.0.0.0 for Render
app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port ${PORT}`));
