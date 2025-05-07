"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/lib/store/useAuthStore";
import { toast } from "sonner";

const ProtectedRoute = ({
  children,
  requireVerification = false,
  isAdmin = false,
}) => {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        if (!user) {
          await fetchUser();
        }

        const currentUser = user || useAuthStore.getState().user;

        if (!isAuthenticated || !currentUser) {
          if (isMounted) {
            router.push("/login");
          }
          return;
        }

        if (requireVerification && !currentUser.verified) {
          if (isMounted) {
            toast.success("Please verify your account to access this page.");
            router.replace("/verification");
          }
          return;
        }
        if (isAdmin && !currentUser.isAdmin) {
          if (isMounted) {
            toast.error("You do not have permission to access this page.");
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
