"use client"

import * as React from "react"
import { Share2, Bookmark, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface DiseaseActionsProps {
  diseaseTitle: string
}

export function DiseaseActions({ diseaseTitle }: DiseaseActionsProps) {
  const [isShared, setIsShared] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleShare = async () => {
    const shareData = {
      title: `${diseaseTitle} - Morbi`,
      text: `Check out this information about ${diseaseTitle} on Morbi.`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      }
    } catch (err) {
      console.error("Error sharing:", err)
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      } catch (clipErr) {
        console.error("Clipboard fallback failed:", clipErr)
      }
    }
  }

  const handleSave = () => {
    // Basic local storage save implementation
    const savedDiseases = JSON.parse(localStorage.getItem("morbi_saved") || "[]")
    const currentPath = window.location.pathname
    
    if (isSaved) {
      const filtered = savedDiseases.filter((path: string) => path !== currentPath)
      localStorage.setItem("morbi_saved", JSON.stringify(filtered))
      setIsSaved(false)
    } else {
      if (!savedDiseases.includes(currentPath)) {
        savedDiseases.push(currentPath)
        localStorage.setItem("morbi_saved", JSON.stringify(savedDiseases))
      }
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000) // Visual feedback
    }
  }

  return (
    <div className="flex space-x-3 mt-4 md:mt-0">
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleSave}
        className={cn(
          "gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-sm shadow-none",
          isSaved && "bg-[#111111] text-white"
        )}
      >
        {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {isSaved ? "Saved" : "Save"}
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleShare}
        className={cn(
          "gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-sm shadow-none",
          isShared && "bg-[#111111] text-white"
        )}
      >
        {isShared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {isShared ? "Link Copied" : "Share"}
      </Button>
    </div>
  )
}
