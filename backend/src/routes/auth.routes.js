import express from "express";
import { Register, Login, Logout, GetProfile, SendVerificationEmail, VerifyAndRegister, ForgotPassword, ResetPassword } from "../controllers/userAuth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";



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

export default router;