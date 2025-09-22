const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initializeDatabase } = require("./database/db");
const domainRoutes = require("./routes/domains");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    "http://127.0.0.1:5502", // Your frontend origin
    "http://localhost:5502", // Alternative localhost
    "http://127.0.0.1:3000", // Alternative port
    "http://localhost:3000", // Alternative portstatus
  ],
  credentials: true, // Allow credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Referer", "Referrer"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/domains", domainRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log("SQLite database initialized successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
