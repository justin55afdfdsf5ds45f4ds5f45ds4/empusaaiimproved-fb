import { motion } from 'framer-motion'
import { Terminal, Cloud, Webhook, Sparkles } from 'lucide-react'

const nodes = [
  {
    icon: Terminal,
    title: 'Developer',
    command: '$ cmp map',
  },
  {
    icon: Sparkles,
    title: 'CMP Engine',
    command: '90% reduction',
  },
  {
    icon: Cloud,
    title: 'UltraContext',
    command: '$ cmp push',
  },
  {
    icon: Webhook,
    title: 'AI Agents',
    command: 'Auto-notified',
  },
]

export default function FlowDiagram() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#030303]">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="label mb-4">
            05 // THE PROTOCOL
          </div>
          <h2 className="section-header">
            How It Works
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            Three steps. Zero friction. Total recall.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {nodes.map((node, index) => (
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
                  <node.icon 
                    className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-500" 
                    strokeWidth={0.5}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <node.icon 
                      className="w-8 h-8 text-zinc-400 group-hover:text-white transition-all duration-500 mx-auto mb-4" 
                      strokeWidth={1.5}
                    />
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                      {node.title}
                    </h3>
                    <div className="font-mono text-xs text-zinc-400 px-3 py-1.5 border border-white/10 rounded-lg inline-block">
                      {node.command}
                    </div>
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
