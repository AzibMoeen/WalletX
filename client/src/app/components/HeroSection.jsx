"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-background/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center md:pt-32 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            <span className="block">Modern Digital Wallet for</span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Everyday Payments
            </span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-muted-foreground">
            Send money, make payments, and manage your finances with ease. Fast,
            secure, and designed for the modern world.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <Button
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-darker hover:to-secondary-darker text-primary-foreground text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
        <div className="mt-16 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-40 h-40 bg-primary/10 rounded-full opacity-70 blur-3xl"></div>
            <div className="w-40 h-40 bg-secondary/10 rounded-full -mt-20 ml-20 opacity-70 blur-3xl"></div>
          </div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard Preview Mockup */}
            <div className="bg-card rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto border border-border">
              <div className="h-12 bg-muted flex items-center px-4 border-b border-border">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="relative aspect-[16/9] bg-gradient-to-br from-primary to-secondary">
                <Image
                  src="/Img.jpeg"
                  alt="WalletX Dashboard Preview"
                  fill
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
