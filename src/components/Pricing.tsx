import { Check, Terminal, RefreshCw, Package } from 'lucide-react'

const features = [
  { icon: Terminal, text: 'Rust Binary' },
  { icon: Package, text: 'CLI Tool' },
  { icon: RefreshCw, text: 'Free Updates' },
]

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
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl sm:text-6xl font-bold text-zinc-100">$49</span>
              <span className="text-zinc-500 text-lg">one-time</span>
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
