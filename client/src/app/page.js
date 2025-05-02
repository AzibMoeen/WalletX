"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, Wallet, Shield, Zap, Users, BarChart3, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/lib/store/useAuthStore"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, fetchUser } = useAuthStore()
  
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="sr-only">WalletX</span>
                <Wallet className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">WalletX</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link href="#features" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                    Features
                  </Link>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                    How It Works
                  </Link>
                  <Link href="#testimonials" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                    Testimonials
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <Link href="/wallet">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    Wallet
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400"
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
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="py-3 space-y-1 border-t border-gray-100">
              <Link 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              >
                How It Works
              </Link>
              <Link 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              >
                Testimonials
              </Link>
              <div className="mt-4 space-y-2 px-3">
                {isAuthenticated ? (
                  <Link href="/wallet">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full border-purple-600 text-purple-600">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center md:pt-32 md:pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              <span className="block">Modern Digital Wallet for</span>
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Everyday Payments
              </span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Send money, make payments, and manage your finances with ease.
              Fast, secure, and designed for the modern world.
            </p>
            <div className="mt-10">
              <Link href="/register">
                <Button 
                  size="lg"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="mt-16 relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-40 h-40 bg-purple-100 rounded-full opacity-70 blur-3xl"></div>
              <div className="w-40 h-40 bg-indigo-100 rounded-full -mt-20 ml-20 opacity-70 blur-3xl"></div>
            </div>
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Dashboard Preview Mockup */}
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-200">
  <div className="h-12 bg-gray-50 flex items-center px-4 border-b border-gray-200">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
    </div>
  </div>
  <div className="relative aspect-[16/9] bg-gradient-to-br from-purple-600 to-indigo-600">
    <Image
      src="/image.png" 
      alt="WalletX Dashboard Preview"
      fill
      className="object-cover"
      priority
    />
    
    {/* Overlay with text and icon */}
    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
      <div className="text-center text-white">
        <Wallet className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold">WalletX Dashboard Preview</h3>
        <p className="text-purple-100">Sign up to experience the full platform</p>
      </div>
    </div>
  </div>
</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-purple-600 uppercase tracking-wide">Features</h2>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need in a modern wallet
            </p>
            <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
              WalletX combines powerful features with elegant simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instant Transfers</h3>
              <p className="text-gray-600">
                Send money instantly to anyone, anywhere in the world with minimal fees and maximum security.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Transactions</h3>
              <p className="text-gray-600">
                Enterprise-grade security with end-to-end encryption and multi-factor authentication options.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Requests</h3>
              <p className="text-gray-600">
                Easily request money from friends, family or clients with customizable requests and tracking.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction History</h3>
              <p className="text-gray-600">
                Keep track of all your transactions with detailed reports, analytics and export capabilities.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Easy Verification</h3>
              <p className="text-gray-600">
                Streamlined verification process with email confirmation and secure identity verification.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }} 
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg shadow-gray-100/20"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-5">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Multiple Wallets</h3>
              <p className="text-gray-600">
                Create and manage multiple wallets for different purposes, all under one secure account.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-purple-600 uppercase tracking-wide">How It Works</h2>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">Get started in minutes</p>
            <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
              Our simple process gets you up and running with WalletX quickly and securely.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden lg:block">
              <div className="h-0.5 bg-gradient-to-r from-purple-100 via-purple-300 to-blue-100"></div>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-4">Create an Account</h3>
                <p className="text-gray-600 text-center">
                  Sign up for free with your email and verify your identity in a few simple steps.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <Wallet className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-4">Fund Your Wallet</h3>
                <p className="text-gray-600 text-center">
                  Add funds to your wallet using any major payment method or bank account.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-4">Send & Receive</h3>
                <p className="text-gray-600 text-center">
                  Start sending money to friends, receiving payments, or requesting funds instantly.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-4">Track &amp; Manage</h3>
                <p className="text-gray-600 text-center">
                  Monitor your spending, view transaction history, and manage your finances with ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-purple-600 uppercase tracking-wide">Testimonials</h2>
            <p className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">What our users are saying</p>
            <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
              Thousands of people trust WalletX for their digital payment needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  SA
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah A.</h4>
                  <p className="text-sm text-gray-500">Freelancer</p>
                </div>
              </div>
              <div className="text-yellow-400 flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                &quot;WalletX has revolutionized how I receive payments from clients worldwide. It&apos;s fast, secure, and the fees are much lower than traditional methods.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Michael J.</h4>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <div className="text-yellow-400 flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                &quot;The payment request feature is a game-changer for my business. I can track who has paid and send automated reminders. Customer support is also excellent.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  LK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Lisa K.</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <div className="text-yellow-400 flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i === 4 ? 'text-gray-300' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                &quot;Splitting bills and expenses with roommates has never been easier. The app interface is intuitive and the instant transfers make sharing costs so convenient.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started with WalletX?</h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust WalletX for their digital payment needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-purple-500">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Wallet className="h-7 w-7 text-purple-400" />
                <span className="ml-2 text-lg font-bold text-white">WalletX</span>
              </div>
              <p className="mt-2 text-sm">
                Modern digital wallet for everyday payments. Fast, secure, and designed for the modern world.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>

                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>

                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm hover:text-white">Personal Payments</a></li>
                <li><a href="#" className="text-sm hover:text-white">Business Transactions</a></li>
                <li><a href="#" className="text-sm hover:text-white">International Transfers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Money Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-sm hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-sm hover:text-white">API Documentation</a></li>
                <li><a href="#" className="text-sm hover:text-white">Status Page</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-sm hover:text-white">About</a></li>
                <li><a href="#" className="text-sm hover:text-white">Blog</a></li>
                <li><a href="#" className="text-sm hover:text-white">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-white">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WalletX. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}