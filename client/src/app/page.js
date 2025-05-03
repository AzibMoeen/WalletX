"use client"

import { useEffect } from "react"
import useAuthStore from "@/lib/store/useAuthStore"
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import HowItWorksSection from "./components/HowItWorksSection"
import TestimonialsSection from "./components/TestimonialsSection"
import CTASection from "./components/CTASection"
import Footer from "./components/Footer"

export default function HomePage() {
  const { fetchUser } = useAuthStore()
  
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}