"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CursorState {
  x: number
  y: number
  label: string
  isHovering: boolean
  isPointer: boolean
}

export const EnhancedCursor = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    label: "",
    isHovering: false,
    isPointer: false,
  })

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }))
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isButton = target.tagName === "BUTTON" || target.closest("button")
      const isLink = target.tagName === "A" || target.closest("a")
      
      if (isButton || isLink) {
        const label = target.getAttribute("data-cursor-label") || (isButton ? "Click" : "View")
        setCursor((prev) => ({
          ...prev,
          isHovering: true,
          isPointer: true,
          label,
        }))
      }
    }

    const handleMouseLeave = () => {
      setCursor((prev) => ({
        ...prev,
        isHovering: false,
        isPointer: false,
        label: "",
      }))
    }

    document.addEventListener("mousemove", updateCursor)
    document.addEventListener("mouseover", handleMouseEnter)
    document.addEventListener("mouseout", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updateCursor)
      document.removeEventListener("mouseover", handleMouseEnter)
      document.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50"
        animate={{
          x: cursor.x,
          y: cursor.y,
          scale: cursor.isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        {/* Outer circle */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: cursor.isHovering ? 1.2 : 1,
            opacity: cursor.isHovering ? 0.7 : 0.4,
          }}
        >
          <div className="w-8 h-8 rounded-full border border-white/80 backdrop-blur-sm" />
          
          {/* Label */}
          <AnimatePresence>
            {cursor.isHovering && cursor.label && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full mt-2 text-white text-sm font-medium bg-black/80 px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap"
              >
                {cursor.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inner dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 -ml-[2px] -mt-[2px] rounded-full bg-white"
          animate={{
            scale: cursor.isHovering ? 0.5 : 1,
          }}
        />
      </motion.div>

      <style jsx global>{`
        body {
          cursor: none;
        }

        a, button, [role="button"] {
          cursor: none;
        }

        @media (max-width: 768px) {
          body, a, button, [role="button"] {
            cursor: auto;
          }
        }
      `}</style>
    </>
  )
} 