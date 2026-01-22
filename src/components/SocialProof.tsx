import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

export default function SocialProof() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-white/5 via-white/5 to-white/5 rounded-3xl blur-3xl" />
          <div className="relative glass rounded-3xl p-16 border-2 border-zinc-800">
            <Quote className="absolute top-8 left-8 w-20 h-20 text-white/10" />
            
            <div className="flex items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-white text-white" />
              ))}
            </div>

            <blockquote className="relative z-10">
              <p className="text-3xl sm:text-4xl text-zinc-200 leading-relaxed mb-10 font-light tracking-tight">
                "The problem is the{' '}
                <span className="text-white font-medium">'mountain of noise'</span>{' '}
                that builds up... My local script just automates the process of dumping that noise...{' '}
                <span className="text-white font-medium">The fog lifted.</span>"
              </p>
              
              <footer className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-white to-zinc-400 rounded-full flex items-center justify-center">
                  <span className="font-mono text-white font-black text-xl">tq</span>
                </div>
                <div>
                  <div className="font-bold text-white text-xl">tqwhite2</div>
                  <div className="text-sm text-zinc-500 uppercase tracking-wider">Senior Developer (Reddit)</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
