"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ProtectedRoute = ({ children, requireVerification = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get token and user data from local storage
        const token = localStorage.getItem('accessToken');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Check if token exists and is valid
        if (!token) {
         
          
          router.push('/login');
          
          return;
        }
        
        setIsAuthenticated(true);
        
        // Check verification if required
        if (requireVerification) {
          if (!userData.verified) {
            toast.error("You need to verify your account to access this page.");
            router.push('/verification');
            return;
          }
          setIsVerified(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, requireVerification]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }


  if (requireVerification) {
    return isAuthenticated && isVerified ? children : null;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;