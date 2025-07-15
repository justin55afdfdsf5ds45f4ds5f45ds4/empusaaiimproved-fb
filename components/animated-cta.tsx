"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AnimatedCTAProps {
  href: string
  children: React.ReactNode
  variant?: "primary" | "secondary" | "white"
  className?: string
}

export const AnimatedCTA = ({ href, children, variant = "primary", className = "" }: AnimatedCTAProps) => {
  const buttonStyles = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white shadow-[0_0_0_3px_rgba(20,184,166,0.1)]",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_0_3px_rgba(16,185,129,0.1)]",
    white: "bg-white text-teal-600 hover:text-teal-700 shadow-[0_0_0_3px_rgba(255,255,255,0.1)]"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      {/* Animated glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: variant === "primary" 
            ? "linear-gradient(120deg, rgba(20,184,166,0.2), rgba(16,185,129,0.2))"
            : variant === "secondary"
              ? "linear-gradient(120deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))"
              : "linear-gradient(120deg, rgba(255,255,255,0.2), rgba(229,231,235,0.2))"
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0, 0.15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Button
        asChild
        className={`
          ${buttonStyles[variant]} 
          ${className} 
          relative 
          overflow-hidden 
          transition-all 
          duration-300 
          group-hover:shadow-lg
          group-hover:shadow-${variant === "primary" ? "teal" : variant === "secondary" ? "emerald" : "white"}-100/20
        `}
      >
        <a href={href} className="flex items-center gap-2">
          {children}
          <motion.div
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>

          {/* Shine effect */}
          <div className="absolute inset-0 pointer-events-none group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </a>
      </Button>
    </motion.div>
  )
} 