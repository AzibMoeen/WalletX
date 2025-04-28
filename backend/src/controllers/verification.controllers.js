import { PassVerification } from "../models/passportverification.model.js";
import { GunVerification } from "../models/gunverification.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";


export async function PasssVerification(req, res) {
    try {
        const { passwordCnic, fullName, dob } = req.body;
        console.log("Received passport verification data:", req.body);
        if (!req.file) {
            return res.status(400).json({ message: "Passport image is required" });
        }

        const imageLocalPath = req.file.path;
        if (!fs.existsSync(imageLocalPath)) {
            return res.status(400).json({ message: "File upload failed - file not found at: " + imageLocalPath });
        }
        
        const userId = req.user._id; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let passPort;
        try {
            passPort = await uploadOnCloudinary(imageLocalPath);
            console.log("Uploaded passport image to Cloudinary:", passPort?.url);
            if (!passPort?.url) {
                throw new Error("Failed to upload passport image to Cloudinary");
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image: " + error.message });
        }
         
        const passVerification = new PassVerification({
            user: userId,
            passportImage: passPort.url,
            passwordCnic,
            fullName,
            dob,
            status: "pending",
        });
        
        await passVerification.save(); 
       
        console.log("Received passport image:", passPort.url);
        res.status(200).json({ 
            message: "Passport verification submitted successfully",
            status: "pending"
        });
    } catch (error) {
        console.error("Error during passport verification:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}


export async function GunnVerification(req, res) {
    try {
        const { licenseNumber, cnic, issueDate, expiryDate } = req.body;
        console.log("Received gun license verification data:", req.body);
        
        if (!req.file) {
            return res.status(400).json({ message: "Gun license image is required" });
        }

        const imageLocalPath = req.file.path;
        if (!fs.existsSync(imageLocalPath)) {
            return res.status(400).json({ message: "File upload failed - file not found at: " + imageLocalPath });
        }
        
        const userId = req.user._id; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let gunLicense;
        try {
            gunLicense = await uploadOnCloudinary(imageLocalPath);
            console.log("Uploaded gun license image to Cloudinary:", gunLicense?.url);
            if (!gunLicense?.url) {
                throw new Error("Failed to upload gun license image to Cloudinary");
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Failed to upload image: " + error.message });
        }
         
        const gunVerification = new GunVerification({
            user: userId,
            gunImage: gunLicense.url,
            licenseNumber,
            cnic,
            issueDate,
            expiryDate,
            status: "pending",
        });
        
        await gunVerification.save(); 
       
        console.log("Received gun license image:", gunLicense.url);
        res.status(200).json({ 
            message: "Gun license verification submitted successfully",
            status: "pending"
        });
    } catch (error) {
        console.error("Error during gun license verification:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}


export async function getAllGunVerifications(req, res) {
    try {
        const gunVerifications = await GunVerification.find({status:"pending"}).populate("user", "name email");
        res.status(200).json(gunVerifications);
    } catch (error) {
        console.error("Error fetching gun verifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getGunVerificationById(req, res) {
    try {
        const { id } = req.params;
        const gunVerification = await GunVerification.findById(id).populate("user", "name email");
        if (!gunVerification) {
            return res.status(404).json({ message: "Gun license verification not found" });
        }
        res.status(200).json(gunVerification);
    } catch (error) {
        console.error("Error fetching gun verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateGunVerification(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const gunVerification = await GunVerification.findById(id);
        if (!gunVerification) {
            return res.status(404).json({ message: "Gun license verification not found" });
        }
        
        gunVerification.status = status;
        await gunVerification.save();
        
        // If verification is approved, check if both verifications are complete
        if (status === 'verified') {
            // Check if user has a verified passport verification as well
            const passportVerification = await PassVerification.findOne({
                user: gunVerification.user,
                status: 'verified'
            });
            
            
            if (passportVerification) {
                await User.findByIdAndUpdate(gunVerification.user, { 
                    verified: true 
                });
            }
        }
        
        res.status(200).json({ message: "Gun license verification updated successfully" });
    } catch (error) {
        console.error("Error updating gun verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteGunVerification(req, res) {
    try {
        const { id } = req.params;
        const gunVerification = await GunVerification.findById(id);
        if (!gunVerification) {
            return res.status(404).json({ message: "Gun license verification not found" });
        }
        await GunVerification.deleteOne({ _id: id });
        res.status(200).json({ message: "Gun license verification deleted successfully" });
    } catch (error) {
        console.error("Error deleting gun verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserGunVerificationById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id; 
        const gunVerification = await GunVerification.findOne({ _id: id, user: userId }).populate("user", "name email");
        if (!gunVerification) {
            return res.status(404).json({ message: "Gun license verification not found" });
        }
        res.status(200).json(gunVerification);
    } catch (error) {
        console.error("Error fetching user's gun verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Original passport verification functions
export async function getAllPassVerifications(req, res) {
    try {
        const passVerifications = await PassVerification.find({status:"pending"}).populate("user", "name email");
        res.status(200).json(passVerifications);
    } catch (error) {
        console.error("Error fetching passport verifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getPassVerificationById(req, res) {
    try {
        const { id } = req.params;
        const passVerification = await PassVerification.findById(id).populate("user", "name email");
        if (!passVerification) {
            return res.status(404).json({ message: "Passport verification not found" });
        }
        res.status(200).json(passVerification);
    } catch (error) {
        console.error("Error fetching passport verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updatePassVerification(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const passVerification = await PassVerification.findById(id);
        if (!passVerification) {
            return res.status(404).json({ message: "Passport verification not found" });
        }
        
        passVerification.status = status;
        await passVerification.save();
        
        
        if (status === 'verified') {
            // Check if user has a verified gun verification as well
            const gunVerification = await GunVerification.findOne({
                user: passVerification.user,
                status: 'verified'
            });
            
            
            if (gunVerification) {
                await User.findByIdAndUpdate(passVerification.user, { 
                    verified: true 
                });
            }
        }
        
        res.status(200).json({ message: "Passport verification updated successfully" });
    } catch (error) {
        console.error("Error updating passport verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deletePassVerification(req, res) {
    try {
        const { id } = req.params;
        const passVerification = await PassVerification.findById(id);
        if (!passVerification) {
            return res.status(404).json({ message: "Passport verification not found" });
        }
        await passVerification.remove();
        res.status(200).json({ message: "Passport verification deleted successfully" });
    } catch (error) {
        console.error("Error deleting passport verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserPassVerificationById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id; 
        const passVerification = await PassVerification.findOne({ _id: id, user: userId }).populate("user", "name email");
        if (!passVerification) {
            return res.status(404).json({ message: "Passport verification not found" });
        }
        res.status(200).json(passVerification);
    } catch (error) {
        console.error("Error fetching user's passport verification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}