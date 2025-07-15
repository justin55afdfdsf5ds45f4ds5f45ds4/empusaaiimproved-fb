"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="relative group px-3 py-2"
  >
    <span className="relative z-10 text-gray-700 group-hover:text-[#E60023] transition-colors">
      {children}
    </span>
    <motion.span
      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E60023] rounded-full"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  </Link>
)

export const ModernHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.98)"]
  )

  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)"]
  )

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", updateScroll)
    return () => window.removeEventListener("scroll", updateScroll)
  }, [])

  return (
    <motion.header
      style={{
        backgroundColor: headerBackground,
        borderColor: headerBorder,
      }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-sm transition-shadow duration-300
        border-b
        ${isScrolled ? "shadow-sm" : ""}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              data-cursor-label="Sign In"
              className="text-gray-700 hover:text-[#E60023] transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              data-cursor-label="Get Started"
              className="bg-[#E60023] hover:bg-[#ad081b] text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/book-demo"
              className="text-gray-700 hover:text-[#E60023] transition-colors font-medium hidden md:block"
            >
              Book a demo →
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
