import { Geist, Geist_Mono } from "next/font/google";
import ProtectedRoute from "@/components/auth/VerificationGuard";
import AuthProvider from "@/components/auth/AuthProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import AdminSideBar from "@/components/ui/AdminSideBar";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute isAdmin={true}>
        <AdminSideBar>{children}</AdminSideBar>
      </ProtectedRoute>
    </AuthProvider>
  );
}
