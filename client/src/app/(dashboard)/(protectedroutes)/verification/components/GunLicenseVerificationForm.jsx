"use client";

import { Calendar, Check, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FileUploader from "./FileUploader";
import { useForm } from "react-hook-form";

const GunLicenseVerificationForm = ({
  gunLicenseFile,
  handleGunLicenseFileChange,
  removeGunLicenseFile,
  submitGunVerification,
  isSubmittingGun,
  gunSubmitMessage,
  latestGunVerification,
  hasPendingOrVerifiedGun,
  isLoadingVerifications,
  formatDate,
}) => {
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      licenseNumber: "",
      cnic: "",
      issueDate: "",
      expiryDate: "",
    },
    mode: "onChange",
  });

  // Get today's date for validation
  const today = new Date().toISOString().split("T")[0];

  // Watch form values for validation
  const issueDate = watch("issueDate");

  // Handle form submission
  const onSubmit = (data) => {
    if (!gunLicenseFile) {
      // Show error message for missing file
      if (typeof submitGunVerification === "function") {
        submitGunVerification(null, true); // Pass a flag to indicate missing file
      }
      return;
    }

    // Call the parent submit handler with form data
    if (typeof submitGunVerification === "function") {
      submitGunVerification(data);
    }
  };

  // Helper function to render verification status
  const renderVerificationStatus = () => {
    if (isLoadingVerifications) {
      return (
        <div className="">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasPendingOrVerifiedGun && latestGunVerification) {
      const { status } = latestGunVerification;

      const statusConfig = {
        pending: {
          icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          title: "Verification In Progress",
          message:
            "Your gun license verification is being reviewed. This process usually takes 1-3 business days.",
        },
        verified: {
          icon: <Check className="h-5 w-5 text-green-600" />,
          bg: "bg-green-50 border-green-200 text-green-800",
          title: "Gun License Verified",
          message: "Your gun license has been successfully verified.",
        },
        rejected: {
          icon: <X className="h-5 w-5 text-red-600" />,
          bg: "bg-red-50 border-red-200 text-red-800",
          title: "Verification Rejected",
          message:
            "Your gun license verification was rejected. You can submit a new verification request.",
        },
      };

      const config = statusConfig[status];

      return (
        <div className="space-y-4">
          <Card className={`w-full ${config.bg}`}>
            <CardHeader className="flex flex-row gap-2 items-start p-4">
              <div className="mt-1">{config.icon}</div>
              <div>
                <div className="text-base font-medium">{config.title}</div>
                <div>{config.message}</div>
              </div>
            </CardHeader>
          </Card>

          {status !== "rejected" && (
            <Card className="w-full bg-gray-50 border border-gray-100">
              <CardHeader>
                <h3 className="font-medium text-sm">Verification Details</h3>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="text-muted-foreground">Submitted:</div>
                <div>{formatDate(latestGunVerification.createdAt)}</div>
                <div className="text-muted-foreground">License Number:</div>
                <div>{latestGunVerification.licenseNumber}</div>
                <div className="text-muted-foreground">CNIC:</div>
                <div>{latestGunVerification.cnic}</div>
                <div className="text-muted-foreground">Issue Date:</div>
                <div>{formatDate(latestGunVerification.issueDate)}</div>
                <div className="text-muted-foreground">Expiry Date:</div>
                <div>{formatDate(latestGunVerification.expiryDate)}</div>
                <div className="text-muted-foreground">Status:</div>
                <div
                  className={`font-medium ${
                    status === "pending"
                      ? "text-amber-600"
                      : status === "verified"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    } else return null;
  };
  const showForm =
    !hasPendingOrVerifiedGun ||
    (latestGunVerification && latestGunVerification.status === "rejected");

  return (
    <div className="w-full space-y-6">
      {renderVerificationStatus()}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="w-full grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-sm font-medium">
                Gun License Number
              </Label>
              <Input
                id="licenseNumber"
                className={`h-10 ${
                  errors.licenseNumber ? "border-red-500" : ""
                }`}
                {...register("licenseNumber", {
                  required: "License number is required",
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "Please enter a valid license number",
                  },
                })}
                placeholder="Enter your license number"
              />
              {errors.licenseNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gunCnic" className="text-sm font-medium">
                CNIC Number
              </Label>
              <Input
                id="gunCnic"
                className={`h-10 ${errors.cnic ? "border-red-500" : ""}`}
                {...register("cnic", {
                  required: "CNIC number is required",
                  pattern: {
                    value: /^\d{5}-\d{7}-\d{1}$/,
                    message:
                      "Please enter a valid CNIC number format (e.g., 12345-1234567-1)",
                  },
                })}
                placeholder="e.g., 12345-1234567-1"
              />
              {errors.cnic && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.cnic.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="text-sm font-medium">
                Issue Date
              </Label>
              <div className="relative">
                <Input
                  id="issueDate"
                  type="date"
                  className={`h-10 input-date-right ${
                    errors.dob ? "border-red-500" : ""
                  }`}
                  {...register("issueDate", {
                    required: "Issue date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return (
                        selectedDate <= today ||
                        "Issue date cannot be in the future"
                      );
                    },
                  })}
                />
              </div>
              {errors.issueDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.issueDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date
              </Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  type="date"
                  className={`h-10 input-date-right ${
                    errors.dob ? "border-red-500" : ""
                  }`}
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                    validate: (value) => {
                      // Check that expiry date is after issue date
                      if (issueDate) {
                        return (
                          new Date(value) > new Date(issueDate) ||
                          "Expiry date must be after issue date"
                        );
                      }
                      return true;
                    },
                  })}
                />
              </div>
              {errors.expiryDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.expiryDate.message}
                </p>
              )}
            </div>
          </div>

          <FileUploader
            label="Gun License Photo"
            file={gunLicenseFile}
            onChange={handleGunLicenseFileChange}
            onRemove={removeGunLicenseFile}
            inputId="license-upload"
            placeholderText="Drag and drop your license photo or"
          />

          {!gunLicenseFile && (
            <p className="text-xs text-red-500 mt-1">
              License photo is required
            </p>
          )}

          {gunSubmitMessage && (
            <p
              className={`text-sm ${
                gunSubmitMessage.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {gunSubmitMessage.text}
            </p>
          )}
          <Button
            type="submit"
            className="cursor-pointer w-full h-10 text-base"
            disabled={
              isSubmittingGun ||
              !gunLicenseFile ||
              Object.keys(errors).length > 0
            }
          >
            {isSubmittingGun
              ? "Submitting..."
              : latestGunVerification?.status === "rejected"
              ? "Submit New Gun License Verification"
              : "Submit Gun License Verification"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default GunLicenseVerificationForm;
