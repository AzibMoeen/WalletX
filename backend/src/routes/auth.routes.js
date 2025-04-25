import express from "express";
import { Register, Login, Logout, GetProfile } from "../controllers/userAuth.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", verifyJWT, Logout);
router.get("/profile", verifyJWT, GetProfile);


export default router;