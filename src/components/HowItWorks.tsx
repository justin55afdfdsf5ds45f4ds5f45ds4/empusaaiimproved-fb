import { Search, Layers, Zap } from 'lucide-react'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'PHASE 01 :: SCAN',
    description: (
      <>
        Executing deep traversal. <code className="font-mono text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-sm">cmp</code> strips the noise (node_modules) and isolates the signal.
      </>
    ),
  },
  {
    icon: Layers,
    step: '02',
    title: 'PHASE 02 :: COMPRESS',
    description: 'Your file hierarchy is tokenized into a deterministic map. We preserve structure, not just text.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'PHASE 03 :: INJECT',
    description: 'The payload is ready. One paste restores full Senior Engineer context instantly.',
  },
]

export default function HowItWorks() {
  return (
    <section id="protocol" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-zinc-100 mb-4">
            // THE PROTOCOL
          </h2>
          <p className="text-zinc-400 text-lg">
            Three phases. Zero friction. Total recall.
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
                <h3 className="text-xl font-bold font-mono text-zinc-100 mb-3">
                  {step.title}
                </h3>
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
