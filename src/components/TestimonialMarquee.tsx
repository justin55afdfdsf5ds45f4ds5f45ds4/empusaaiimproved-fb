import { motion } from 'framer-motion'
import { useState } from 'react'

const testimonials = [
  { text: "Shipped 3x faster with perfect context. No more copy-paste hell.", author: "@sarah_dev" },
  { text: "Context rot is completely gone. My AI actually remembers my codebase.", author: "@mike_codes" },
  { text: "Finally, a CLI that just works. Token savings are insane.", author: "@alex_tech" },
  { text: "Best tool of 2026. Saved me 10 hours this week alone.", author: "@emma_builds" },
  { text: "No more hallucinations. AI understands my code perfectly now.", author: "@john_dev" },
  { text: "Game changer for our team. Productivity through the roof.", author: "@lisa_ai" },
  { text: "This is the future of AI development. Clean, fast, perfect.", author: "@tom_engineer" },
  { text: "Worth every penny. Instant context with zero friction.", author: "@kate_dev" },
]

export default function TestimonialMarquee() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="label mb-4">05 // ORBITAL TRANSMISSIONS</div>
        <h2 className="text-3xl font-medium tracking-tight text-white mb-8">
          Developers are shipping faster
        </h2>
      </div>
      
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Scrolling track */}
      <div className="relative">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 marquee-scroll"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[400px] h-[200px] bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-lg p-6 cursor-default relative"
            >
              {/* Tech Corner - Top Left */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-white/30" />
              
              {/* Tech Corner - Bottom Right */}
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-white/30" />
              
              <div className="flex flex-col h-full justify-between">
                <p className="text-sm text-white leading-relaxed">"{testimonial.text}"</p>
                <p className="text-xs text-zinc-500 font-mono">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
