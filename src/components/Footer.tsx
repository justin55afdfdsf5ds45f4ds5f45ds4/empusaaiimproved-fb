import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
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
              <span className="text-emerald-400/70">AI</span>
            </span>
            <span className="text-zinc-600 mx-2">·</span>
            <span className="text-sm text-zinc-500">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/justin55afdfdsf5ds45f4ds5f45ds4"
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
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="X"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
