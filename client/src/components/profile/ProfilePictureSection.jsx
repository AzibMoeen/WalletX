"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL as API_URL } from "@/lib/config";
import { toast } from "sonner";

const ProfilePictureSection = ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const renderUserInitials = () => {
    if (!user || !user.fullname) return "U";
    const names = user.fullname.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUploadError("");

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async () => {
    if (!avatarFile) return;

    setIsLoading(true);
    setUploadError("");

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("profilePicture", avatarFile);

      const response = await fetch(
        `${API_URL}/api/auth/profile/update-picture`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile picture");
      }

      // Update the user data in the store
      setUser(result.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile picture update error:", error);
      setUploadError(error.message || "Profile picture update failed");
      toast.error(error.message || "Profile picture update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelImageUpload = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setUploadError("");
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative">
        {avatarPreview ? (
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src={avatarPreview}
              alt="Profile Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Avatar className="h-28 w-28">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {renderUserInitials()}
            </AvatarFallback>
          </Avatar>
        )}

        {!avatarPreview && (
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera className="h-4 w-4" />
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
        )}
      </div>

      <div className="flex-1">
        {avatarPreview ? (
          <>
            <h3 className="font-medium mb-2">Upload New Picture</h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={uploadProfilePicture}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelImageUpload}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-medium mb-1">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. 5MB max.
            </p>
          </>
        )}
        {uploadError && (
          <p className="text-sm text-red-500 mt-2">{uploadError}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureSection;
