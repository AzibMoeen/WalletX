"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-purple-100 text-lg max-w-lg">
              Join thousands of users who trust WalletX for their digital payment needs. 
              Sign up today and experience the future of payment solutions.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}