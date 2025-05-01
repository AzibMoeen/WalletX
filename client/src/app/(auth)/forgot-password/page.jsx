"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { KeyRound, AlertCircle, Loader2, ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VerificationCodeInput } from "./components/verification"

const ForgotPassword = () => {
  const [resetStep, setResetStep] = useState(1)
  const [resetToken, setResetToken] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [tokenError, setTokenError] = useState("")
  const router = useRouter()
  
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({ mode: "onChange" })
  
  const {
    register: registerPassword,
    handleSubmit: handleSubmitNewPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm({ mode: "onChange" })
  
  const password = watch("newPassword", "")

  const onSubmitEmail = async (data) => {
    setServerError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset email")
      }
      
      setEmail(data.email)
      setSuccessMessage("Reset code sent to your email")
      setResetStep(2)
    } catch (error) {
      setServerError(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  
  const onSubmitNewPassword = async (data) => {
    setServerError("")
    setIsLoading(true)
    setTokenError("")
    
    try {
      const resetTokenString = resetToken.join("")
      
      if (resetTokenString.length !== 6) {
        setTokenError("Please enter the complete reset code")
        setIsLoading(false)
        return
      }
      
      const response = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          resetToken: resetTokenString,
          newPassword: data.newPassword
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password")
      }
      
      setSuccessMessage("Password reset successful")
      
      setTimeout(() => {
        router.push("/login?reset=success")
      }, 2000)
      
    } catch (error) {
      setServerError(error.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResendCode = async () => {
    setServerError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to resend code")
      }
      
      setSuccessMessage("New code sent to your email")
      setResetToken(['', '', '', '', '', ''])
    } catch (error) {
      setServerError(error.message || "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              {resetStep === 1 ? (
                <KeyRound className="h-6 w-6" />
              ) : (
                <LockKeyhole className="h-6 w-6" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {resetStep === 1 ? "Forgot Password" : "Reset Password"}
            </CardTitle>
            <CardDescription>
              {resetStep === 1 
                ? "Enter your email to receive a password reset code" 
                : "Enter the code sent to your email and create a new password"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            
            {successMessage && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    className={emailErrors.email ? "border-red-500" : ""}
                    {...registerEmail("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {emailErrors.email && (
                    <p className="text-xs font-medium text-red-500">{emailErrors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Code...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmitNewPassword(onSubmitNewPassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Reset Code</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Enter the 6-character code sent to {email}
                  </p>
                  <VerificationCodeInput 
                    value={resetToken} 
                    onChange={setResetToken}
                    error={tokenError}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Create a new password"
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                    {...registerPassword("newPassword", {
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
                  {passwordErrors.newPassword && (
                    <p className="text-xs font-medium text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs font-medium text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
                
                <div className="flex justify-between items-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setResetStep(1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-purple-600 font-medium hover:text-purple-800 transition-colors">
                Back to Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword