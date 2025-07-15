"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const generatePins = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    height: Math.floor(Math.random() * 200) + 150,
    delay: Math.random() * 0.5,
  }))
}

export const PinterestGridBg = () => {
  const [pins] = useState(() => generatePins(12))

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="grid grid-cols-4 gap-4 p-4">
        {pins.map((pin) => (
          <motion.div
            key={pin.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: pin.delay,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
            className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-sm"
            style={{ height: pin.height }}
          />
        ))}
      </div>
    </div>
  )
}
