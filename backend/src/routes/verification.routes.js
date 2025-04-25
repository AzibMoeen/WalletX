import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { 
  submitPassportVerification,
  submitGunVerification,
  getUserPassportVerifications,
  getUserGunVerifications
} from "../controllers/admin.controllers.js";

const router = express.Router();

// Submission routes
router.post("/passport", verifyJWT, upload.single('passportImage'), submitPassportVerification);
router.post("/gun", verifyJWT, upload.single('gunImage'), submitGunVerification);

// User verification status routes
router.get("/passport/me", verifyJWT, getUserPassportVerifications);
router.get("/gun/me", verifyJWT, getUserGunVerifications);

export default router;