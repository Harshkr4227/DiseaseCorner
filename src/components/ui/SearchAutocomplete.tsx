"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"

export function SearchAutocomplete({ 
  className, 
  placeholder = "Search...",
  iconClassName,
  children
}: { 
  className?: string, 
  placeholder?: string,
  iconClassName?: string,
  children?: React.ReactNode
}) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchResults = React.useCallback(async (q: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      setResults(data)
      setIsOpen(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchResults(query)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, fetchResults])

  const handleSelect = (slug: string) => {
    setQuery("")
    setIsOpen(false)
    router.push(`/disease/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10", iconClassName)} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn("pl-10", className)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
        />
        {/* Loading spinner positioned before children/buttons but after input */}
        {isLoading && (
          <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400 z-10" />
        )}
        {children}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#F9F7F1] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border-2 border-[#111111] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-[300px] overflow-y-auto">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button" 
                  onClick={() => handleSelect(String(item.uri).replace(/\/$/, '').split('/').pop() || item.id)}
                  className="w-full text-left px-4 py-3 hover:bg-[#111111]/5 transition-colors flex flex-col border-b border-[#111111]/10 last:border-0"
                >
                  <span 
                    className="font-medium text-[#111111] hover:text-[#111111] font-serif"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <span className="text-xs text-[#333333] truncate">{item.theCode || "ICD-11"}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="bg-[#111111]/5 p-2 text-center border-t-2 border-[#111111]/10">
            <button 
              type="button"
              onClick={handleSubmit}
              className="text-xs text-[#111111] font-medium hover:underline w-full py-1"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
