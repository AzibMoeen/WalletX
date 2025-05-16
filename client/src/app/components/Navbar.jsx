"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="sr-only cursor:hover">WalletX</span>
              <Image
                src="/favicon.png"
                alt="WalletX Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-foreground">
                WalletX
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  How It Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Testimonials
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/wallet">
                <Button className="bg-gradient-to-r cursor-pointer from-primary to-secondary hover:from-primary-darker hover:to-secondary-darker text-primary-foreground">
                  Wallet
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-darker hover:to-secondary-darker text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="py-3 space-y-1 border-t border-border">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary/10 hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary/10 hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary/10 hover:text-primary"
            >
              Testimonials
            </Link>
            <div className="mt-4 space-y-2 px-3">
              {isAuthenticated ? (
                <Link href="/wallet">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-darker hover:to-secondary-darker text-primary-foreground">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-darker hover:to-secondary-darker text-primary-foreground">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
