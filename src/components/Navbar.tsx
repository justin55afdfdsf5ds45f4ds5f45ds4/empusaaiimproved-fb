import { ExternalLink } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dbalp1654/image/upload/v1766221044/cropped_circle_image_fem8gv_yizfl2_ew4kdu.jpg" 
              alt="Empusa AI" 
              className="w-8 h-8 rounded-full"
            />
            <span className="font-mono text-lg font-semibold tracking-tight">
              <span className="text-zinc-100">EMPUSA</span>
              <span className="text-zinc-500"> / </span>
              <span className="text-emerald-400">AI</span>
            </span>
          </div>
          <a
            href="#pricing"
            className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
          >
            Get CMP
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  )
}
