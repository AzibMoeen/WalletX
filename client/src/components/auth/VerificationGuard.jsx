"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import useAuthStore from "@/lib/store/useAuthStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProtectedRoute = ({
  children,
  requireVerification = false,
  isAdmin = false,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Always fetch fresh user data from cookies
        await fetchUser();

        // Get the latest user state after fetching
        const currentUser = useAuthStore.getState().user;
        const isAuth = useAuthStore.getState().isAuthenticated;

        if (!isAuth || !currentUser) {
          if (isMounted) {
            // Redirect to login if not authenticated
            router.push("/login");
          }
          return;
        }

        // Check verification status but don't redirect immediately
        if (requireVerification && !currentUser.verified) {
          if (isMounted) {
            // Only show dialog, don't redirect yet
            setShowVerificationDialog(true);
          }
          return;
        }

        if (isAdmin && !currentUser.isAdmin) {
          if (isMounted) {
            router.push("/login");
          }
          return;
        }

        if (isMounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/login");
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
  }, [fetchUser, isAuthenticated, requireVerification, router, user, isAdmin]);

  const handleVerifyNow = () => {
    setShowVerificationDialog(false);
    router.replace("/verification");
  };

  const handleDismiss = () => {
    setShowVerificationDialog(false);
    router.replace("/wallet"); // Redirect to a non-verified page like dashboard
  };

  if (checkingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      <AlertDialog
        open={showVerificationDialog}
        onOpenChange={(open) => {
          // If dialog is being closed, redirect to a safe page
          if (!open) {
            handleDismiss();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Verification Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your account needs to be verified before you can access this page.
              Please complete the verification process to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={handleVerifyNow}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              Verify Now
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleDismiss}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full sm:w-auto"
            >
              Go to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Only show children if verification dialog is not showing */}
      {!showVerificationDialog && !checkingAuth && children}
    </>
  );
};

export default ProtectedRoute;
