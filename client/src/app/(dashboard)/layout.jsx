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
    Promise.all([
      fetchUser(),
      fetchBalance(),
      fetchTransactions(),
      fetchMoneyRequests(),
      fetchAllVerifications()
    ]).catch(error => {
      console.error("Error loading dashboard data:", error);
    });
  }, [fetchUser, fetchBalance, fetchTransactions, fetchMoneyRequests, fetchAllVerifications]);

  return (

        <WalletSidebar>
          {children}
        </WalletSidebar>
  
  );
}
