"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/useAuthStore";

export function AuthProvider({ children }) {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    // Check if there's any indication that the user has logged out
    const hasLoggedOut = localStorage.getItem("loggedOut") === "true";

    if (!hasLoggedOut) {
      console.log("Attempting to restore session");
      fetchUser();
    } else {
      console.log("Not restoring session - user has logged out");
      // Clear the flag once we've respected it
      localStorage.removeItem("loggedOut");
    }
  }, [fetchUser]);

  return children;
}
