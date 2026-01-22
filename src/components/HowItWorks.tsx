import { Search, Layers, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'SCAN',
    description: 'Smart scanning with noise filtering. Extracts only source code, ignoring build artifacts and dependencies.',
  },
  {
    icon: Layers,
    step: '02',
    title: 'OPTIMIZE',
    description: 'Generate skeleton maps (imports + signatures only). Skeleton maps use 90% fewer tokens.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'SYNC',
    description: 'Push to UltraContext cloud. AI agents get webhook notifications on updates.',
  },
]

export default function HowItWorks() {
  return (
    <section id="protocol" className="py-24 px-6 bg-[#030303]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="label mb-4">04 // THE PROTOCOL</div>
            <h2 className="section-header text-center">
              Scan. Optimize. Sync.
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed">
              Deterministic context in three steps.
            </p>
          </motion.div>
        </div>

        {/* CI/CD Pipeline Visual */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                className="group"
              >
                <div className="h-[300px] relative overflow-hidden p-6 bg-zinc-900/30 border border-white/5 hover:border-white/20 transition-all duration-500 rounded-2xl grain text-center">
                  {/* Holographic Wireframe Background */}
                  <step.icon 
                    className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-500" 
                    strokeWidth={0.5}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <step.icon className="w-8 h-8 text-zinc-400 group-hover:text-white transition-all duration-500 mx-auto mb-4" strokeWidth={1.5} />
                    <div className="label mb-2">PHASE {step.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
