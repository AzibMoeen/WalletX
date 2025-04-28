import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        let token = null;
        
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        } 
        else if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            } else {
                token = authHeader;
            }
        }

        console.log("Token extracted:", token ? "Token found" : "No token found");
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - Token Missing" 
            });
        }

        if (typeof token !== 'string' || token.trim() === '') {
            return res.status(401).json({ 
                success: false,
                message: "Invalid token format - Token must be a non-empty string" 
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid Access Token - User not found" 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        console.error("Request headers:", JSON.stringify(req.headers, null, 2));
        
        let errorMessage = "Authentication failed";
        
        if (error.name === "JsonWebTokenError") {
            errorMessage = "Invalid token format or signature";
        } else if (error.name === "TokenExpiredError") {
            errorMessage = "Session expired. Please login again.";
        }
        
        return res.status(401).json({ 
            success: false,
            message: errorMessage
        });
    }
};

export { verifyJWT };