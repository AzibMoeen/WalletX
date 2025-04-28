"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import WalletSidebar from "@/components/ui/WalletSideBar";
import useAuthStore from "@/lib/store/useAuthStore";
import useWalletStore from "@/lib/store/useWalletStore";
import useVerificationStore from "@/lib/store/useVerificationStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const { fetchUser } = useAuthStore();
  const { fetchBalance, fetchTransactions, fetchMoneyRequests } = useWalletStore();
  const { fetchAllVerifications } = useVerificationStore();

  useEffect(() => {
    // Initialize stores data when dashboard layout mounts
    fetchUser();
    fetchBalance();
    fetchTransactions();
    fetchMoneyRequests();
    fetchAllVerifications();
  }, [fetchUser, fetchBalance, fetchTransactions, fetchMoneyRequests, fetchAllVerifications]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletSidebar>
          {children}
        </WalletSidebar>
      </body>
    </html>
  );
}
