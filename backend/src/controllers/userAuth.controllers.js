import { User } from "../models/user.model.js";

async function Register(req, res) {
    try {
        const { fullname, email, mobile, password } = req.body;

        const existingUser = await User.findOne({ 
            $or: [{ email }, { mobile }] 
        });

        if (existingUser) {
            return res.status(409).json({ 
                message: existingUser.email === email 
                    ? "Email already registered" 
                    : "Mobile number already registered" 
            });
        }

       const user = await User.create({
            fullname,
            email,
            mobile,
            password,
        });

     
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
            user: userWithoutPassword,
            message: "User registered successfully"
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
}

async function Login(req, res){
    try {
        console.log("Login request body:", req.body);
        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password +refreshToken");
        console.log(user);
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        console.log("Password check result:", isPasswordCorrect);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true
        });
        
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure : true
        });
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        delete userWithoutPassword.refreshToken;
        
        res.status(200).json({
            user: userWithoutPassword,
            accessToken,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: "Server error"});
    }
}

async function Logout(req, res) {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        
        
        const userId = req.user?._id;
        console.log("hello", userId);
        
        if (userId) {
            await User.findByIdAndUpdate(
                userId,
                { $set: { refreshToken: null } },
                { new: true }
            );
        }
        
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Logout failed" });
    }
}

async function GetProfile(req, res) {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).select("-password -refreshToken");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            user,
            message: "User profile fetched successfully"
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch user profile" });
    }
}

export { Register, Login, Logout, GetProfile };