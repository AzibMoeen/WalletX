"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useAuthStore from "@/lib/store/useAuthStore"

import { UserPlus, AlertCircle, Loader2 } from "lucide-react"

// Import shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Register = () => {
  const [serverError, setServerError] = useState("")
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  
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
    // Clear previous errors
    setServerError("")
    clearError()

    try {
      const { confirmPassword, fullName, mobile, ...rest } = data

      const registrationData = {
        fullname: fullName,
        mobile: Number(mobile), // Convert string to number
        ...rest,
      }

      // Use the register method from auth store
      await registerUser(registrationData)
      
      reset()
      // Redirect to login page after successful registration
      router.push("/login")
  
    } catch (error) {
      // The error is already handled by the store, but we can also set a local error
      setServerError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md py-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Join our wallet platform to manage your finances securely</CardDescription>
          </CardHeader>

          <CardContent>
            {(serverError || error) && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError || error}</AlertDescription>
              </Alert>
            )}

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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
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
