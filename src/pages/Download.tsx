import { Download, CheckCircle, Terminal, MessageCircle } from 'lucide-react'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-emerald-400/10 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Thank you for your purchase!
          </h1>
          <p className="text-zinc-400 text-lg">
            Your download is ready. Click below to get CMP.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span className="font-mono text-xl text-zinc-100">CMP v1.0</span>
          </div>
          
          <a
            href="/CMP.zip"
            download
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow w-full justify-center mb-4"
          >
            <Download className="w-5 h-5" />
            Download CMP
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
