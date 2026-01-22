import { motion } from 'framer-motion'

export default function BackgroundBeams() {
  const beams = Array.from({ length: 8 })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {beams.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{
            left: `${(i + 1) * 12}%`,
          }}
          animate={{
            y: ['-100%', '200%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}
