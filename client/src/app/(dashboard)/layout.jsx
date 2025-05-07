"use client";

import { Geist, Geist_Mono } from "next/font/google";
import WalletSidebar from "@/components/ui/WalletSideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return <WalletSidebar>{children}</WalletSidebar>;
}
