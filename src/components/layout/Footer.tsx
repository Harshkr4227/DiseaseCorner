
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#F9F7F1] text-[#111111] border-t-2 border-[#111111]/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-sm bg-[#111111]/5 flex items-center justify-center border border-[#111111]/10">
                <Heart className="h-4 w-4 text-[#111111]" />
              </div>
              <span className="text-xl font-bold font-serif text-[#111111]">Morbi</span>
            </div>
            <p className="text-[#333333] text-sm leading-relaxed max-w-xs">
              Providing instant, reliable healthcare information to help you make informed decisions about your health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold font-serif text-lg mb-4 text-[#111111]">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Home</Link></li>
              <li><Link href="/search" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Search Diseases</Link></li>
              <li><Link href="/symptom-checker" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Symptom Checker</Link></li>
              <li><Link href="/about" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold font-serif text-lg mb-4 text-[#111111]">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Terms of Service</Link></li>
              <li><Link href="/cookie" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="text-[#333333] hover:text-[#111111] hover:underline decoration-1 underline-offset-4 transition-all">Medical Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold font-serif text-lg mb-4 text-[#111111]">Connect</h3>
            <p className="text-[#333333] mb-4">Stay updated with the latest health news.</p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-transparent border border-[#111111]/20 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all text-[#111111]">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-transparent border border-[#111111]/20 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all text-[#111111]">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-transparent border border-[#111111]/20 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all text-[#111111]">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-transparent border border-[#111111]/20 flex items-center justify-center hover:bg-[#111111] hover:text-white transition-all text-[#111111]">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#111111]/10 pt-8 flex flex-col md:flex-row justify-between items-center bg-[#111111]/0">
          <p className="text-[#333333]/60 text-sm">
            © {new Date().getFullYear()} Morbi. All rights reserved.
          </p>
          <p className="text-[#333333]/60 text-xs mt-2 md:mt-0">
            For informational purposes only. Consult a doctor for medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
