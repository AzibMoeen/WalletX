import React from "react";
import ProtectedRoute from "@/components/auth/VerificationGuard";

const layout = ({ children }) => {
  return <ProtectedRoute requireVerification={true}>{children}</ProtectedRoute>;
};

export default layout;
