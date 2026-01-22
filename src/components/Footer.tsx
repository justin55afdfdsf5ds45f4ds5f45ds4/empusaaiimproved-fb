import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-24 px-6 overflow-hidden bg-[#050505]">
      {/* Liquid Glass Water Surface */}
      <div className="absolute top-0 left-0 right-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* FLOOR GLOW */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />
      
      {/* TECHNICAL GRID */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* UNDERWATER MEGA-TEXT WATERMARK */}
      <div 
        className="absolute bottom-[-5vw] left-1/2 -translate-x-1/2 text-[15vw] font-bold select-none pointer-events-none blur-[2px]"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}
      >
        EMPUSAAI
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="https://res.cloudinary.com/dbalp1654/image/upload/v1766221044/cropped_circle_image_fem8gv_yizfl2_ew4kdu.jpg" 
              alt="Empusa AI" 
              className="w-6 h-6 rounded-full"
            />
            <span className="font-mono text-sm text-zinc-500">
              <span className="text-zinc-400">EMPUSA</span>
              <span className="text-zinc-600"> / </span>
              <span className="text-white/70">AI</span>
            </span>
            <span className="text-zinc-600 mx-2">·</span>
            <span className="text-sm text-zinc-500">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/cmp.git"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/Justin_lords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-xl font-bold"
              aria-label="X"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
