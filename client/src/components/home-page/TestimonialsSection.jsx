"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-purple-600 uppercase tracking-wide">Testimonials</h2>
          <p className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
            What our users are saying
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500">
            Join thousands of satisfied users who trust WalletX for their digital payment needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            content="WalletX has completely changed how I manage my payments. The interface is intuitive and transfers are incredibly fast!"
            name="Sarah Johnson"
            title="Small Business Owner"
            avatar="/image.png"
          />
          
          <TestimonialCard 
            content="As a freelancer, getting paid used to be a pain. With WalletX, I can easily request payments and keep track of everything in one place."
            name="Michael Chen"
            title="Freelance Designer"
            avatar="/image.png"
          />
          
          <TestimonialCard 
            content="The verification process was quick and painless. I was up and running in minutes, and the security features give me peace of mind."
            name="Emily Rodriguez"
            title="Marketing Consultant"
            avatar="/image.png"
          />
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ content, name, title, avatar }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      className="bg-white rounded-lg p-6 border border-gray-100 shadow-lg"
    >
      <div className="flex mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-600 mb-6">"{content}"</p>
      
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
          <Image 
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}