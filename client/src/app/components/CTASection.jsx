"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
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
  )
}