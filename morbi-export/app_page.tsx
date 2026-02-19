"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Activity, Shield, Stethoscope, Heart, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card"
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete"
import { VirusBackground } from "@/components/ui/AnimatedVirus"

export default function Home() {
  const router = useRouter()

  const features = [
    { icon: Activity, title: "Symptom Checker", desc: "Check your symptoms instantly." },
    { icon: Shield, title: "Prevention Tips", desc: "Learn how to stay healthy." },
    { icon: Stethoscope, title: "Treatment Info", desc: "Doctor-verified treatments." },
    { icon: Heart, title: "Health Guides", desc: "Comprehensive health guides." },
  ]

  const categories = ["Fever", "Respiratory", "Skin", "Stomach", "Infections", "Chronic"]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F9F7F1] -z-10" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#111111]/5 to-transparent -z-10" />
        
        {/* Animated Background */}
        <VirusBackground />
        
        <div className="container px-4 md:px-6 mx-auto text-center relative z-10 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-balance font-bold font-serif tracking-tight text-[#111111] sm:text-5xl md:text-6xl lg:text-7xl">
                Disease  <br className="hidden sm:block" /> 
                <span className="text-[#111111] relative inline-block">
                  Informatives
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#111111]/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray="4 4" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#333333] max-w-2xl mx-auto leading-relaxed font-serif italic">
                Instant access to reliable disease information, symptoms, and treatments. 
                <span className="font-semibold text-[#111111] not-italic"> Simple language, no jargon.</span>
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-[#111111] rounded-none blur opacity-5 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <SearchAutocomplete
                  className="pl-5 h-16 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-[#111111] rounded-none transition-all bg-white placeholder:text-[#111111]/40"
                  iconClassName="hidden" 
                  placeholder="What are you feeling today?"
                >
                  <Button 
                    type="submit" 
                    className="absolute right-2 top-2 h-12 px-8 rounded-none text-base font-medium shadow-none hover:shadow-none transition-all bg-[#111111] text-white hover:bg-[#333333] border border-[#111111]"
                  >
                    Search
                  </Button>
                </SearchAutocomplete>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-3 text-sm text-[#333333]">
              <span className="font-medium text-[#111111] font-serif italic">Popular:</span>
              {["Fever", "Cold", "Migraine", "Dengue", "Diabetes"].map((item) => (
                <button 
                  key={item}
                  onClick={() => router.push(`/search?q=${item}`)}
                  className="px-3 py-1 rounded-sm bg-white border border-[#111111]/20 hover:border-[#111111] hover:bg-[#111111]/5 hover:text-[#111111] transition-all duration-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative border-t border-[#111111]/10">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="mb-4 text-[#111111] font-serif">Everything you need to know</h2>
            <p className="text-lg text-[#333333] font-serif italic">Comprehensive health tools accessible to everyone.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 relative overflow-hidden group bg-white rounded-md transition-all">
                  <CardContent className="pt-8 text-center space-y-5">
                    <div className="h-16 w-16 mx-auto rounded-full border border-[#111111]/20 flex items-center justify-center text-[#111111] relative z-10 transition-colors duration-300 bg-transparent group-hover:bg-[#111111]/5">
                      <feature.icon className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2 font-serif font-bold">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-[#333333]">{feature.desc}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-[#F9F7F1] border-t border-[#111111]/10">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="mb-3 text-[#111111] font-serif">Browse by Category</h2>
              <p className="text-[#333333] text-lg font-serif italic">Find diseases and conditions by body system.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-[#111111] hover:bg-[#111111]/5 font-serif italic hover:underline decoration-1">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="cursor-pointer border-2 border-[#111111]/20 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:border-[#111111] group text-center py-8 transition-all duration-300 bg-white rounded-md"
                  onClick={() => router.push(`/search?q=${cat}`)}
                >
                  <CardTitle className="text-base font-semibold text-[#111111] font-serif">
                    {cat}
                  </CardTitle>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
