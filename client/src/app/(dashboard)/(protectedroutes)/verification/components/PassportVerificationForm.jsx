"use client";

import { useState } from "react";
import { Calendar, Check, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import FileUploader from "./FileUploader";
import { useForm } from "react-hook-form";

const PassportVerificationForm = ({
  passportFile,
  handlePassportFileChange,
  removePassportFile,
  submitPassportVerification,
  isSubmittingPassport,
  passportSubmitMessage,
  latestPassportVerification,
  hasPendingOrVerifiedPassport,
  isLoadingVerifications,
  formatDate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      passportNumber: "",
      cnic: "",
      fullName: "",
      dob: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    if (!passportFile) {
      // Show error message for missing file
      if (typeof submitPassportVerification === "function") {
        submitPassportVerification(null, true);
      }
      return;
    }

    if (typeof submitPassportVerification === "function") {
      submitPassportVerification(data);
    }
  };

  // Helper function to render verification status
  const renderVerificationStatus = () => {
    if (isLoadingVerifications) {
      return (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasPendingOrVerifiedPassport && latestPassportVerification) {
      const status = latestPassportVerification.status;

      const statusStyles = {
        pending: "bg-amber-50 border-amber-200 text-amber-800",
        verified: "bg-green-50 border-green-200 text-green-800",
        rejected: "bg-red-50 border-red-200 text-red-800",
      };

      const icon =
        status === "pending" ? (
          <AlertCircle className="flex-shrink-0 h-4 w-4 text-amber-600 mt-0.5" />
        ) : status === "verified" ? (
          <Check className="flex-shrink-0 h-4 w-4 text-green-600 mt-0.5" />
        ) : (
          <X className="flex-shrink-0 h-4 w-4 text-red-600 mt-0.5" />
        );

      const title =
        status === "pending"
          ? "Verification In Progress"
          : status === "verified"
          ? "Passport Verified"
          : "Verification Rejected";

      const description =
        status === "pending"
          ? "Your passport verification is being reviewed. This process usually takes 1-3 business days."
          : status === "verified"
          ? "Your passport has been successfully verified."
          : "Your passport verification was rejected. You can submit a new verification request.";

      return (
        <div className="space-y-4">
          <Card className={`mb-4 md:mb-6 border ${statusStyles[status]}`}>
            <CardContent className="p-4 flex items-start gap-2">
              {icon}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          {status !== "rejected" && (
            <Card className="bg-gray-50 border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="text-muted-foreground">Submitted:</div>
                <div>{formatDate(latestPassportVerification.createdAt)}</div>
                <div className="text-muted-foreground">CNIC:</div>
                <div>{latestPassportVerification.passwordCnic}</div>
                <div className="text-muted-foreground">Full Name:</div>
                <div>{latestPassportVerification.fullName}</div>
                <div className="text-muted-foreground">Date of Birth:</div>
                <div>{formatDate(latestPassportVerification.dob)}</div>
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
    }

    return null;
  };

  // Either show the status or the form
  const showForm =
    !hasPendingOrVerifiedPassport ||
    (latestPassportVerification &&
      latestPassportVerification.status === "rejected");

  // Calculate max date for DOB (must be at least 18 years ago)
  const calculateMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      {renderVerificationStatus()}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passportNumber" className="text-sm font-medium">
                Passport Number
              </Label>
              <Input
                id="passportNumber"
                className={`h-10 ${
                  errors.passportNumber ? "border-red-500" : ""
                }`}
                {...register("passportNumber", {
                  required: "Passport number is required",
                  pattern: {
                    value: /^[A-Z0-9]{6,9}$/i,
                    message: "Please enter a valid passport number",
                  },
                })}
                placeholder="Enter your passport number"
              />
              {errors.passportNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.passportNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic" className="text-sm font-medium">
                CNIC Number
              </Label>
              <Input
                id="cnic"
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name (as on passport)
              </Label>{" "}
              <Input
                id="fullName"
                className={`h-10 ${errors.fullName ? "border-red-500" : ""}`}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 14,
                    message: "Full name cannot exceed 14 characters",
                  },
                })}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:order-last">
              <Label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </Label>
              <div className="">
                <Input
                  id="dob"
                  type="date"
                  className={`h-10 input-date-right ${
                    errors.dob ? "border-red-500" : ""
                  }`}
                  {...register("dob", {
                    required: "Date of birth is required",
                    validate: (value) => {
                      const birthDate = new Date(value);
                      const today = new Date();

                      const age = today.getFullYear() - birthDate.getFullYear();

                      // Check if birthday has occurred this year
                      const hasBirthdayOccurred =
                        today.getMonth() > birthDate.getMonth() ||
                        (today.getMonth() === birthDate.getMonth() &&
                          today.getDate() >= birthDate.getDate());

                      const actualAge = hasBirthdayOccurred ? age : age - 1;

                      return (
                        actualAge >= 18 || "You must be at least 18 years old"
                      );
                    },
                  })}
                  max={calculateMaxDate()}
                />
              </div>
              {errors.dob && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>{" "}
          <FileUploader
            label="Passport Photo"
            file={passportFile}
            onChange={handlePassportFileChange}
            onRemove={removePassportFile}
            inputId="passport-upload"
            placeholderText="Drag and drop your passport photo or"
          />
          {passportSubmitMessage && (
            <p
              className={`text-sm ${
                passportSubmitMessage.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {passportSubmitMessage.text}
            </p>
          )}{" "}
          <Button
            type="submit"
            className="w-full h-10 text-base"
            disabled={isSubmittingPassport || Object.keys(errors).length > 0}
          >
            {isSubmittingPassport
              ? "Submitting..."
              : latestPassportVerification?.status === "rejected"
              ? "Submit New Passport Verification"
              : "Submit Passport Verification"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PassportVerificationForm;
