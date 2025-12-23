import { Download, BookOpen } from 'lucide-react'
import TerminalVisual from './TerminalVisual'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-zinc-100">Stop Explaining Your Codebase.</span>
            <br />
            <span className="text-emerald-400">Just Build.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed mb-8">
            The AI forgets your architecture after 30 messages. CMP is the deterministic context engine that reinjects your entire project state instantly. Built internally at Empusa AI to solve context rot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="flex items-center gap-2 px-6 py-3 text-base font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow"
            >
              <Download className="w-5 h-5" />
              Download CLI v1.0
            </a>
            <a
              href="#protocol"
              className="flex items-center gap-2 px-6 py-3 text-base font-mono font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Read the Docs
            </a>
          </div>
        </div>
        {/* Loom Video Embed */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.loom.com/embed/c1b5572cda214eea883b19f04e6f0f98"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl border border-zinc-800"
            />
          </div>
        </div>
        <TerminalVisual />
      </div>
    </section>
  )
}
