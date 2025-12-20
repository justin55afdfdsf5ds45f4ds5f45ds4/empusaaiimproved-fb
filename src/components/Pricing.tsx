import { Check, Terminal, RefreshCw, Package, Clock, Gift, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

const features = [
  { icon: Terminal, text: 'Rust Binary' },
  { icon: Package, text: 'CLI Tool' },
  { icon: RefreshCw, text: 'Free Updates' },
]

function CountdownTimer() {
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
      <div className="flex items-center justify-center gap-2 text-emerald-400">
        <Sparkles className="w-5 h-5" />
        <span className="font-medium">We've reserved your discount — claim it anytime.</span>
        <Sparkles className="w-5 h-5" />
      </div>
    )
  }

  if (timeLeft === null) return null

  return (
    <div className="flex items-center justify-center gap-2 font-mono text-lg">
      <div className="bg-zinc-800 px-3 py-2 rounded">{pad(hours)}</div>
      <span className="text-emerald-400">:</span>
      <div className="bg-zinc-800 px-3 py-2 rounded">{pad(minutes)}</div>
      <span className="text-emerald-400">:</span>
      <div className="bg-zinc-800 px-3 py-2 rounded">{pad(seconds)}</div>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
          Stop fighting the context window.
        </h2>
        <p className="text-zinc-400 text-lg mb-12">
          One purchase. Lifetime access. No subscriptions.
        </p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12">
          {/* Christmas Discount Banner */}
          <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-3">
              <Gift className="w-5 h-5" />
              <span className="font-mono font-semibold">🎄 CHRISTMAS SPECIAL — 70% OFF</span>
              <Gift className="w-5 h-5" />
            </div>
            <CountdownTimer />
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-2xl text-zinc-500 line-through">$99.00</span>
              <span className="text-5xl sm:text-6xl font-bold text-emerald-400">$29.70</span>
              <span className="text-zinc-500 text-lg">USD</span>
            </div>
            <div className="mt-2 text-sm text-emerald-400/80">
              You save $69.30 (70% off)
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-zinc-300">
                <feature.icon className="w-5 h-5 text-emerald-400" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
          <a
            href="https://www.paypal.com/ncp/payment/PENSKE7YSYK5A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow"
          >
            <Check className="w-5 h-5" />
            Get Access Now
          </a>
          <p className="mt-6 text-sm text-zinc-500">
            Instant download. Works on macOS, Linux, and Windows.
          </p>
        </div>
      </div>
    </section>
  )
}
