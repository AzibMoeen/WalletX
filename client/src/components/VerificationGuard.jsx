"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/lib/store/useAuthStore';
import { toast } from 'sonner';

const ProtectedRoute = ({ children, requireVerification = false }) => {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // ⚡️ Only fetch if user is NOT already available
        if (!user) {
          await fetchUser();
        }

        const currentUser = user || useAuthStore.getState().user; // in case user is updated after fetchUser

        if (!isAuthenticated || !currentUser) {
          if (isMounted) {
            toast.success("Please log in to access this page.");
            router.replace('/login');
          }
          return;
        }

        if (requireVerification && !currentUser.verified) {
          if (isMounted) {
            toast.success("Please verify your account to access this page.");
            router.replace('/verification');
          }
          return;
        }

      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace('/login');
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchUser, isAuthenticated, requireVerification, router, user]);

  if (checkingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
