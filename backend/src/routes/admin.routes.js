import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
  getAllUsers,
  getUserById,
  deleteUser,
  getPassportVerifications,
  getGunVerifications,
  updatePassportVerificationStatus,
  updateGunVerificationStatus,
  getDashboardStats
} from "../controllers/admin.controllers.js";

const router = express.Router();

// Admin middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Apply auth and admin middleware to all routes
router.use(verifyJWT, isAdmin);

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.delete("/users/:userId", deleteUser);

// Verification management routes
router.get("/verifications/passport", getPassportVerifications);
router.get("/verifications/gun", getGunVerifications);
router.patch("/verifications/passport/:verificationId", updatePassportVerificationStatus);
router.patch("/verifications/gun/:verificationId", updateGunVerificationStatus);

export default router;