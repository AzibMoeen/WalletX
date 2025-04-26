"use client"


import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeftRight, BadgeCheck, CreditCard, DollarSign, MessageSquareText, Wallet } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "./button"

export default function WalletLayout({ children }) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Get the token before removing it from localStorage
      const token = localStorage.getItem("accessToken");
      
      // Make the API request to logout
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Check if the request was successful
      if (response.ok) {
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed:", await response.text());
      }
      
      // Clear local storage regardless of API response
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  };
  const menuItems = [
    { id: "wallet", label: "Your Wallet", icon: Wallet, href: "/wallet" },
    { id: "verification", label: "Verification", icon: BadgeCheck, href: "/verification" },
    { id: "deposit", label: "Deposit", icon: DollarSign, href: "/deposit" },
    { id: "withdraw", label: "Withdraw", icon: CreditCard, href: "/withdraw" },
    { id: "exchange", label: "Exchange", icon: ArrowLeftRight, href: "/exchange" },
    { id: "request", label: "Request", icon: MessageSquareText, href: "/request" },
    { id: "transactions" , label: "Transactions", icon: ArrowLeftRight, href: "/wallet/transactions" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="px-4 py-4 md:py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg md:text-xl font-semibold">FinWallet</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href} className="flex items-center gap-2 md:gap-3 py-2 text-sm md:text-base">
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-3 md:p-4 border-t">
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 px-2 py-2 md:py-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium">JD</span>
              </div>
              <div className="flex flex-col w-full">
                <span className="text-sm font-medium text-center sm:text-left">John Doe</span>
                <span className="text-xs text-muted-foreground text-center sm:text-left mb-2 sm:mb-0">Premium Account</span>
                <Button 
                  variant="outline" className="w-full mt-1 sm:mt-2 text-xs md:text-sm h-8 md:h-9" onClick={handleLogout}>
                  <span className="font-medium">Logout</span>
                  <ArrowLeftRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="flex h-12 md:h-16 items-center border-b px-3 md:px-6">
            <SidebarTrigger className="mr-2 md:mr-4" />
            <h1 className="text-base md:text-xl font-semibold truncate">
              {menuItems.find((item) => item.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="container mx-auto max-w-6xl py-3 md:py-6 px-3 md:px-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
