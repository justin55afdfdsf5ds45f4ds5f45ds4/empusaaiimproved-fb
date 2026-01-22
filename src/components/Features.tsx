import { motion } from 'framer-motion'
import { Zap, Cloud, Webhook, GitBranch, Eye, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Smart Scanning',
    description: 'Only includes actual source code. Auto-ignores build artifacts, assets, and dependencies.',
  },
  {
    icon: GitBranch,
    title: 'Token Optimization',
    description: 'Skeleton maps use 90% fewer tokens. Extract imports and signatures only.',
  },
  {
    icon: Cloud,
    title: 'Cloud Sync',
    description: 'Push/pull context to UltraContext. Version control for your AI context.',
  },
  {
    icon: Webhook,
    title: 'Webhook Notifications',
    description: 'AI agents get notified automatically when context updates. Real-time sync.',
  },
  {
    icon: Eye,
    title: 'Live Watch Mode',
    description: 'Auto-update maps as you code. Incremental sync with only what changed.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track token usage, optimization suggestions, and context history.',
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
      className="group"
    >
      <div className="h-[300px] relative overflow-hidden p-6 bg-zinc-900/30 border border-white/5 hover:border-white/40 transition-all duration-300 rounded-2xl grain">
        {/* Holographic Wireframe Background */}
        <feature.icon 
          className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:text-white/10 transition-all duration-500" 
          strokeWidth={0.5}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <feature.icon 
            className="w-8 h-8 text-zinc-400 mb-4 group-hover:text-white transition-all duration-500" 
            strokeWidth={1.5}
          />
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            {feature.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Flash Effect on Hover */}
        <motion.div
          className="absolute inset-0 border border-white/0 rounded-2xl pointer-events-none"
          whileHover={{
            borderColor: 'rgba(255, 255, 255, 0.4)',
            transition: { duration: 0.1 }
          }}
          animate={{
            borderColor: 'rgba(255, 255, 255, 0)',
            transition: { duration: 0.3, delay: 0.1 }
          }}
        />
      </div>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section className="py-24 px-6 relative bg-[#030303]">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16"
        >
          <div className="label mb-4">
            03 // CORE CAPABILITIES
          </div>
          <h2 className="section-header">
            Built for Modern AI Development
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
            Everything you need to give AI agents perfect context without burning tokens.
          </p>
        </motion.div>

        {/* Standard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
