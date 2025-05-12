import express from "express";
import {
  Register,
  Login,
  Logout,
  GetProfile,
  SendVerificationEmail,
  VerifyAndRegister,
  ForgotPassword,
  ResetPassword,
  UpdateProfile,
  UpdateProfilePicture,
  ChangePassword,
} from "../controllers/userAuth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Email verification routes
router.post("/email-verification", SendVerificationEmail);
router.post("/verify-and-register", VerifyAndRegister);

// Password reset routes
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

// Authentication routes
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.get("/profile", verifyJWT, GetProfile);
// Add the /me endpoint as an alias to /profile for frontend compatibility
router.get("/me", verifyJWT, GetProfile);

router.route("/profile").get(verifyJWT, GetProfile);
router.route("/profile/update").post(verifyJWT, UpdateProfile);
router.route("/profile/change-password").post(verifyJWT, ChangePassword);
router.route("/profile/update-picture").post(
  verifyJWT,
  upload.single("profilePicture"), // Using multer to handle file upload
  UpdateProfilePicture
);

router.delete("/profile/delete", verifyJWT, async (req, res) => {
  try {
    res.status(200).json({ message: "Profile deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile.", error });
  }
});

export default router;
