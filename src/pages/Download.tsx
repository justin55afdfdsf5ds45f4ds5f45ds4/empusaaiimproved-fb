import { Download, CheckCircle, Terminal, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function DownloadPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleDownload = () => {
    setFormSubmitted(true)
    // Trigger download after short delay
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/CMP.zip'
      link.download = 'CMP.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-emerald-400/10 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Thank you for your purchase!
          </h1>
          <p className="text-zinc-400 text-lg">
            {formSubmitted 
              ? "Your download has started. Join our Discord for support!"
              : "Quick step: Fill out the form below to get your download."}
          </p>
        </div>

        {!formSubmitted ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span className="font-mono text-xl text-zinc-100">CMP v1.0</span>
            </div>
            
            <div className="mb-6 rounded-lg overflow-hidden">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSe6mc37OxOw2TMKWTZuKr92IX0Sb2eP0lQwX39PsyZdoQKFbA/viewform?embedded=true"
                width="100%"
                height="500"
                frameBorder="0"
                className="bg-white rounded-lg"
              >
                Loading…
              </iframe>
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow w-full justify-center"
            >
              <Download className="w-5 h-5" />
              I've Submitted — Download CMP
            </button>
            
            <p className="mt-4 text-sm text-zinc-500">
              Includes Rust binary for macOS, Linux, and Windows
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <span className="font-mono text-xl text-zinc-100">CMP v1.0</span>
            </div>

            <p className="text-zinc-400 mb-6">Download didn't start? Click below:</p>
            
            <a
              href="/CMP.zip"
              download
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow w-full justify-center mb-4"
            >
              <Download className="w-5 h-5" />
              Download CMP Again
            </a>

            <a
              href="https://discord.gg/9t4XV78EnK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-mono font-medium text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors w-full justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Join Discord Support
            </a>
            
            <p className="mt-4 text-sm text-zinc-500">
              Includes Rust binary for macOS, Linux, and Windows
            </p>
          </div>
        )}

        <div className="text-sm text-zinc-500">
          <p>Need help? Contact us at justinlord@empusaai.com</p>
        </div>

        <a
          href="/"
          className="inline-block mt-8 text-emerald-400 hover:text-emerald-300 font-mono text-sm"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
