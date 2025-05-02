"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Manage your finances</span>
              <span className="block text-purple-600">with WalletX</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-md">
              Send, receive, and manage your money with ease. Our secure platform makes digital transactions simple and accessible for everyone.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/register">
                <Button size="lg" className="px-8">Get Started</Button>
              </Link>
              <Link href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                  <Image
                    src="/image.png"
                    alt="WalletX App Screenshot"
                    width={500}
                    height={400}
                    className="w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}