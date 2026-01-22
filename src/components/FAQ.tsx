import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'What is CMP?',
    answer: 'CMP (Context Memory Protocol) is a blazing-fast context engine that generates token-optimized maps of your repository. It eliminates context rot by providing AI agents with perfect, deterministic context.',
  },
  {
    question: 'How does it reduce tokens by 90%?',
    answer: 'CMP uses skeleton mapping to extract only imports and function signatures, ignoring implementation details. This drastically reduces token count while preserving structural context.',
  },
  {
    question: 'Does it work with my IDE?',
    answer: 'CMP is a CLI tool that works with any IDE or editor. Simply run `cmp map` in your project directory and copy the output to your AI assistant.',
  },
  {
    question: 'What is UltraContext cloud sync?',
    answer: 'UltraContext is our cloud platform for storing and versioning your context maps. It enables webhook notifications to AI agents and provides version control for your context.',
  },
  {
    question: 'Is my code secure?',
    answer: 'Yes. CMP runs locally on your machine. Cloud sync is optional and uses end-to-end encryption. Your code never leaves your control unless you explicitly push to UltraContext.',
  },
  {
    question: 'What languages are supported?',
    answer: 'CMP supports all major programming languages including TypeScript, JavaScript, Python, Rust, Go, Java, C++, and more. Language detection is automatic.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`border-b transition-all ${isOpen ? 'border-white/10 bg-cyan-500/5 px-4 -mx-4' : 'border-white/10'}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-base font-medium text-white tracking-tight transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-400 leading-relaxed pb-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section className="py-24 px-6 relative bg-[#030303]">
      <div className="max-w-3xl mx-auto">
        <div className="label mb-4">
          06 // SYSTEM DIAGNOSTICS
        </div>
        <h2 className="section-header">
          Frequently Asked Questions
        </h2>
        <div className="border-t border-white/10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
