import { Sparkles } from 'lucide-react'

export default function Goo() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Something New is Coming</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          This is your new Goo component. It is ready for whatever logic or 
          cool visuals you want to add to the landing page.
        </p>
      </div>
    </section>
  )
}