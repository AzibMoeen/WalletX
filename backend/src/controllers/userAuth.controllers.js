import { User } from "../models/user.model.js";
import { sendEmail } from "../../utils/emailService.js";
import crypto from "crypto";

const pendingRegistrations = new Map();
const passwordResetTokens = new Map();

function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send verification email
async function SendVerificationEmail(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        
        const verificationCode = generateVerificationCode();
        
        pendingRegistrations.set(email, {
            verificationCode,
            userData: req.body,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        });
        
        // Send email with verification code
        const emailSent = await sendEmail({
            email,
            subject: "Your WalletX Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Verify Your Email</h2>
                    <p>Thank you for registering with WalletX. To complete your registration, please use the verification code below:</p>
                    <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${verificationCode}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Best regards,<br>The WalletX Team</p>
                </div>
            `
        });
        
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }
        
        res.status(200).json({ 
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ message: "Failed to send verification email" });
    }
}

// Verify email with code and complete registration
async function VerifyAndRegister(req, res) {
    try {
        const { email, verificationCode } = req.body;
        
        if (!email || !verificationCode) {
            return res.status(400).json({ message: "Email and verification code are required" });
        }
        
        // Check if we have a pending registration for this email
        const pendingData = pendingRegistrations.get(email);
        
        if (!pendingData) {
            return res.status(400).json({ message: "Verification code expired or invalid. Please request a new one" });
        }
        
        // Check if code has expired
        if (Date.now() > pendingData.expiresAt) {
            pendingRegistrations.delete(email);
            return res.status(400).json({ message: "Verification code expired. Please request a new one" });
        }
        
        // Verify the code
        if (pendingData.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        
        // Extract user data and create the user
        const { fullname, mobile, password } = pendingData.userData;
        
        // Check if mobile already exists
        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return res.status(409).json({ message: "Mobile number already registered" });
        }
        
        // Create user
        const user = await User.create({
            fullname,
            email,
            mobile,
            password,
            isEmailVerified: true
        });
        
        // Remove from pending registrations
        pendingRegistrations.delete(email);
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        return res.status(201).json({
            user: userWithoutPassword,
            message: "Email verified and user registered successfully"
        });
        
    } catch (error) {
        console.error("Verification and registration error:", error);
        return res.status(500).json({ message: "Registration failed" });
    }
}

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

// Request password reset
async function ForgotPassword(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
        
        // Store token with expiry time (30 minutes)
        passwordResetTokens.set(email, {
            resetToken,
            expiresAt: Date.now() + 30 * 60 * 1000
        });
        
        // Send password reset email
        const emailSent = await sendEmail({
            email,
            subject: "WalletX Password Reset",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p>You have requested to reset your password for your WalletX account. Use the following code to reset your password:</p>
                    <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${resetToken}
                    </div>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p>Best regards,<br>The WalletX Team</p>
                </div>
            `
        });
        
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send password reset email" });
        }
        
        res.status(200).json({ 
            message: "Password reset code sent to your email",
            email
        });
    } catch (error) {
        console.error("Password reset email error:", error);
        return res.status(500).json({ message: "Failed to process password reset request" });
    }
}

// Reset password with token
async function ResetPassword(req, res) {
    try {
        const { email, resetToken, newPassword } = req.body;
        
        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ 
                message: "Email, reset token, and new password are required" 
            });
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long" 
            });
        }
        
        // Check if reset token exists and is valid
        const tokenData = passwordResetTokens.get(email);
        
        if (!tokenData) {
            return res.status(400).json({ 
                message: "Invalid or expired reset token. Please request a new one." 
            });
        }
        
        // Check if token has expired
        if (Date.now() > tokenData.expiresAt) {
            passwordResetTokens.delete(email);
            return res.status(400).json({ 
                message: "Reset token has expired. Please request a new one." 
            });
        }
        
        // Verify the token
        if (tokenData.resetToken !== resetToken) {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        
        // Find user and update password
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        // Remove token
        passwordResetTokens.delete(email);
        
        return res.status(200).json({
            message: "Password has been reset successfully"
        });
        
    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ message: "Failed to reset password" });
    }
}

export { Register, Login, Logout, GetProfile, SendVerificationEmail, VerifyAndRegister, ForgotPassword, ResetPassword };