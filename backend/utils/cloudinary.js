import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary - this is often missing

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: "733524375944365",
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Cloudinary Config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "Not set",
      api_key: process.env.CLOUDINARY_API_KEY ? "Present" : "Not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Present" : "Not set"
    });
    // Check if local file path exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File does not exist at path: ${localFilePath}`);
    }
    
    console.log("Attempting to upload file from path:", localFilePath);
    
    // Upload file on cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "wallet-verifications" // Optional: organize uploads in a folder
    });
    
    console.log("File uploaded successfully to Cloudinary:", result.url);
    
    // Remove the locally saved file as the upload operation got successful
    fs.unlinkSync(localFilePath);
    
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    
    // Attempt to remove the locally saved file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return null;
  }
};