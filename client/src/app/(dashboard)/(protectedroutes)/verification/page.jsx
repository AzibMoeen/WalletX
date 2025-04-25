"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import VerificationStatus from "./components/VerificationStatus";
import PassportVerificationForm from "./components/PassportVerificationForm";
import GunLicenseVerificationForm from "./components/GunLicenseVerificationForm";
import VerificationGuidelines from "./components/VerificationGuidelines";
import VerificationBenefits from "./components/VerificationBenefits";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("passport");
  const [passportFile, setPassportFile] = useState(null);
  const [gunLicenseFile, setGunLicenseFile] = useState(null);
  const [isSubmittingPassport, setIsSubmittingPassport] = useState(false);
  const [isSubmittingGun, setIsSubmittingGun] = useState(false);
  const [passportSubmitMessage, setPassportSubmitMessage] = useState(null);
  const [gunSubmitMessage, setGunSubmitMessage] = useState(null);
  const [passportVerifications, setPassportVerifications] = useState([]);
  const [gunVerifications, setGunVerifications] = useState([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      setIsLoadingVerifications(true);
      const token = localStorage.getItem("accessToken");
      
      // Fetch both passport and gun verifications
      const [passportRes, gunRes] = await Promise.all([
        fetch("http://localhost:8000/api/verification/passport/me", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:8000/api/verification/gun/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (passportRes.ok) {
        const passportData = await passportRes.json();
        setPassportVerifications(passportData.verifications || []);
      }
      
      if (gunRes.ok) {
        const gunData = await gunRes.json();
        setGunVerifications(gunData.verifications || []);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    } finally {
      setIsLoadingVerifications(false);
    }
  };

  // Check if there are any pending or verified passport verifications
  const hasPendingOrVerifiedPassport = passportVerifications.some(
    v => v.status === 'pending' || v.status === 'verified'
  );
  
  // Check if there are any pending or verified gun verifications
  const hasPendingOrVerifiedGun = gunVerifications.some(
    v => v.status === 'pending' || v.status === 'verified'
  );
  
  // Get the most recent verification of each type
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

  const submitPassportVerification = async () => {
    if (!passportFile) {
      setPassportSubmitMessage({ type: 'error', text: 'Passport image is required' });
      return;
    }

    try {
      setIsSubmittingPassport(true);
      setPassportSubmitMessage(null);
      
      const formData = new FormData();
      formData.append('passportImage', passportFile);
      formData.append('passportNumber', document.getElementById('passport-number').value);
      formData.append('passwordCnic', document.getElementById('cnic').value);
      formData.append('fullName', document.getElementById('full-name').value);
      formData.append('dob', document.getElementById('dob').value);
      
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch('http://localhost:8000/api/verification/passport', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      // Check content type before parsing as JSON
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        throw new Error(data?.message || 'Verification submission failed');
      }
      
      setPassportSubmitMessage({ type: 'success', text: 'Passport verification submitted successfully' });
      // Clear form after successful submission
      setPassportFile(null);
      // Refresh verifications list
      fetchVerificationStatus();
    } catch (error) {
      console.error('Error submitting passport verification:', error);
      setPassportSubmitMessage({ type: 'error', text: error.message || 'Failed to submit verification' });
    } finally {
      setIsSubmittingPassport(false);
    }
  };

  const submitGunVerification = async () => {
    if (!gunLicenseFile) {
      setGunSubmitMessage({ type: 'error', text: 'Gun license image is required' });
      return;
    }

    try {
      setIsSubmittingGun(true);
      setGunSubmitMessage(null);
      
      const formData = new FormData();
      formData.append('gunImage', gunLicenseFile);
      formData.append('licenseNumber', document.getElementById('license-number').value);
      formData.append('cnic', document.getElementById('cnic-gun').value);
      formData.append('issueDate', document.getElementById('issue-date').value);
      formData.append('expiryDate', document.getElementById('expiry-date').value);
      
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch('http://localhost:8000/api/verification/gun', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      // Check content type before parsing as JSON
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned an invalid response format');
      }
      
      if (!response.ok) {
        throw new Error(data?.message || 'Verification submission failed');
      }
      
      setGunSubmitMessage({ type: 'success', text: 'Gun license verification submitted successfully' });
      // Clear form after successful submission
      setGunLicenseFile(null);
      // Refresh verifications list
      fetchVerificationStatus();
    } catch (error) {
      console.error('Error submitting gun verification:', error);
      setGunSubmitMessage({ type: 'error', text: error.message || 'Failed to submit verification' });
    } finally {
      setIsSubmittingGun(false);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Verification Progress */}
      <div className="grid gap-6 md:grid-cols-3">
        <VerificationStatus />
      </div>

      {/* Main Verification Form */}
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
                  submitPassportVerification={submitPassportVerification}
                  isSubmittingPassport={isSubmittingPassport}
                  passportSubmitMessage={passportSubmitMessage}
                  latestPassportVerification={latestPassportVerification}
                  hasPendingOrVerifiedPassport={hasPendingOrVerifiedPassport}
                  isLoadingVerifications={isLoadingVerifications}
                  formatDate={formatDate}
                />
              </TabsContent>

              <TabsContent value="gun" className="space-y-6 mt-2">
                <GunLicenseVerificationForm
                  gunLicenseFile={gunLicenseFile}
                  handleGunLicenseFileChange={handleGunLicenseFileChange}
                  removeGunLicenseFile={removeGunLicenseFile}
                  submitGunVerification={submitGunVerification}
                  isSubmittingGun={isSubmittingGun}
                  gunSubmitMessage={gunSubmitMessage}
                  latestGunVerification={latestGunVerification}
                  hasPendingOrVerifiedGun={hasPendingOrVerifiedGun}
                  isLoadingVerifications={isLoadingVerifications}
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
    </div>
  );
}
