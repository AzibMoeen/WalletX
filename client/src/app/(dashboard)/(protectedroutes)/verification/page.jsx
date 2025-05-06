"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import useVerificationStore from "@/lib/store/useVerificationStore";
import useAuthStore from "@/lib/store/useAuthStore";

import VerificationStatus from "./components/VerificationStatus";
import PassportVerificationForm from "./components/PassportVerificationForm";
import GunLicenseVerificationForm from "./components/GunLicenseVerificationForm";
import VerificationGuidelines from "./components/VerificationGuidelines";
import VerificationBenefits from "./components/VerificationBenefits";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("passport");
  const [passportFile, setPassportFile] = useState(null);
  const [gunLicenseFile, setGunLicenseFile] = useState(null);
  const [passportSubmitMessage, setPassportSubmitMessage] = useState(null);
  const [gunSubmitMessage, setGunSubmitMessage] = useState(null);
  
  const { user, isLoading: authLoading } = useAuthStore();
  const isUserVerified = user?.verified === true;
  
  const { 
    passportVerifications, 
    gunVerifications, 
    isLoading, 
    error, 
    fetchPassportVerifications, 
    fetchGunVerifications,
    fetchAllVerifications,
    submitPassportVerification,
    submitGunVerification,
    clearError
  } = useVerificationStore();

  useEffect(() => {
    // Fetch both passport and gun license verifications
    fetchAllVerifications();
  }, [fetchAllVerifications]);

  const hasPendingOrVerifiedPassport = passportVerifications.some(
    v => v.status === 'pending' || v.status === 'verified'
  );
  
  const hasPendingOrVerifiedGun = gunVerifications.some(
    v => v.status === 'pending' || v.status === 'verified'
  );
  
  const latestPassportVerification = passportVerifications.length > 0 ? passportVerifications[0] : null;
  const latestGunVerification = gunVerifications.length > 0 ? gunVerifications[0] : null;

  const handlePassportFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPassportFile(e.target.files[0]);
    }
  };

  const handleGunLicenseFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGunLicenseFile(e.target.files[0]);
    }
  };

  const removePassportFile = () => {
    setPassportFile(null);
  };

  const removeGunLicenseFile = () => {
    setGunLicenseFile(null);
  };

  const handlePassportSubmission = async () => {
    if (!passportFile) {
      setPassportSubmitMessage({ type: 'error', text: 'Passport image is required' });
      return;
    }

    try {
      setPassportSubmitMessage(null);
      clearError();
      
      const formData = new FormData();
      formData.append('passportImage', passportFile);
      formData.append('passportNumber', document.getElementById('passportNumber').value);
      formData.append('passwordCnic', document.getElementById('cnic').value);
      formData.append('fullName', document.getElementById('fullName').value);
      formData.append('dob', document.getElementById('dob').value);
      
      await submitPassportVerification(formData);
      setPassportSubmitMessage({ type: 'success', text: 'Passport verification submitted successfully' });
      setPassportFile(null);
    } catch (error) {
      console.error('Error submitting passport verification:', error);
      setPassportSubmitMessage({ type: 'error', text: error.message || 'Failed to submit verification' });
    }
  };

  const handleGunSubmission = async () => {
    if (!gunLicenseFile) {
      setGunSubmitMessage({ type: 'error', text: 'Gun license image is required' });
      return;
    }

    try {
      setGunSubmitMessage(null);
      clearError();
      
      const formData = new FormData();
      formData.append('gunImage', gunLicenseFile);
      formData.append('licenseNumber', document.getElementById('licenseNumber').value);
      formData.append('cnic', document.getElementById('cnic').value);
      formData.append('issueDate', document.getElementById('issueDate').value);
      formData.append('expiryDate', document.getElementById('expiryDate').value);
      
      await submitGunVerification(formData);
      setGunSubmitMessage({ type: 'success', text: 'Gun license verification submitted successfully' });
      setGunLicenseFile(null);
    } catch (error) {
      console.error('Error submitting gun verification:', error);
      setGunSubmitMessage({ type: 'error', text: error.message || 'Failed to submit verification' });
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Show different content based on verification status
  const renderContent = () => {
    if (authLoading || isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (isUserVerified) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 font-semibold text-lg">Verification Complete</AlertTitle>
          <AlertDescription className="text-green-700">
            Your account is fully verified. You have access to all features and functionalities of the platform.
          </AlertDescription>
        </Alert>
      );
    }

    // Show verification forms if the user is not verified
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
            <CardDescription>
              Please verify your identity by providing either passport or gun license details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="passport" className="text-base py-3">
                  Passport Verification
                </TabsTrigger>
                <TabsTrigger value="gun" className="text-base py-3">
                  Gun License Verification
                </TabsTrigger>
              </TabsList>

              <TabsContent value="passport" className="space-y-6 mt-2">
                <PassportVerificationForm
                  passportFile={passportFile}
                  handlePassportFileChange={handlePassportFileChange}
                  removePassportFile={removePassportFile}
                  submitPassportVerification={handlePassportSubmission}
                  isSubmittingPassport={isLoading}
                  passportSubmitMessage={passportSubmitMessage}
                  latestPassportVerification={latestPassportVerification}
                  hasPendingOrVerifiedPassport={hasPendingOrVerifiedPassport}
                  isLoadingVerifications={isLoading}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="gun" className="space-y-6 mt-2">
                <GunLicenseVerificationForm
                  gunLicenseFile={gunLicenseFile}
                  handleGunLicenseFileChange={handleGunLicenseFileChange}
                  removeGunLicenseFile={removeGunLicenseFile}
                  submitGunVerification={handleGunSubmission}
                  isSubmittingGun={isLoading}
                  gunSubmitMessage={gunSubmitMessage}
                  latestGunVerification={latestGunVerification}
                  hasPendingOrVerifiedGun={hasPendingOrVerifiedGun}
                  isLoadingVerifications={isLoading}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-xs text-center text-muted-foreground">
              By submitting, you confirm that all provided information is accurate and authentic.
            </p>
          </CardFooter>
        </Card>

        {/* Sidebar with verification info */}
        <div className="space-y-6">
          <VerificationGuidelines />
          <VerificationBenefits />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Verification Progress */}
      <div className="grid gap-6 md:grid-cols-3">
        <VerificationStatus isVerified={isUserVerified} />
      </div>

      {renderContent()}
    </div>
  );
}
