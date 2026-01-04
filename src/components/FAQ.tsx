import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Why should I pay $29.70 when I can use free scripts?',
    a: `Fair question. Here's the deal: Free scripts break. They don't update. They hallucinate paths because they dump code instead of mapping structure. CMP is a compiled Rust binary—fast, deterministic, zero hallucinations. You get lifetime updates, and yes, you get the source code. Build it yourself if you want. We're not hiding anything.`
  },
  {
    q: 'Is my code safe?',
    a: `100% local. No API calls. No telemetry. No "anonymous usage data." Your code never leaves your machine. Ever. Run it air-gapped if you're paranoid. We respect that.`
  },
  {
    q: 'Why not just use Repomix or Aider?',
    a: `They dump your entire codebase as text and burn through your token limit. CMP is different—it maps your project structure and dependencies mathematically. You get a compressed, intelligent context injection that actually fits in the window. Less tokens, more signal.`
  },
  {
    q: 'What if it stops working?',
    a: `You own the binary. You own the source. It's yours forever. No subscription to cancel, no server to shut down, no "we're pivoting to enterprise" email. It runs on your machine. If we disappear tomorrow, CMP still works.`
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 text-center mb-2">
          No-BS FAQ
        </h2>
        <p className="text-zinc-500 text-center mb-12">
          The questions you're actually thinking.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-zinc-100 pr-4">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-zinc-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} 
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
