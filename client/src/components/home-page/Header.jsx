"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-purple-600">
              WalletX
            </Link>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="#features" onClick={() => setIsMenuOpen(false)}>
            Features
          </MobileNavLink>
          <MobileNavLink href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
            How It Works
          </MobileNavLink>
          <MobileNavLink href="#testimonials" onClick={() => setIsMenuOpen(false)}>
            Testimonials
          </MobileNavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-4 flex flex-col space-y-3">
            <Link href="/login" className="block text-center w-full py-2 px-4 border border-transparent rounded-md text-purple-600 bg-white hover:bg-gray-50">
              Log in
            </Link>
            <Link href="/register" className="block text-center w-full py-2 px-4 border border-transparent rounded-md text-white bg-purple-600 hover:bg-purple-700">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50"
    >
      {children}
    </Link>
  )
}