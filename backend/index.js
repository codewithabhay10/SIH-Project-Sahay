// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Core imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Custom utility to connect to MongoDB
import connectDB from "./src/db/connectDB.js";

// Initialize express app
const app = express();

// ---------------------------
// Middleware Configuration
// ---------------------------

// Enable CORS to allow requests from frontend (e.g., React/Next.js app)
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map(o => o.trim());

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // In development, allow any localhost origin
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true, // Allow sending cookies and auth headers
  })
);

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies from incoming requests
app.use(cookieParser());

// Serve static assets from the "public" directory
app.use(express.static("public"));

// ---------------------------
// Route Definitions
// ---------------------------
// Mount API route handlers
import userRoutes from "./src/routes/users.route.js";
import proposalRoutes from "./src/routes/proposal.route.js";
import projectRoutes from "./src/routes/project.route.js";
import centralRoutes from "./src/routes/central.route.js";
import docCheckRoutes from "./src/routes/test_docs.routes.js";
import ucRoutes from "./src/routes/uc.route.js";

app.use("/api/users", userRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/central", centralRoutes);
app.use("/api/check", docCheckRoutes);
app.use("/api/uc", ucRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running", port: PORT });
});

// ---------------------------
// Start Server
// ---------------------------

const PORT = process.env.PORT || 1604;

// Connect to database and then start server
// Go to ./src/db/connectDB.js file to establish database connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });

    // Handle server-level errors
    app.on("error", (err) => {
      console.error("❌ Server error:", err);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
