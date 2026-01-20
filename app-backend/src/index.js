// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Core imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

// Custom utility to connect to MongoDB
import connectDB from "./db/connectDB.js";

// Initialize express app
const app = express();

// ---------------------------
// Middleware Configuration
// ---------------------------

// Enable CORS to allow requests from frontend (e.g., React app)
// CORS: reflect request origin to avoid hardcoded mismatch (Expo/dev/device)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies from incoming requests
app.use(cookieParser());

// Serve static assets from the "public" directory
app.use(express.static("public"));

// Mount user routes
app.use("/api/users", userRoutes);

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
