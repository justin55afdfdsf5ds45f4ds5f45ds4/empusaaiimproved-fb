import { Download, Code, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import TypewriterCode from './TypewriterCode'
import HeroBackground from './HeroBackground'

const codeExample = `import { CMP } from 'cmp-cli'

// Generate skeleton map (90% fewer tokens)
await cmp.map()

// Push to cloud, notify AI agents
await cmp.push()

// Your AI gets perfect context
// Zero noise. Zero hallucinations.`

export default function Hero() {
  const [counts, setCounts] = useState({ tokens: 0, rot: 0, accuracy: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounts({
        tokens: Math.floor(90 * progress),
        rot: Math.floor(0 * progress),
        accuracy: Math.floor(100 * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-[#030303]">
      {/* VISIBLE AURORA FLOW - With Graceful Fade */}
      <HeroBackground />
      {/* FOG LAYER 1 - Drifting Left to Right */}
      <motion.div
        className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 600px at 30% 50%, rgba(100, 100, 150, 0.3), transparent)',
        }}
        animate={{
          x: ['-20%', '20%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* FOG LAYER 2 - Drifting Right to Left */}
      <motion.div
        className="absolute inset-0 opacity-30 mix-blend-color-dodge pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 800px at 70% 50%, rgba(80, 120, 140, 0.3), transparent)',
        }}
        animate={{
          x: ['20%', '-20%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* RISING DUST PARTICLES */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear',
          }}
        />
      ))}

      {/* SPOTLIGHT OVERLAY - Mouse Tracking */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05), transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0 }}
              className="label mb-6"
            >
              01 // HERO
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 bg-zinc-900/50 border border-white/5 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span className="label">v1.0 Now Available</span>
            </motion.div>

            {/* METALLIC HEADLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="text-6xl md:text-8xl font-semibold tracking-[-0.03em] leading-tight pb-4 mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
            >
              Stop Explaining Your Codebase.
            </motion.h1>

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl"
            >
              CMP is a blazing-fast context engine that generates token-optimized maps of your repository.{' '}
              <span className="text-zinc-300">Smart scanning, cloud sync, and webhook notifications for AI agents.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12"
            >
              <a
                href="#pricing"
                className="group btn-hollow px-6 py-3 rounded-xl font-mono text-sm font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CLI v1.0
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/docs"
                className="btn-hollow px-6 py-3 rounded-xl font-mono text-sm font-medium flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Read the Docs
              </a>
            </motion.div>

            {/* Stats pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
              className="bg-zinc-900/50 border border-white/5 rounded-full px-6 py-4 inline-flex"
            >
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-white count-up font-mono tracking-hero">
                    {counts.tokens}%
                  </div>
                  <div className="label mt-1">Token Savings</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-black text-white count-up font-mono tracking-hero">
                    {counts.rot}ms
                  </div>
                  <div className="label mt-1">Context Rot</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-black text-white count-up font-mono tracking-hero">
                    {counts.accuracy}%
                  </div>
                  <div className="label mt-1">Accuracy</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Terminal with Scanner Beam */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            className="relative group"
          >
            <div className="relative bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all duration-300 rounded-xl grain overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <span className="label">typescript</span>
              </div>

              {/* HARD LIGHT SCANNER - High Voltage */}
              <motion.div
                className="absolute left-0 right-0 pointer-events-none z-10 mix-blend-overlay"
                style={{ top: '-10%' }}
                animate={{
                  top: ['110%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
              >
                {/* Phosphor Trail */}
                <div className="h-32 w-full bg-gradient-to-t from-cyan-500/40 to-transparent" />
                {/* High Voltage Beam */}
                <div className="h-[3px] w-full bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.8)]" />
              </motion.div>

              <div className="relative z-0">
                <TypewriterCode code={codeExample} language="typescript" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Video section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
          className="mt-24"
        >
          <div className="max-w-5xl mx-auto">
            <div className="label mb-4 text-center">02 // DEMO</div>
            <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all duration-300 grain">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.loom.com/embed/c1b5572cda214eea883b19f04e6f0f98"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
