import { Clock, Copy, AlertTriangle } from 'lucide-react'

const problems = [
  {
    icon: Clock,
    title: 'Context Rot.',
    description: 'The model forgets your types.ts or directory structure after 15 minutes.',
    code: 'types.ts',
  },
  {
    icon: Copy,
    title: 'The Manual Grind.',
    description: 'You spend 20% of your coding time copy-pasting files just to remind the AI where things are.',
  },
  {
    icon: AlertTriangle,
    title: 'Hallucinations.',
    description: 'RAG guesses based on "vibes". It misses crucial dependencies. CMP maps them mathematically.',
  },
]

export default function Problem() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
            The Problem
          </h2>
          <p className="text-zinc-400 text-lg">
            Every AI coding session ends the same way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-lg mb-4">
                <problem.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                {problem.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {problem.code ? (
                  <>
                    The model forgets your{' '}
                    <code className="font-mono text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-sm">
                      {problem.code}
                    </code>{' '}
                    or directory structure after 15 minutes.
                  </>
                ) : (
                  problem.description
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
