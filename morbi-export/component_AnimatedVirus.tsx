"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

interface VirusProps {
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  size?: number
  color?: string
  parallaxSpeed?: number
}

export function AnimatedVirus({ 
  className, 
  style,
  delay = 0, 
  duration = 10,
  size = 100,
  color = "#111111",
  parallaxSpeed = 0.2
}: VirusProps) {
  // Generate random spike positions for a balanced look
  const spikes = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 360) / 8
    return {
      rotate: angle,
      height: size * 0.15, // Spike height relative to body
    }
  })

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * parallaxSpeed])

  return (
    <motion.div
      className={cn("absolute z-0 pointer-events-none opacity-20", className)}
      style={{...style, y}}
      initial={{ x: 0, rotate: 0 }}
      animate={{ 
        x: [0, 5, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(${size/2}, ${size/2})`}>
          {/* Main Body - Sketch Style (Stroke only) */}
          <circle r={size * 0.35} stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          
          {/* Spikes - Lines */}
          {spikes.map((spike, i) => (
            <line
              key={i}
              x1={0}
              y1={-size * 0.35}
              x2={0}
              y2={-size * 0.35 - spike.height}
              stroke={color}
              strokeWidth="1.5"
              transform={`rotate(${spike.rotate})`}
            />
          ))}
          
          {/* Inner details for texture */}
          <circle r={size * 0.2} stroke={color} strokeWidth="0.5" strokeOpacity="0.5" fill="none" />
          <path d={`M -${size*0.1} 0 L ${size*0.1} 0`} stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
          <path d={`M 0 -${size*0.1} L 0 ${size*0.1}`} stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
        </g>
      </svg>
    </motion.div>
  )
}

export function VirusBackground() {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    // Generate particles only on the client side to avoid hydration mismatch
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 40) + 20, // 20px - 60px
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      opacity: (Math.random() * 0.08) + 0.02, // 0.02 - 0.1
      color: i % 2 === 0 ? "#2F80ED" : "#56CCF2",
      blur: Math.random() > 0.5 ? "blur-[1px]" : "blur-0",
      parallaxSpeed: ((Math.random() * 0.4) - 0.2) * 0.25 // Significantly slower speed
    }))
    setParticles(newParticles)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none h-full">
      {particles.map((p) => (
        <AnimatedVirus
          key={p.id}
          size={p.size}
          className={cn("absolute", p.blur)}
          style={{ 
            top: p.top, 
            left: p.left,
            opacity: p.opacity 
          }}
          delay={p.delay}
          duration={p.duration}
          color={p.color}
          parallaxSpeed={p.parallaxSpeed}
        />
      ))}
    </div>
  )
}
