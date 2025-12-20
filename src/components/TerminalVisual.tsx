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
            <div className="text-zinc-500">$ cmp .</div>
            <div className="mt-2 text-emerald-400">
              <span className="text-zinc-500">[</span>
              <span>■■■■■■■■■■</span>
              <span className="text-zinc-500">]</span>
              <span className="ml-2">100%</span>
            </div>
            <div className="mt-2 text-zinc-400">
              <div>→ Scanning repo...</div>
              <div>→ Found 247 files</div>
              <div>→ Mapping dependencies...</div>
              <div className="text-emerald-400 mt-1">✓ Context map generated</div>
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
            <span className="text-xs font-mono text-zinc-500 ml-2">output</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-zinc-500">// Context Injection Report</div>
            <div className="mt-2 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Files mapped:</span>
                <span className="text-emerald-400">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Dependencies:</span>
                <span className="text-emerald-400">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Types resolved:</span>
                <span className="text-emerald-400">156</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Accuracy:</span>
                <span className="text-emerald-400 font-semibold">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
