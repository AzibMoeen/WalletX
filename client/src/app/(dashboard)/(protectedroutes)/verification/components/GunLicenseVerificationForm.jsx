import { Calendar, Check, AlertCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FileUploader from "./FileUploader"

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
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="license-number" className="text-base">
                Gun License Number
              </Label>
              <Input id="license-number" placeholder="Enter your license number" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic-gun" className="text-base">
                CNIC Number
              </Label>
              <Input id="cnic-gun" placeholder="e.g., 12345-1234567-1" className="h-11" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issue-date" className="text-base">
                Issue Date
              </Label>
              <div className="relative">
                <Input id="issue-date" type="date" className="h-11" />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-date" className="text-base">
                Expiry Date
              </Label>
              <div className="relative">
                <Input id="expiry-date" type="date" className="h-11" />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
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
            className="w-full h-11 text-base"
            onClick={submitGunVerification}
            disabled={isSubmittingGun}
          >
            {isSubmittingGun ? 'Submitting...' : 
             latestGunVerification?.status === 'rejected' ? 
             'Submit New Gun License Verification' : 'Submit Gun License Verification'}
          </Button>
        </>
      )}
    </div>
  );
};

export default GunLicenseVerificationForm;