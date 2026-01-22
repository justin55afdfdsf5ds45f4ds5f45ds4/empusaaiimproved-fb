import { ExternalLink, Book } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
      <nav
        className={`w-full max-w-2xl h-14 px-6 rounded-full transition-all duration-300 flex items-center justify-between ${
          isScrolled
            ? 'bg-[#050505]/90 backdrop-blur-md border border-white/10 shadow-2xl'
            : 'bg-transparent border border-transparent'
        }`}
      >
        {/* LOGO */}
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="https://res.cloudinary.com/dbalp1654/image/upload/v1766221044/cropped_circle_image_fem8gv_yizfl2_ew4kdu.jpg"
            alt="Empusa AI"
            className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/20 transition-all"
          />
          <span className="font-mono text-sm font-bold tracking-tight whitespace-nowrap">
            <span className="text-white">EMPUSAAI</span>
          </span>
        </a>

        {/* NAV LINKS & CTA */}
        <div className="flex items-center gap-4">
          <a
            href="/docs"
            className="hidden md:flex items-center gap-2 text-xs font-mono font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <Book className="w-3.5 h-3.5" />
            Docs
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 text-xs font-mono font-semibold bg-white text-black hover:bg-zinc-200 rounded-lg flex items-center gap-2 transition-all"
          >
            Get CMP
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>
    </div>
  )
}
