import { Calendar, Check, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUploader from "./FileUploader"
import { useForm } from "react-hook-form"

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
  formatDate
}) => {
  // Initialize React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      licenseNumber: "",
      cnic: "",
      issueDate: "",
      expiryDate: ""
    },
    mode: "onChange"
  });

  // Get today's date for validation
  const today = new Date().toISOString().split('T')[0];
  
  // Watch form values for validation
  const issueDate = watch("issueDate");

  // Handle form submission
  const onSubmit = (data) => {
    if (!gunLicenseFile) {
      // Show error message for missing file
      if (typeof submitGunVerification === 'function') {
        submitGunVerification(null, true); // Pass a flag to indicate missing file
      }
      return;
    }
    
    // Call the parent submit handler with form data
    if (typeof submitGunVerification === 'function') {
      submitGunVerification(data);
    }
  };

  // Helper function to render verification status
  const renderVerificationStatus = () => {
    if (isLoadingVerifications) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasPendingOrVerifiedGun && latestGunVerification) {
      return (
        <div className="space-y-4">
          <Alert className={`${
            latestGunVerification.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
            latestGunVerification.status === 'verified' ? 'bg-green-50 border-green-200 text-green-800' : 
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-2">
              {latestGunVerification.status === 'pending' ? (
                <div className="h-5 w-5 mt-0.5 text-amber-600"><AlertCircle className="h-5 w-5" /></div>
              ) : latestGunVerification.status === 'verified' ? (
                <div className="h-5 w-5 mt-0.5 text-green-600"><Check className="h-5 w-5" /></div>
              ) : (
                <div className="h-5 w-5 mt-0.5 text-red-600"><X className="h-5 w-5" /></div>
              )}
              <div>
                <AlertTitle className="text-base">
                  {latestGunVerification.status === 'pending' ? 'Verification In Progress' : 
                   latestGunVerification.status === 'verified' ? 'Gun License Verified' : 
                   'Verification Rejected'}
                </AlertTitle>
                <AlertDescription>
                  {latestGunVerification.status === 'pending' && 'Your gun license verification is being reviewed. This process usually takes 1-3 business days.'}
                  {latestGunVerification.status === 'verified' && 'Your gun license has been successfully verified.'}
                  {latestGunVerification.status === 'rejected' && 'Your gun license verification was rejected. You can submit a new verification request.'}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {latestGunVerification.status !== 'rejected' && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">Verification Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
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
                <div className={`font-medium ${
                  latestGunVerification.status === 'pending' ? 'text-amber-600' : 
                  latestGunVerification.status === 'verified' ? 'text-green-600' : 
                  'text-red-600'
                }`}>
                  {latestGunVerification.status.charAt(0).toUpperCase() + latestGunVerification.status.slice(1)}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Either show the status or the form
  const showForm = !hasPendingOrVerifiedGun || 
                  (latestGunVerification && latestGunVerification.status === 'rejected');

  return (
    <div className="space-y-6">
      {renderVerificationStatus()}
      
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-base">
                Gun License Number
              </Label>
              <Input 
                id="licenseNumber" 
                className={`h-11 ${errors.licenseNumber ? "border-red-500" : ""}`}
                {...register("licenseNumber", {
                  required: "License number is required",
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "Please enter a valid license number"
                  }
                })}
                placeholder="Enter your license number" 
              />
              {errors.licenseNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic" className="text-base">
                CNIC Number
              </Label>
              <Input 
                id="cnic" 
                className={`h-11 ${errors.cnic ? "border-red-500" : ""}`}
                {...register("cnic", {
                  required: "CNIC number is required",
                  pattern: {
                    value: /^\d{5}-\d{7}-\d{1}$/,
                    message: "Please enter a valid CNIC number format (e.g., 12345-1234567-1)"
                  }
                })}
                placeholder="e.g., 12345-1234567-1" 
              />
              {errors.cnic && (
                <p className="text-xs text-red-500 mt-1">{errors.cnic.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="text-base">
                Issue Date
              </Label>
              <div className="relative">
                <Input 
                  id="issueDate" 
                  type="date" 
                  className={`h-11 ${errors.issueDate ? "border-red-500" : ""}`}
                  {...register("issueDate", {
                    required: "Issue date is required",
                    validate: value => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return selectedDate <= today || "Issue date cannot be in the future";
                    }
                  })}
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
              {errors.issueDate && (
                <p className="text-xs text-red-500 mt-1">{errors.issueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-base">
                Expiry Date
              </Label>
              <div className="relative">
                <Input 
                  id="expiryDate" 
                  type="date" 
                  className={`h-11 ${errors.expiryDate ? "border-red-500" : ""}`}
                  {...register("expiryDate", {
                    required: "Expiry date is required",
                    validate: value => {
                      // Check that expiry date is after issue date
                      if (issueDate) {
                        return new Date(value) > new Date(issueDate) || 
                               "Expiry date must be after issue date";
                      }
                      return true;
                    }
                  })}
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
              {errors.expiryDate && (
                <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>
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
            <p className="text-xs text-red-500 mt-1">License photo is required</p>
          )}

          {gunSubmitMessage && (
            <p
              className={`text-sm ${
                gunSubmitMessage.type === 'error' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {gunSubmitMessage.text}
            </p>
          )}
          
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isSubmittingGun || !gunLicenseFile || Object.keys(errors).length > 0}
          >
            {isSubmittingGun ? 'Submitting...' : 
             latestGunVerification?.status === 'rejected' ? 
             'Submit New Gun License Verification' : 'Submit Gun License Verification'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default GunLicenseVerificationForm;