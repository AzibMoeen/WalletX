import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
                      req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token Missing" });
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ 
            message: error.name === "JsonWebTokenError" 
                ? "Invalid token format" 
                : "Session expired. Please login again." 
        });
    }
};

export { verifyJWT };