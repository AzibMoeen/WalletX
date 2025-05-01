import { Geist, Geist_Mono } from "next/font/google";
import ProtectedRoute from "@/components/VerificationGuard";

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
        <ProtectedRoute isAdmin={true}>
        <AdminSideBar>
          {children}
        </AdminSideBar>
        </ProtectedRoute>
  );
}
