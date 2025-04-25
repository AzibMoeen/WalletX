import { useState } from "react"
import { Calendar, Check, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUploader from "./FileUploader"

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
  formatDate
}) => {
  // Helper function to render verification status
  const renderVerificationStatus = () => {
    if (isLoadingVerifications) {
      return (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasPendingOrVerifiedPassport && latestPassportVerification) {
      return (
        <div className="space-y-4">
          <Alert className={`${
            latestPassportVerification.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
            latestPassportVerification.status === 'verified' ? 'bg-green-50 border-green-200 text-green-800' : 
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-2">
              {latestPassportVerification.status === 'pending' ? (
                <div className="h-5 w-5 mt-0.5 text-amber-600"><AlertCircle className="h-5 w-5" /></div>
              ) : latestPassportVerification.status === 'verified' ? (
                <div className="h-5 w-5 mt-0.5 text-green-600"><Check className="h-5 w-5" /></div>
              ) : (
                <div className="h-5 w-5 mt-0.5 text-red-600"><X className="h-5 w-5" /></div>
              )}
              <div>
                <AlertTitle className="text-base">
                  {latestPassportVerification.status === 'pending' ? 'Verification In Progress' : 
                   latestPassportVerification.status === 'verified' ? 'Passport Verified' : 
                   'Verification Rejected'}
                </AlertTitle>
                <AlertDescription>
                  {latestPassportVerification.status === 'pending' && 'Your passport verification is being reviewed. This process usually takes 1-3 business days.'}
                  {latestPassportVerification.status === 'verified' && 'Your passport has been successfully verified.'}
                  {latestPassportVerification.status === 'rejected' && 'Your passport verification was rejected. You can submit a new verification request.'}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {latestPassportVerification.status !== 'rejected' && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">Verification Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Submitted:</div>
                <div>{formatDate(latestPassportVerification.createdAt)}</div>
                <div className="text-muted-foreground">CNIC:</div>
                <div>{latestPassportVerification.passwordCnic}</div>
                <div className="text-muted-foreground">Full Name:</div>
                <div>{latestPassportVerification.fullName}</div>
                <div className="text-muted-foreground">Date of Birth:</div>
                <div>{formatDate(latestPassportVerification.dob)}</div>
                <div className="text-muted-foreground">Status:</div>
                <div className={`font-medium ${
                  latestPassportVerification.status === 'pending' ? 'text-amber-600' : 
                  latestPassportVerification.status === 'verified' ? 'text-green-600' : 
                  'text-red-600'
                }`}>
                  {latestPassportVerification.status.charAt(0).toUpperCase() + latestPassportVerification.status.slice(1)}
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
  const showForm = !hasPendingOrVerifiedPassport || 
                   (latestPassportVerification && latestPassportVerification.status === 'rejected');

  return (
    <div className="space-y-6">
      {renderVerificationStatus()}
      
      {showForm && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="passport-number" className="text-base">
                Passport Number
              </Label>
              <Input id="passport-number" placeholder="Enter your passport number" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic" className="text-base">
                CNIC Number
              </Label>
              <Input id="cnic" placeholder="e.g., 12345-1234567-1" className="h-11" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-base">
                Full Name (as on passport)
              </Label>
              <Input id="full-name" placeholder="Enter your full name" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-base">
                Date of Birth
              </Label>
              <div className="relative">
                <Input id="dob" type="date" className="h-11" />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

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
                passportSubmitMessage.type === 'error' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {passportSubmitMessage.text}
            </p>
          )}
          
          <Button
            className="w-full h-11 text-base"
            onClick={submitPassportVerification}
            disabled={isSubmittingPassport}
          >
            {isSubmittingPassport ? 'Submitting...' : 
             latestPassportVerification?.status === 'rejected' ? 
             'Submit New Passport Verification' : 'Submit Passport Verification'}
          </Button>
        </>
      )}
    </div>
  );
};

export default PassportVerificationForm;