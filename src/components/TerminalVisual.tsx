export default function TerminalVisual() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Terminal */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs font-mono text-zinc-500 ml-2">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-zinc-500">$ cmp map</div>
            <div className="mt-2 text-zinc-400">
              <div>→ Scanning repository...</div>
              <div>→ Found 247 source files</div>
              <div>→ Filtering noise...</div>
              <div>→ Generating skeleton map...</div>
              <div className="text-emerald-400 mt-1">✓ Map generated (2.3k tokens)</div>
            </div>
          </div>
        </div>

        {/* Right Terminal */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs font-mono text-zinc-500 ml-2">cloud sync</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-zinc-500">$ cmp push</div>
            <div className="mt-2 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Syncing to cloud:</span>
                <span className="text-emerald-400">✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Notifying agents:</span>
                <span className="text-emerald-400">2 webhooks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Token savings:</span>
                <span className="text-emerald-400">90%</span>
              </div>
              <div className="text-emerald-400 mt-2">✓ Context synced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
