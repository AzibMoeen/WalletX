"use client"

import { motion } from "framer-motion"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-purple-600 uppercase tracking-wide">How It Works</h2>
          <p className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
            Three simple steps to get started
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            WalletX is designed to be simple and straightforward to use.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Create an account"
              description="Sign up in under 2 minutes with just your email and basic information. No credit card required."
            />

            <StepCard
              number="02" 
              title="Verify your identity"
              description="Complete a quick verification process to ensure the security of your account and unlock all features."
            />

            <StepCard 
              number="03"
              title="Start sending & receiving"
              description="Instantly transfer money, manage your funds, and track your transaction history in one place."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ number, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative bg-white rounded-lg p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold mb-5 mx-auto">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">
        {description}
      </p>
    </motion.div>
  )
}