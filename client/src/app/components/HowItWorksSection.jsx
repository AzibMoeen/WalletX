"use client"

import { Users, Wallet, Zap, BarChart3 } from "lucide-react"

export default function HowItWorksSection() {
  return (
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
            <StepCard 
              stepNumber={1}
              icon={<Users className="h-8 w-8 text-purple-600" />}
              title="Create an Account"
              description="Sign up for free with your email and verify your identity in a few simple steps."
            />
            
            <StepCard 
              stepNumber={2}
              icon={<Wallet className="h-8 w-8 text-purple-600" />}
              title="Fund Your Wallet"
              description="Add funds to your wallet using any major payment method or bank account."
            />
            
            <StepCard 
              stepNumber={3}
              icon={<Zap className="h-8 w-8 text-purple-600" />}
              title="Send & Receive"
              description="Start sending money to friends, receiving payments, or requesting funds instantly."
            />
            
            <StepCard 
              stepNumber={4}
              icon={<BarChart3 className="h-8 w-8 text-purple-600" />}
              title="Track & Manage"
              description="Monitor your spending, view transaction history, and manage your finances with ease."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StepCard({ stepNumber, icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
        {stepNumber}
      </div>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <p className="text-gray-600 text-center">
        {description}
      </p>
    </div>
  )
}