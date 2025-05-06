import dotenv from "dotenv";
import { connectDB } from "./Db/index.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 8000;

// Start server function
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

// Initialize app - connect to DB then start server
connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

  
// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});