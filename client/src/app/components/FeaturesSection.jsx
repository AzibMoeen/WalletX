"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Users, BarChart3, Check, Wallet } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-primary uppercase tracking-wide">
            Features
          </h2>
          <p className="mt-1 text-3xl md:text-4xl font-bold text-foreground">
            Everything you need in a modern wallet
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-muted-foreground">
            WalletX combines powerful features with elegant simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Instant Transfers"
            description="Send money instantly to anyone, anywhere in the world with minimal fees and maximum security."
          />

          <FeatureCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Secure Transactions"
            description="Enterprise-grade security with end-to-end encryption and multi-factor authentication options."
          />

          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Payment Requests"
            description="Easily request money from friends, family or clients with customizable requests and tracking."
          />

          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            title="Transaction History"
            description="Keep track of all your transactions with detailed reports, analytics and export capabilities."
          />

          <FeatureCard
            icon={<Check className="h-6 w-6 text-primary" />}
            title="Easy Verification"
            description="Streamlined verification process with email confirmation and secure identity verification."
          />

          <FeatureCard
            icon={<Wallet className="h-6 w-6 text-primary" />}
            title="Multiple Wallets"
            description="Create and manage multiple wallets for different purposes, all under one secure account."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-lg p-6 border border-border shadow-lg shadow-muted/20"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
