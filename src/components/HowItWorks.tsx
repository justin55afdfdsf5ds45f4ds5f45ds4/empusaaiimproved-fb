import { Search, GitBranch, Zap } from 'lucide-react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Scan.',
    command: 'cmp .',
    description: 'Scans your repo, ignores node_modules automatically.',
  },
  {
    icon: GitBranch,
    step: '02',
    title: 'Map.',
    command: null,
    description: 'Generates a deterministic dependency graph of your code.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Inject.',
    command: null,
    description: 'You paste the perfect prompt. The AI wakes up with Senior Engineer knowledge of your stack.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 text-lg">
            Three steps. Zero friction.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-zinc-700 to-transparent -translate-x-1/2 z-0" />
              )}
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto flex items-center justify-center bg-zinc-900 border-2 border-emerald-400/30 rounded-2xl mb-6">
                  <step.icon className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="font-mono text-sm text-emerald-400 mb-2">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-3">
                  {step.title}
                </h3>
                {step.command && (
                  <div className="inline-block font-mono text-sm bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg mb-3">
                    <span className="text-zinc-500">$</span>{' '}
                    <span className="text-emerald-400">{step.command}</span>
                  </div>
                )}
                <p className="text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
