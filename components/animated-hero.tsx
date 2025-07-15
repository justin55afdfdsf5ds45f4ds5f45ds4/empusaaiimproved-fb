"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ReactNode } from "react"
import { Zap, Target, RefreshCw } from "lucide-react"

interface FloatingPinProps {
  delay?: number
  scale?: number
  className?: string
}

interface GradientTextProps {
  children: ReactNode
  className?: string
}

interface StatsCardProps {
  icon: React.ElementType
  value: string
  label: string
  gradient: string
  delay: number
}

const FloatingPin = ({ delay = 0, scale = 1, className = "" }: FloatingPinProps) => (
  <motion.div
    initial={{ y: 0, opacity: 0, scale: 0.8 }}
    animate={{ 
      y: [-20, 0, -20],
      opacity: [0, 1, 1],
      scale: [0.8, scale, scale]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
  >
    <div className="relative aspect-[2/3] w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5 }}
        className="absolute bottom-2 left-2 right-2 h-12 bg-white rounded-lg p-2"
      >
        <div className="w-2/3 h-2 bg-gray-200 rounded mb-1" />
        <div className="w-1/2 h-2 bg-gray-200 rounded" />
      </motion.div>
    </div>
  </motion.div>
)

const GradientText = ({ children, className = "" }: GradientTextProps) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500">
      {children}
    </span>
    <motion.span
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute bottom-0 left-0 h-[6px] bg-gradient-to-r from-violet-600/30 via-pink-500/30 to-orange-500/30 rounded-full"
    />
  </span>
)

const StatsCard = ({ icon: Icon, value, label, gradient, delay }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative"
  >
    <div className="absolute inset-0.5 rounded-3xl bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 opacity-75 blur-lg group-hover:opacity-100 transition duration-500" />
    <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 h-full flex flex-col items-center justify-center transition duration-500 group-hover:transform group-hover:scale-[1.01]">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 rounded-xl blur opacity-25" />
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 p-[1px]">
          <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
            <Icon className="w-8 h-8 text-pink-500" />
          </div>
        </div>
      </div>
      <h3 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
        {value}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
        {label}
      </p>
    </div>
  </motion.div>
)

export const AnimatedHero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="block text-gray-900 dark:text-white mb-4">Dominate</span>
              <GradientText className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
                Pinterest
              </GradientText>
              <span className="block text-gray-900 dark:text-white mt-4">with AI-Generated Content</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Empusa AI automatically creates and publishes SEO-optimized Pinterest content from any URL, helping brands and creators save time and boost engagement.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <StatsCard
              icon={Zap}
              value="10x"
              label="Faster Content Creation"
              gradient="from-violet-600 to-pink-500"
              delay={0.3}
            />
            <StatsCard
              icon={Target}
              value="450M+"
              label="Pinterest Users Reached"
              gradient="from-pink-500 to-orange-500"
              delay={0.4}
            />
            <StatsCard
              icon={RefreshCw}
              value="24/7"
              label="Automated Publishing"
              gradient="from-orange-500 to-violet-600"
              delay={0.5}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 