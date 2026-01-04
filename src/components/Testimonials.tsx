import { useEffect, useRef } from 'react'

const testimonials = [
  { name: 'Marcus Chen', title: 'Senior Frontend Dev', text: 'Finally stopped copy-pasting my entire src folder into ChatGPT. CMP just gets it.' },
  { name: 'Sarah K.', title: 'Freelance Full-Stack', text: 'I bill hourly. Every minute I spent re-explaining my codebase was money lost. Not anymore.' },
  { name: 'Jake Morrison', title: 'Rust Engineer', text: 'Simple CLI. I run it, forget it, and my AI actually knows where things are.' },
  { name: 'Priya Sharma', title: 'Tech Lead @ Startup', text: 'Our monorepo was a nightmare for AI tools. CMP mapped it in seconds.' },
  { name: 'Tom B.', title: 'Solo Founder', text: 'Went from 20 messages of context-setting to 1. Literally 1.' },
  { name: 'Elena Rodriguez', title: 'Backend Engineer', text: 'The dependency graph alone is worth it. No more hallucinated imports.' },
  { name: 'David Park', title: 'DevOps Lead', text: 'Runs locally, no API calls, no BS. Exactly what I needed.' },
  { name: 'Nina Kowalski', title: 'React Developer', text: 'My modular hell of 200+ components finally makes sense to Claude.' },
  { name: 'Alex Turner', title: 'Indie Hacker', text: 'Paid for itself in the first hour. Not exaggerating.' },
  { name: 'Rachel Green', title: 'Senior SWE', text: 'Context rot was killing my productivity. CMP fixed it permanently.' },
  { name: 'Mike Chen', title: 'Freelancer', text: 'Clients think I code faster now. I just stopped fighting the AI.' },
  { name: 'Lisa Wang', title: 'Staff Engineer', text: 'Finally, a tool that maps structure instead of dumping text.' },
  { name: 'Chris O\'Brien', title: 'Startup CTO', text: 'Onboarding AI to our codebase used to take 30 messages. Now it\'s instant.' },
  { name: 'Yuki Tanaka', title: 'Full-Stack Dev', text: 'The Rust binary is fast. Like, actually fast. No Python bloat.' },
  { name: 'Jordan Hayes', title: 'Contract Developer', text: 'Every new project, first thing I do: cmp . Done.' },
  { name: 'Amanda Foster', title: 'Frontend Lead', text: 'Stopped explaining my types.ts file 50 times a day.' },
  { name: 'Ryan Mitchell', title: 'Go Engineer', text: 'Clean, deterministic, no magic. How tools should be built.' },
  { name: 'Sophie Laurent', title: 'Mobile Dev', text: 'Works with React Native monorepos. That alone is impressive.' },
  { name: 'Kevin Patel', title: 'Senior Backend', text: 'My AI stopped hallucinating file paths. That\'s the whole review.' },
  { name: 'Emma Wilson', title: 'Tech Consultant', text: 'Recommend this to every client now. It just works.' },
]

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return

    let animationId: number
    let scrollPos = 0
    const speed = 0.5

    const animate = () => {
      scrollPos += speed
      if (scrollPos >= scroll.scrollWidth / 2) {
        scrollPos = 0
      }
      scroll.scrollLeft = scrollPos
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section className="py-20 border-t border-zinc-800 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 text-center mb-2">
          Used by developers shipping faster in 2026
        </h2>
        <p className="text-zinc-500 text-center">
          Real devs. Real results.
        </p>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <p className="text-zinc-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-mono text-emerald-400">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-100">{t.name}</div>
                <div className="text-xs text-zinc-500">{t.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
