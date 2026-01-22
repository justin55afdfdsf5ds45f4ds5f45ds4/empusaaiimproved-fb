import { Check, Terminal, RefreshCw, Package, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const features = [
  { icon: Terminal, text: 'Rust Binary' },
  { icon: Package, text: 'CLI Tool' },
  { icon: RefreshCw, text: 'Free Updates' },
]

function CompactTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cmp-discount-timer')
    if (saved) {
      const remaining = parseInt(saved) - Date.now()
      if (remaining > 0) {
        setTimeLeft(remaining)
      } else {
        setExpired(true)
      }
    } else {
      const fourHours = 4 * 60 * 60 * 1000
      const expiresAt = Date.now() + fourHours
      localStorage.setItem('cmp-discount-timer', String(expiresAt))
      setTimeLeft(fourHours)
    }
  }, [])

  useEffect(() => {
    if (timeLeft === null || expired) return

    const interval = setInterval(() => {
      const saved = localStorage.getItem('cmp-discount-timer')
      if (saved) {
        const remaining = parseInt(saved) - Date.now()
        if (remaining > 0) {
          setTimeLeft(remaining)
        } else {
          setExpired(true)
          setTimeLeft(0)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, expired])

  const hours = Math.floor((timeLeft || 0) / (1000 * 60 * 60))
  const minutes = Math.floor(((timeLeft || 0) % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor(((timeLeft || 0) % (1000 * 60)) / 1000)
  const pad = (n: number) => n.toString().padStart(2, '0')

  if (expired) {
    return (
      <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs">
        <Sparkles className="w-3 h-3" />
        <span className="font-mono">Discount available anytime</span>
      </div>
    )
  }

  if (timeLeft === null) return null

  return (
    <div className="flex items-center justify-center gap-1 font-mono text-white text-sm tabular-nums">
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 relative bg-[#030303]">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="label mb-4">
            07 // PRICING
          </div>
          <h2 className="section-header">
            Stop fighting the context window.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            One purchase. Lifetime access. No subscriptions.
          </p>
        </motion.div>

        {/* Compact Ticket Stub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="relative glass rounded-xl p-6 grain">
            {/* Christmas badge */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <div className="label text-white">
                🎄 CHRISTMAS SPECIAL
              </div>
              <CompactTimer />
            </div>

            {/* Pricing */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg text-zinc-600 line-through font-mono">$99</span>
                  <span className="text-5xl font-black text-white tracking-tight">
                    $29.70
                  </span>
                </div>
                <div className="text-zinc-400 font-mono text-xs">
                  Save $69.30 (70% off)
                </div>
              </div>

            {/* Features */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-zinc-400">
                  <feature.icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-xs">{feature.text}</span>
                </div>
              ))}
            </div>

              {/* CTA */}
              <a
                href="https://www.paypal.com/ncp/payment/PENSKE7YSYK5A"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hollow w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold"
            >
              <Check className="w-4 h-4" />
              Get Access Now
            </a>

            <p className="mt-3 text-center text-xs text-zinc-600">
              Instant download • macOS, Linux, Windows
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
