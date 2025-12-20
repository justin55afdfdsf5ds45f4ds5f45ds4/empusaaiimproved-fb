import { Quote } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12">
          <Quote className="absolute top-6 left-6 w-12 h-12 text-emerald-400/20" />
          <blockquote className="relative z-10">
            <p className="text-xl sm:text-2xl text-zinc-200 leading-relaxed mb-6 font-light">
              "The problem is the{' '}
              <span className="text-emerald-400 font-medium">'mountain of noise'</span>{' '}
              that builds up... My local script just automates the process of dumping that noise...{' '}
              <span className="text-emerald-400 font-medium">The fog lifted.</span>"
            </p>
            <footer className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="font-mono text-emerald-400 font-semibold">tq</span>
              </div>
              <div>
                <div className="font-semibold text-zinc-100">tqwhite2</div>
                <div className="text-sm text-zinc-500">Senior Developer (Reddit)</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
