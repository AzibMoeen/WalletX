"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "@/lib/store/useAuthStore";
import { API_BASE_URL as API_URL } from "@/lib/config";

// Import profile components
import ProfilePictureSection from "@/components/profile/ProfilePictureSection";
import PasswordForm from "@/components/profile/PasswordForm";
import VerificationStatusCard from "@/components/profile/VerificationStatusCard";

// Import UI components
import { Loader2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const {
    register: registerGeneral,
    handleSubmit: handleSubmitGeneral,
    formState: { errors: generalErrors },
    setValue: setGeneralValue,
    reset: resetGeneral,
  } = useForm({
    defaultValues: {
      fullname: user?.fullname || "",
      mobile: user?.mobile || "",
    },
  });

  // Set initial form values when user data is available
  useEffect(() => {
    if (user) {
      setGeneralValue("fullname", user.fullname);
      setGeneralValue("mobile", user.mobile);
    }
  }, [user, setGeneralValue]);

  const onUpdateGeneral = async (data) => {
    setIsLoading(true);
    setUpdateError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/profile/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      // Update the user data in the store
      setUser(result.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      setUpdateError(error.message || "Profile update failed");
      toast.error(error.message || "Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      {/* Verification Status Card Component */}
      <VerificationStatusCard user={user} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section Component */}
              <ProfilePictureSection user={user} setUser={setUser} />

              <Separator />

              {/* Profile Form */}
              <form
                onSubmit={handleSubmitGeneral(onUpdateGeneral)}
                className="space-y-4"
              >
                {updateError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{updateError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      {...registerGeneral("fullname", {
                        required: "Name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                      placeholder="Your full name"
                    />
                    {generalErrors.fullname && (
                      <p className="text-sm text-red-500">
                        {generalErrors.fullname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      {...registerGeneral("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Invalid mobile number format",
                        },
                      })}
                      placeholder="Your mobile number"
                    />
                    {generalErrors.mobile && (
                      <p className="text-sm text-red-500">
                        {generalErrors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Password Form Component */}
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
