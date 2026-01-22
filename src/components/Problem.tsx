import { motion } from 'framer-motion'
import { DollarSign, Copy, AlertTriangle } from 'lucide-react'

const problems = [
  {
    icon: DollarSign,
    title: 'Token Burn',
    description: 'Copying entire codebases wastes tokens ($). Most files are noise - configs, assets, dependencies you don\'t need.',
    stat: '$5/run',
  },
  {
    icon: Copy,
    title: 'Context Rot',
    description: 'Context gets stale as you code. You spend 20% of your time copy-pasting files just to remind the AI where things are.',
    stat: '20%',
  },
  {
    icon: AlertTriangle,
    title: 'RAG Hallucinations',
    description: 'Vector search guesses based on "vibes". It misses crucial dependencies. CMP maps them mathematically.',
    stat: '40%',
  },
]

export default function Problem() {
  return (
    <section className="py-24 px-6 relative bg-[#030303]">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="label mb-4">
            THE PROBLEM
          </div>
          <h2 className="text-3xl font-medium tracking-tight text-white mb-8">
            AI Needs Context, Not Noise
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Traditional methods fail. Here's why.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
              className="group"
            >
              <div className="h-[300px] relative overflow-hidden p-8 bg-zinc-900/30 border border-white/5 hover:border-white/20 transition-all duration-500 rounded-2xl grain">
                {/* Holographic Wireframe Background */}
                <problem.icon 
                  className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-500 group-hover:animate-spin-slow" 
                  strokeWidth={0.5}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <problem.icon className="w-8 h-8 text-zinc-400 group-hover:text-white transition-all duration-500" strokeWidth={1.5} />
                    <div className="text-3xl font-black text-zinc-400 font-mono">
                      {problem.stat}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
