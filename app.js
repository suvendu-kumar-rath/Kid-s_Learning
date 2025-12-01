const express = require("express");
require("dotenv").config();
const path = require("path");
const sequelize = require("./config/db");
const responseMiddleware = require("./middlewares/response.middleware");
const cors =require("cors");

// Import models
const models = require("./model");

// Import routes
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/image.routes");
const categoryRoutes = require("./routes/category.routes")

// Import seeder
const seedDefaultData = require("./seeders/default-seeder");

const app = express();
const PORT = process.env.APP_PORT || 3000;

// CORS configuration .................
app.use(cors({
  origin: '*', // Allow all origins, or specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));    

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories",categoryRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// Initialize database and start server
async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ alter: false });
    if (models && models.LearningItem) {
      await models.LearningItem.sync({ alter: true });
    }
    console.log("All models were synchronized successfully.");

    // Seed default data
    await seedDefaultData();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
