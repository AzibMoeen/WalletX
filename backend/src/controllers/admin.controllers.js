import { User } from "../models/user.model.js";
import { PassVerification } from "../models/passportverification.model.js";
import { GunVerification } from "../models/gunverification.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";

export async function getAllUsers(req, res) {
  try {
    const { search, sortBy, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOptions = { createdAt: -1 }; 
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    return res.status(200).json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }
    
    await PassVerification.deleteMany({ user: userId });
    await GunVerification.deleteMany({ user: userId });
    
    await User.findByIdAndDelete(userId);
    
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
}

export async function getPassportVerifications(req, res) {
  try {
    const { status, search, sortBy, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    const verifications = await PassVerification.find(query)
      .populate('user', 'fullname email mobile')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    let filteredVerifications = verifications;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVerifications = verifications.filter(verification => 
        verification.user.fullname.toLowerCase().includes(searchLower) ||
        verification.user.email.toLowerCase().includes(searchLower) ||
        verification.user.mobile.toLowerCase().includes(searchLower)
      );
    }
    
    // Get total count for pagination
    const total = await PassVerification.countDocuments(query);
    
    return res.status(200).json({
      verifications: filteredVerifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching passport verifications:", error);
    return res.status(500).json({ message: "Failed to fetch passport verifications" });
  }
}

export async function getGunVerifications(req, res) {
  try {
    const { status, search, sortBy, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOptions = { createdAt: -1 }; // Default sort by creation date (newest first)
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    // Execute the query with population of user details
    const verifications = await GunVerification.find(query)
      .populate('user', 'fullname email mobile')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    let filteredVerifications = verifications;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVerifications = verifications.filter(verification => 
        verification.user.fullname.toLowerCase().includes(searchLower) ||
        verification.user.email.toLowerCase().includes(searchLower) ||
        verification.user.mobile.toLowerCase().includes(searchLower)
      );
    }
    
    const total = await GunVerification.countDocuments(query);
    
    return res.status(200).json({
      verifications: filteredVerifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching gun verifications:", error);
    return res.status(500).json({ message: "Failed to fetch gun verifications" });
  }
}

export async function updatePassportVerificationStatus(req, res) {
  try {
    const { verificationId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const verification = await PassVerification.findById(verificationId);
    
    if (!verification) {
      return res.status(404).json({ message: "Verification request not found" });
    }
    
    verification.status = status;
    await verification.save();
    
    if (status === 'verified') {
      // Check if user has a verified gun verification as well
      const gunVerification = await GunVerification.findOne({
        user: verification.user,
        status: 'verified'
      });
      
      // Only set user as verified if both verifications are approved
      if (gunVerification) {
        await User.findByIdAndUpdate(verification.user, { 
          verified: true 
        });
      }
    }
    
    return res.status(200).json({ 
      message: `Verification ${status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`,
      verification
    });
  } catch (error) {
    console.error("Error updating passport verification status:", error);
    return res.status(500).json({ message: "Failed to update verification status" });
  }
}

export async function updateGunVerificationStatus(req, res) {
  try {
    const { verificationId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const verification = await GunVerification.findById(verificationId);
    
    if (!verification) {
      return res.status(404).json({ message: "Verification request not found" });
    }
    
    verification.status = status;
    await verification.save();
    
    if (status === 'verified') {
      const passportVerification = await PassVerification.findOne({
        user: verification.user,
        status: 'verified'
      });
      
      if (passportVerification) {
        await User.findByIdAndUpdate(verification.user, { 
          verified: true 
        });
      }
    }
    
    return res.status(200).json({ 
      message: `Verification ${status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`,
      verification
    });
  } catch (error) {
    console.error("Error updating gun verification status:", error);
    return res.status(500).json({ message: "Failed to update verification status" });
  }
}

export async function getDashboardStats(req, res) {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get pending verifications count
    const pendingPassportVerifications = await PassVerification.countDocuments({ status: 'pending' });
    const pendingGunVerifications = await GunVerification.countDocuments({ status: 'pending' });
    const pendingVerifications = pendingPassportVerifications + pendingGunVerifications;
    
    // Get verified users count
    const verifiedUsers = await User.countDocuments({ verified: true });
    
    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    // Get recent verification requests (5 most recent)
    const recentPassportVerifications = await PassVerification.find()
      .populate('user', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentGunVerifications = await GunVerification.find()
      .populate('user', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Combine and sort by date
    const recentVerifications = [...recentPassportVerifications, ...recentGunVerifications]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(verification => ({
        id: verification._id,
        type: verification.constructor.modelName === 'PassVerification' ? 'passport' : 'gun',
        user: verification.user,
        status: verification.status,
        createdAt: verification.createdAt
      }));
    
    return res.status(200).json({
      stats: {
        totalUsers,
        pendingVerifications,
        verifiedUsers,
        newUsers
      },
      recentActivity: recentVerifications
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
}

// Submit passport verification
export async function submitPassportVerification(req, res) {
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
        
        // Check if user already has a passport verification request that is pending or verified
        const existingVerification = await PassVerification.findOne({ 
            user: userId,
            status: { $in: ['pending', 'verified'] }
        });
        
        if (existingVerification) {
            if (existingVerification.status === 'pending') {
                return res.status(400).json({ 
                    message: "You already have a pending passport verification request.",
                    status: "pending",
                    verification: existingVerification
                });
            } else if (existingVerification.status === 'verified') {
                return res.status(400).json({ 
                    message: "Your passport is already verified.",
                    status: "verified",
                    verification: existingVerification
                });
            }
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

// Submit gun license verification
export async function submitGunVerification(req, res) {
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
        
        // Check if user already has a gun verification request that is pending or verified
        const existingVerification = await GunVerification.findOne({ 
            user: userId,
            status: { $in: ['pending', 'verified'] }
        });
        
        if (existingVerification) {
            if (existingVerification.status === 'pending') {
                return res.status(400).json({ 
                    message: "You already have a pending gun license verification request.",
                    status: "pending",
                    verification: existingVerification
                });
            } else if (existingVerification.status === 'verified') {
                return res.status(400).json({ 
                    message: "Your gun license is already verified.",
                    status: "verified",
                    verification: existingVerification
                });
            }
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

// Get user's passport verification requests
export async function getUserPassportVerifications(req, res) {
    try {
        const userId = req.user._id;
        const verifications = await PassVerification.find({ user: userId })
            .sort({ createdAt: -1 });
            
        res.status(200).json({ verifications });
    } catch (error) {
        console.error("Error fetching user's passport verifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserGunVerifications(req, res) {
    try {
        const userId = req.user._id;
        const verifications = await GunVerification.find({ user: userId })
            .sort({ createdAt: -1 });
            
        res.status(200).json({ verifications });
    } catch (error) {
        console.error("Error fetching user's gun verifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deletePassportVerification(req, res) {
    try {
        const { id } = req.params;
        const passVerification = await PassVerification.findById(id);
        if (!passVerification) {
            return res.status(404).json({ message: "Passport verification not found" });
        }
        await PassVerification.deleteOne({ _id: id });
        res.status(200).json({ message: "Passport verification deleted successfully" });
    } catch (error) {
        console.error("Error deleting passport verification:", error);
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