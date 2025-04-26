"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, CheckCircle, LogOut } from 'lucide-react'

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

export default function AdminSideBar({ children }) {
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

  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "verification", label: "Verification Requests", icon: CheckCircle, href: "/admin/verification-requests" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <Sidebar className="border-r shrink-0">
          <SidebarHeader className="px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">A</span>
              </div>
              <div className="flex flex-col w-full">
                <span className="text-sm font-medium">Admin</span>
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={handleLogout}
                >
                  <span className="text-sm font-medium">Logout</span>
                  <LogOut className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex h-16 items-center border-b px-6 shrink-0">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold truncate">
              {adminMenuItems.find((item) => item.href === pathname)?.label || "Admin Panel"}
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="w-full py-6 px-4 md:px-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}