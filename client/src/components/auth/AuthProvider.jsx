"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/useAuthStore";
import { Loader2 } from "lucide-react";

/**
 * AuthProvider component that automatically fetches user data
 * from cookies on application startup
 */
export default function AuthProvider({ children }) {
  const { fetchUser, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Attempt to fetch user data from cookies when component mounts
    fetchUser();
  }, [fetchUser]);

  // Don't show loading state here as it will flash on every page load
  // Just render the children and let individual components handle auth state
  return children;
}
