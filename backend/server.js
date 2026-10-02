const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// 1. Load Environment Variables
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

// Authentication & Core API Routes
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// 2. Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Security & Global Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Enable inline fonts/images from Unsplash & CDNs
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration supporting Live Server and custom origins
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive during local development
      }
    },
    credentials: true
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  }
});
app.use("/api/", apiLimiter);

// 4. API Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    timestamp: new Date().toISOString(),
    service: "Zion Food Corner API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);

// 5. Serve Static Frontend Files (Optional unified serving)
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Fallback to frontend index for root navigation
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 6. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 7. Connect to MongoDB Atlas and Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
=====================================================
  🍛 ZION FOOD CORNER - RESTAURANT API SERVER
=====================================================
  [Status]      : Running
  [Port]        : ${PORT}
  [Environment] : ${process.env.NODE_ENV || "development"}
  [API Root]    : http://localhost:${PORT}/api
  [Health]      : http://localhost:${PORT}/api/health
=====================================================
      `);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error.");
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});
