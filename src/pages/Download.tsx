import { Terminal, MessageCircle } from 'lucide-react'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-emerald-400/10 rounded-2xl flex items-center justify-center">
            <Terminal className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome to CMP v2.0
          </h1>
          <p className="text-zinc-400 text-lg">
            Watch the video below to get started and grab your download.
          </p>
        </div>

        {/* Loom Video Embed - Full Width */}
        <div className="mb-10">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.loom.com/embed/648ddbfb3dab476396d941ee0381064b"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl border border-zinc-800"
            />
          </div>
        </div>

        {/* Discord CTA */}
        <div className="text-center space-y-6">
          <p className="text-zinc-400">
            Join the Discord to get your download link and connect with the community.
          </p>

          <a
            href="https://discord.gg/9t4XV78EnK"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors glow"
          >
            <MessageCircle className="w-5 h-5" />
            Join Discord & Get CMP
          </a>

          <div className="text-sm text-zinc-500">
            <p>Need help? Contact us at justinlord@empusaai.com</p>
          </div>
        </div>

        <a
          href="/"
          className="block text-center mt-10 text-emerald-400 hover:text-emerald-300 font-mono text-sm"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
