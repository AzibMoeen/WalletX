"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/useAuthStore";

import { UserPlus, Mail, AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import our new components
import RegistrationForm from "@/components/auth/RegistrationForm";
import VerificationForm from "@/components/auth/VerificationForm";

const Register = () => {
  // Local state
  const [registrationStep, setRegistrationStep] = useState(1); // Step 1: Form, Step 2: Verification
  const [isResending, setIsResending] = useState(false);
  const [userData, setUserData] = useState(null);
  const [verificationError, setVerificationError] = useState("");

  // Get auth store data and methods
  const {
    isLoading,
    error,
    clearError,
    isAuthenticated,
    sendVerificationEmail,
    verifyAndRegister,
    verificationEmail,
  } = useAuthStore();

  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/wallet");
    }
  }, [isAuthenticated, router]);

  // Reset any errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle registration form submission
  const handleRegistrationSubmit = async (formData) => {
    try {
      setUserData(formData);
      await sendVerificationEmail(formData);
      setRegistrationStep(2);
    } catch (error) {
      // Error handling is done in the store
      console.error("Registration error:", error);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (code) => {
    setVerificationError("");

    // Check if code is complete
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      setVerificationError("Please enter a valid 4-digit code");
      return;
    }

    try {
      await verifyAndRegister({
        email: verificationEmail,
        verificationCode: code,
      });

      // Registration successful
      router.push("/login?verified=true");
    } catch (error) {
      setVerificationError(error.message || "Verification failed");
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    setIsResending(true);
    setVerificationError("");

    try {
      await sendVerificationEmail(userData);
    } catch (error) {
      setVerificationError(
        error.message || "Failed to resend verification code"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md py-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              {registrationStep === 1 ? (
                <UserPlus className="h-6 w-6" />
              ) : (
                <Mail className="h-6 w-6" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {registrationStep === 1
                ? "Create an Account"
                : "Verify Your Email"}
            </CardTitle>
            <CardDescription>
              {registrationStep === 1
                ? "Join our wallet platform to manage your finances securely"
                : `We've sent a verification code to ${verificationEmail}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {registrationStep === 1 ? (
              <RegistrationForm
                onSubmit={handleRegistrationSubmit}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <VerificationForm
                email={verificationEmail}
                onVerify={handleVerifyCode}
                onResend={handleResendCode}
                onBack={() => setRegistrationStep(1)}
                isLoading={isLoading}
                isResending={isResending}
                verificationError={verificationError}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
