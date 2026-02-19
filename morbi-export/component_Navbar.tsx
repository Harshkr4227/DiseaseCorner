"use client"

import Link from "next/link"
import { Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete"
import { cn } from "@/lib/utils" // Assuming cn utility is in @/lib/utils

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b",
        isScrolled 
          ? "bg-[#F9F7F1]/95 border-[#111111]/10 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 bg-[#111111]/5 rounded-sm flex items-center justify-center border border-[#111111]/10 group-hover:bg-[#111111]/10 transition-colors">
              <Heart className="h-4 w-4 text-[#111111]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111111] font-serif group-hover:opacity-80 transition-opacity">
              Morbi
            </span>
          </Link>

          {/* Desktop Search */}
          {!isHome && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchAutocomplete 
                placeholder="Search..."
                className="bg-transparent border-b-2 border-[#111111]/20 focus:border-[#111111] rounded-none px-0 h-9"
              />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isHome && (
              <div className="w-64 lg:w-80 hidden">
                 {/* redundant search hidden for now */}
              </div>
            )}
            <Link href="/about" className="text-sm font-medium text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">About</Link>
            <Link href="/symptom-checker" className="text-sm font-medium text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Symptom Checker</Link>
            <Button size="sm" className="rounded-md border-2 border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white shadow-none transition-all">Get App</Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#111111] hover:bg-[#111111]/5 rounded-sm transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F9F7F1] border-b border-[#111111]/10 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto px-4 py-6 space-y-6">
          {!isHome && (
             <div className="mb-4">
               <SearchAutocomplete placeholder="Search diseases..." />
             </div>
          )}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-lg font-serif font-medium text-[#111111] border-b border-[#111111]/5 pb-2">
              Home
            </Link>
            <Link href="/search" className="text-lg font-serif font-medium text-[#111111] border-b border-[#111111]/5 pb-2">
              Browse Diseases
            </Link>
            <Link href="/about" className="text-lg font-serif font-medium text-[#111111] border-b border-[#111111]/5 pb-2">
              About Us
            </Link>
            <Button className="w-full mt-2">Download App</Button>
          </div>
        </div>
      </div>
      )}
    </nav>
  )
}
