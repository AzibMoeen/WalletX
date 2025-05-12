"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftRight,
  BadgeCheck,
  CreditCard,
  DollarSign,
  LogOut,
  MessageSquareText,
  UserCircle,
  Wallet,
  X,
} from "lucide-react";
import useAuthStore from "@/lib/store/useAuthStore";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Badge } from "@/components/ui/badge";

// Internal component that uses the sidebar context
function WalletSidebarInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const { user, logout } = useAuthStore();

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Use the logout method from auth store
      logout();

      // Use Next.js router for navigation
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/login");
    }
  };

  const menuItems = [
    { id: "wallet", label: "Your Wallet", icon: Wallet, href: "/wallet" },
    {
      id: "verification",
      label: "Verification",
      icon: BadgeCheck,
      href: "/verification",
    },
    { id: "deposit", label: "Deposit", icon: DollarSign, href: "/deposit" },
    { id: "withdraw", label: "Withdraw", icon: CreditCard, href: "/withdraw" },
    {
      id: "exchange",
      label: "Exchange",
      icon: ArrowLeftRight,
      href: "/exchange",
    },
    {
      id: "request",
      label: "Request",
      icon: MessageSquareText,
      href: "/request",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
      href: "/transactions",
    },
    { id: "profile", label: "Profile", icon: UserCircle, href: "/profile" },
  ];

  const fullName = user?.fullname || "User";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Get current page title
  const currentPageTitle =
    menuItems.find((item) => item.href === pathname)?.label || "Dashboard";

  return (
    <div className="flex min-h-screen w-full bg-app">
      <Sidebar className="glass-sidebar w-[260px] flex-shrink-0">
        <SidebarHeader className="px-4 py-4 md:py-5 relative border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-semibold text-gradient">
              FinWallet
            </span>
          </div>

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-4 h-8 w-8"
              onClick={closeMobileSidebar}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </SidebarHeader>
        <SidebarContent className="py-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={
                    pathname === item.href
                      ? "sidebar-menu-item-active"
                      : "sidebar-menu-item"
                  }
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 py-2 px-3 text-sm rounded-md transition-colors"
                    onClick={closeMobileSidebar}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {user?.isAdmin && (
            <>
              <div className="px-3 py-2 mt-2">
                <div className="h-px bg-border" />
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/admin")}
                    tooltip="Admin Panel"
                    className={
                      pathname.startsWith("/admin")
                        ? "sidebar-menu-item-active"
                        : "sidebar-menu-item"
                    }
                  >
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 py-2 px-3 text-sm rounded-md transition-colors"
                      onClick={closeMobileSidebar}
                    >
                      <BadgeCheck className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Admin Panel</span>
                      <Badge
                        variant="gradient"
                        className="ml-auto text-xs py-0 h-5"
                      >
                        Admin
                      </Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </>
          )}
        </SidebarContent>
        <SidebarFooter className="p-3 border-t">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center flex-1 gap-3 hover:bg-muted/50 rounded-md p-2 transition-colors"
              onClick={closeMobileSidebar}
            >
              <UserAvatar
                user={user}
                size="md"
                className="purple-ring flex-shrink-0"
              />
              {/* Added w-0 to help flexbox calculate the available space correctly for truncation */}
              <div className="flex-1 min-w-0 w-0">
                <p className="text-sm font-medium truncate">{fullName}</p>
                <div className="flex items-center gap-1">
                  {user?.verified ? (
                    <>
                      <BadgeCheck className="h-3 w-3 text-success flex-shrink-0" />
                      <span className="text-xs text-success truncate">
                        Verified
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-warning truncate">
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted flex-shrink-0"
              onClick={(e) => {
                closeMobileSidebar();
                handleLogout();
              }}
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 flex flex-col w-0 min-w-0">
        <header className="glass-header h-14 md:h-16 flex items-center px-4 md:px-6 sticky top-0 z-10">
          <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold truncate text-gradient">
              {currentPageTitle}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!user?.verified && (
              <Badge variant="gradient-subtle" className="text-primary">
                Verification Required
              </Badge>
            )}
          </div>
        </header>
        <main className="flex-1 py-6 px-4 md:px-6 overflow-auto">
          <div className="container mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Main component that sets up the provider
export default function WalletLayout({ children }) {
  return (
    <SidebarProvider>
      <WalletSidebarInner>{children}</WalletSidebarInner>
    </SidebarProvider>
  );
}
