"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

interface CursorState {
  x: number
  y: number
  variant: "default" | "button" | "link" | "automation" | "pin" | "onGreen"
  isHovering: boolean
}

export const CustomCursor = () => {
  const pathname = usePathname()
  const [cursor, setCursor] = useState<CursorState>({
    x: -100,
    y: -100,
    variant: "default",
    isHovering: false
  })

  // Only show cursor on specific pages
  const shouldShowCursor = () => {
    const publicPages = ['/', '/about', '/blog', '/features', '/pricing']
    return publicPages.includes(pathname)
  }

  useEffect(() => {
    if (!shouldShowCursor()) return

    const updateMousePosition = (e: MouseEvent) => {
      setCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }))
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target.closest(".bg-teal-600")) {
        setCursor(prev => ({ ...prev, variant: "onGreen", isHovering: true }))
      } else if (target.tagName === "BUTTON" || target.closest("button")) {
        setCursor(prev => ({ ...prev, variant: "button", isHovering: true }))
      } else if (target.tagName === "A" || target.closest("a")) {
        setCursor(prev => ({ ...prev, variant: "link", isHovering: true }))
      } else if (target.closest("[data-cursor='automation']")) {
        setCursor(prev => ({ ...prev, variant: "automation", isHovering: true }))
      } else if (target.closest("[data-cursor='pin']")) {
        setCursor(prev => ({ ...prev, variant: "pin", isHovering: true }))
      } else {
        setCursor(prev => ({ ...prev, variant: "default", isHovering: false }))
      }
    }

    const handleMouseLeave = () => {
      setCursor(prev => ({ ...prev, variant: "default", isHovering: false }))
    }

    window.addEventListener("mousemove", updateMousePosition)
    document.addEventListener("mouseover", handleMouseEnter)
    document.addEventListener("mouseout", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseover", handleMouseEnter)
      document.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [pathname])

  // Don't render cursor if we're not on a public page
  if (!shouldShowCursor()) {
    return null
  }

  const variants = {
    default: {
      outer: {
        scale: 1,
        backgroundColor: "rgba(230, 0, 35, 0.1)",
        borderColor: "rgba(230, 0, 35, 0.4)"
      },
      inner: {
        scale: 1,
        backgroundColor: "rgb(230, 0, 35)"
      }
    },
    button: {
      outer: {
        scale: 1.5,
        backgroundColor: "rgba(230, 0, 35, 0.15)",
        borderColor: "rgba(230, 0, 35, 0.5)"
      },
      inner: {
        scale: 0.5,
        backgroundColor: "rgb(230, 0, 35)"
      }
    },
    link: {
      outer: {
        scale: 1.2,
        backgroundColor: "rgba(230, 0, 35, 0.1)",
        borderColor: "rgba(230, 0, 35, 0.4)"
      },
      inner: {
        scale: 0.8,
        backgroundColor: "rgb(230, 0, 35)"
      }
    },
    automation: {
      outer: {
        scale: 1.8,
        backgroundColor: "rgba(230, 0, 35, 0.2)",
        borderColor: "rgba(230, 0, 35, 0.6)"
      },
      inner: {
        scale: 0.3,
        backgroundColor: "rgb(230, 0, 35)"
      }
    },
    pin: {
      outer: {
        scale: 1.5,
        backgroundColor: "rgba(230, 0, 35, 0.2)",
        borderColor: "rgba(230, 0, 35, 0.6)"
      },
      inner: {
        scale: 0.4,
        backgroundColor: "rgb(230, 0, 35)"
      }
    },
    onGreen: {
      outer: {
        scale: 1.5,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.6)"
      },
      inner: {
        scale: 0.4,
        backgroundColor: "rgb(255, 255, 255)"
      }
    }
  }

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[60]"
        animate={{
          x: cursor.x - 16,
          y: cursor.y - 16,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          mass: 0.5
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: variants[cursor.variant].outer.scale,
          }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          <motion.div
            className="w-8 h-8 rounded-full border-2"
            animate={{
              backgroundColor: variants[cursor.variant].outer.backgroundColor,
              borderColor: variants[cursor.variant].outer.borderColor
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed pointer-events-none z-[60]"
        animate={{
          x: cursor.x - 4,
          y: cursor.y - 4,
          scale: variants[cursor.variant].inner.scale
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          mass: 0.5
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{
            backgroundColor: variants[cursor.variant].inner.backgroundColor
          }}
        />
      </motion.div>

      <style jsx global>{`
        ${shouldShowCursor() ? `
          body {
            cursor: none;
          }

          a, button, [role="button"] {
            cursor: none;
          }
        ` : ''}

        @media (max-width: 768px) {
          body, a, button, [role="button"] {
            cursor: auto;
          }
        }
      `}</style>
    </>
  )
}
