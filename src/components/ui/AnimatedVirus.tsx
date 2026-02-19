"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion"
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
  layer?: 'foreground' | 'mid' | 'background'
}

export function AnimatedVirus({ 
  className, 
  style,
  delay = 0, 
  duration = 10,
  size = 100,
  color = "#111111",
  parallaxSpeed = 0.2,
  layer = 'mid'
}: VirusProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  
  // Interaction states
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Spring config for smooth "magnetic" feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const translateX = useSpring(0, springConfig)
  const translateY = useSpring(0, springConfig)
  const rotateSpring = useSpring(0, springConfig)

  // Determine intensity based on layer
  const intensity = layer === 'foreground' ? 1 : layer === 'mid' ? 0.6 : 0.3
  const maxDisplacement = 50 * intensity
  const maxRotation = 8 * intensity

  useEffect(() => {
    // Check mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    if (shouldReduceMotion || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      // Only react if cursor is within 250px radius
      const threshold = 250
      if (distance < threshold) {
        // Calculate interaction strength (stronger when closer)
        const strength = (1 - distance / threshold) * intensity
        
        // Magnetic pull/orbit effect
        translateX.set(distanceX * 0.2 * strength)
        translateY.set(distanceY * 0.2 * strength)
        rotateSpring.set(strength * maxRotation)
      } else {
        // Return to home
        translateX.set(0)
        translateY.set(0)
        rotateSpring.set(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkMobile)
    }
  }, [intensity, isMobile, shouldReduceMotion, maxRotation, translateX, translateY, rotateSpring])

  // Parallax scroll effect
  const { scrollY } = useScroll()
  const scrollYTransform = useTransform(scrollY, [0, 1000], [0, 1000 * parallaxSpeed])

  // Generate random spike positions
  const spikes = Array.from({ length: 8 }).map((_, i) => ({
    rotate: (i * 360) / 8,
    height: size * 0.15,
  }))

  return (
    <motion.div
      ref={containerRef}
      className={cn("absolute z-0 pointer-events-none", className)}
      style={{
        ...style,
        x: translateX,
        y: useTransform([scrollYTransform, translateY], ([sY, tY]) => (sY as number) + (tY as number)),
        rotate: rotateSpring
      }}
      initial={{ x: 0, rotate: 0 }}
      animate={{ 
        x: [0, 5 * intensity, 0],
        rotate: shouldReduceMotion ? 0 : [0, 3 * intensity, 0],
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
          <circle r={size * 0.35} stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
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
    const newParticles = Array.from({ length: 18 }).map((_, i) => {
      const depth = i % 3 // 0, 1, 2 for layers
      const layer = depth === 0 ? 'foreground' : depth === 1 ? 'mid' : 'background'
      
      return {
        id: i,
        layer,
        size: depth === 0 ? 50 : depth === 1 ? 35 : 20,
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 20,
        opacity: depth === 0 ? 0.25 : depth === 1 ? 0.15 : 0.08,
        color: i % 2 === 0 ? "#111111" : "#2C3E50",
        blur: depth === 2 ? "blur-[2px]" : "blur-0",
        parallaxSpeed: (depth === 0 ? 0.1 : depth === 1 ? 0.05 : 0.02)
      }
    })
    setParticles(newParticles)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none h-full">
      {particles.map((p) => (
        <AnimatedVirus
          key={p.id}
          size={p.size}
          layer={p.layer}
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

