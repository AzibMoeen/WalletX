"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@/lib/store/useAuthStore"

import { UserPlus, AlertCircle, Loader2, ArrowLeft, Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Create a VerificationCodeInput component for 4-digit code entry
const VerificationCodeInput = ({ onChange, value = ['', '', '', ''], error }) => {
  const inputRefs = Array(4).fill(0).map(() => useState(null)[0]);

  const handleChange = (index, e) => {
    const newValue = [...value];
    newValue[index] = e.target.value;
    onChange(newValue);

    // Auto-focus next input after entry
    if (e.target.value && index < 3) {
      inputRefs[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate back on backspace if current field is empty
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // If we have exactly 4 digits, fill all inputs
    if (/^\d{4}$/.test(pastedData)) {
      const newValue = pastedData.split('');
      onChange(newValue);
      inputRefs[3].focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        {value.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => (inputRefs[index] = el)}
            className={`w-14 h-14 text-center text-xl font-semibold border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ))}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

const Register = () => {
  const [serverError, setServerError] = useState("")
  const [registrationStep, setRegistrationStep] = useState(1) // Step 1: Form, Step 2: Verification
  const [verificationCode, setVerificationCode] = useState(['', '', '', ''])
  const [verificationError, setVerificationError] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [userData, setUserData] = useState(null)
  const [email, setEmail] = useState("")
  
  const router = useRouter()
  const { isLoading, error, clearError, isAuthenticated } = useAuthStore()
  
  // Handle authenticated user redirect with useEffect
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/wallet")
    }
  }, [isAuthenticated, router])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ mode: "onChange" })

  const password = watch("password")

  const onSubmit = async (data) => {
    setServerError("")
    clearError()

    try {
      const { confirmPassword, fullName, mobile, ...rest } = data

      const registrationData = {
        fullname: fullName,
        mobile: Number(mobile), 
        ...rest,
      }

      // Save registration data to state
      setUserData(registrationData)
      setEmail(rest.email)
      
      // Send verification email
      const response = await fetch("http://localhost:8000/api/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to send verification email")
      }
      
      setRegistrationStep(2)
  
    } catch (error) {
      setServerError(error.message || "An error occurred")
    }
  }
  
  const handleVerifyCode = async () => {
    setVerificationError("")
    
    // Check if code is complete
    const code = verificationCode.join("")
    
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      setVerificationError("Please enter a valid 4-digit code")
      return
    }
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/verify-and-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationCode: code
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Verification failed")
      }
      
      // Registration successful
      reset()
      router.push("/login?verified=true")
      
    } catch (error) {
      setVerificationError(error.message || "Verification failed")
    }
  }
  
  const handleResendCode = async () => {
    setIsResending(true)
    setVerificationError("")
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to resend verification code")
      }
      
      // Reset verification code fields
      setVerificationCode(['', '', '', ''])
      
    } catch (error) {
      setVerificationError(error.message || "Failed to resend verification code")
    } finally {
      setIsResending(false)
    }
  }

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
              {registrationStep === 1 ? "Create an Account" : "Verify Your Email"}
            </CardTitle>
            <CardDescription>
              {registrationStep === 1 
                ? "Join our wallet platform to manage your finances securely" 
                : `We've sent a verification code to ${email}`
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            {(serverError || error) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError || error}</AlertDescription>
              </Alert>
            )}

            {registrationStep === 1 ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-red-500" : ""}
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: { value: 3, message: "Name must be at least 3 characters" },
                    })}
                  />
                  {errors.fullName && <p className="text-xs font-medium text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="Enter your mobile number"
                    className={errors.mobile ? "border-red-500" : ""}
                    {...register("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid mobile number",
                      },
                    })}
                  />
                  {errors.mobile && <p className="text-xs font-medium text-red-500">{errors.mobile.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className={errors.password ? "border-red-500" : ""}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Password must contain uppercase, lowercase, number & special character",
                      },
                    })}
                  />
                  {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">
                    Enter the 4-digit verification code sent to your email
                  </p>
                  
                  <VerificationCodeInput 
                    value={verificationCode} 
                    onChange={setVerificationCode}
                    error={verificationError}
                  />
                </div>
                
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Verify and Create Account
                      </>
                    )}
                  </Button>
                  
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setRegistrationStep(1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register
