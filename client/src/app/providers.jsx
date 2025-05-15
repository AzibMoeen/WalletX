"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/store/useAuthStore";

export function AuthProvider({ children }) {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    console.log("provided");            
    fetchUser();
  }, [fetchUser]);

  return children;
}
