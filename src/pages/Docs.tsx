import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Terminal, Cloud, Webhook, Settings, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CodeBlock from '../components/CodeBlock'

const sections = [
  { id: 'getting-started', title: 'Getting Started', icon: Home },
  { id: 'basic-commands', title: 'Basic Commands', icon: Terminal },
  { id: 'cloud-sync', title: 'Cloud Sync', icon: Cloud },
  { id: 'webhooks', title: 'Webhooks & Agents', icon: Webhook },
  { id: 'configuration', title: 'Configuration', icon: Settings },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* CINEMATIC FILM GRAIN */}
      <div className="z-0 fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.a
              href="/"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </motion.a>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-32 space-y-1">
                  <div className="label mb-6">DOCUMENTATION</div>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-mono text-sm ${
                        activeSection === section.id
                          ? 'bg-zinc-900/50 text-white border border-white/10'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30 border border-transparent'
                      }`}
                    >
                      <section.icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </button>
                  ))}
                </div>
              </motion.aside>

              {/* Content */}
              <motion.main
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="prose prose-invert prose-zinc max-w-none">
                  {activeSection === 'getting-started' && <GettingStarted />}
                  {activeSection === 'basic-commands' && <BasicCommands />}
                  {activeSection === 'cloud-sync' && <CloudSync />}
                  {activeSection === 'webhooks' && <Webhooks />}
                  {activeSection === 'configuration' && <Configuration />}
                </div>
              </motion.main>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

function GettingStarted() {
  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">Getting Started</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Install CMP and generate your first context map in under 60 seconds.
      </p>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Installation</h2>
      
      <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Windows (PowerShell)</h3>
      <CodeBlock
        code="irm https://raw.githubusercontent.com/empusaai/cmp/main/install.ps1 | iex"
        language="powershell"
      />

      <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Linux/macOS</h3>
      <CodeBlock
        code="curl -fsSL https://raw.githubusercontent.com/empusaai/cmp/main/install.sh | bash"
        language="bash"
      />

      <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">Build from Source</h3>
      <CodeBlock
        code={`git clone https://github.com/empusaai/cmp.git
cd cmp/cmp
cargo build --release
cargo install --path .`}
        language="bash"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Quick Start</h2>
      <p className="text-zinc-400 mb-4">
        Navigate to your project directory and run:
      </p>
      <CodeBlock
        code={`# Generate skeleton map (lightweight)
cmp map

# Copy to clipboard
cmp copy

# Generate full source context
cmp source`}
        language="bash"
      />
    </>
  )
}

function BasicCommands() {
  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">Basic Commands</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Core CMP commands for context generation and management.
      </p>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">cmp map</h2>
      <p className="text-zinc-400 mb-4">
        Generate a skeleton map of your repository. Extracts imports and function signatures only.
      </p>
      <CodeBlock code="cmp map" language="bash" />
      <div className="border border-white/10 rounded-lg p-4 mt-4 bg-zinc-900/20">
        <p className="text-sm text-zinc-300 font-mono">
          💡 Skeleton maps use 90% fewer tokens than full source dumps.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">cmp source</h2>
      <p className="text-zinc-400 mb-4">
        Generate full source context with complete file contents.
      </p>
      <CodeBlock code="cmp source" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">cmp copy</h2>
      <p className="text-zinc-400 mb-4">
        Copy context to clipboard with token budget warnings.
      </p>
      <CodeBlock code="cmp copy" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">cmp watch</h2>
      <p className="text-zinc-400 mb-4">
        Live watch mode - auto-update maps as you code.
      </p>
      <CodeBlock code="cmp watch" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">cmp sync</h2>
      <p className="text-zinc-400 mb-4">
        Incremental sync - only push what changed.
      </p>
      <CodeBlock code="cmp sync" language="bash" />
    </>
  )
}

function CloudSync() {
  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">Cloud Sync</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Sync your context to UltraContext cloud for version control and agent access.
      </p>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Setup</h2>
      <p className="text-zinc-400 mb-4">
        First, get your API key from <a href="https://ultracontext.ai" className="text-emerald-400 hover:underline">ultracontext.ai</a>
      </p>
      <CodeBlock
        code={`# Set environment variable
export ULTRA_CONTEXT=uc_live_your_api_key_here

# Or use .env.local
echo "ULTRA_CONTEXT=uc_live_your_api_key_here" > .env.local`}
        language="bash"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Initialize</h2>
      <CodeBlock code="cmp init --cloud" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Push Context</h2>
      <p className="text-zinc-400 mb-4">
        Push your context to the cloud. This automatically notifies registered AI agents.
      </p>
      <CodeBlock code="cmp push" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Pull Context</h2>
      <CodeBlock code="cmp pull" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Version History</h2>
      <CodeBlock code="cmp history" language="bash" />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Context Branching</h2>
      <p className="text-zinc-400 mb-4">
        Create isolated context branches for different features or experiments.
      </p>
      <CodeBlock
        code={`# Create branch
cmp branch feature-auth

# Compare versions
cmp diff v1 v2`}
        language="bash"
      />
    </>
  )
}

function Webhooks() {
  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">Webhooks & Agents</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Register AI agents to receive automatic notifications when context updates.
      </p>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Register Agent</h2>
      <CodeBlock
        code={`# Add agent with webhook
cmp agents add my-bot -t custom --webhook http://localhost:8080/webhook

# List all agents
cmp agents list

# Enable/disable agent
cmp agents enable <id>
cmp agents disable <id>

# Remove agent
cmp agents remove <id>`}
        language="bash"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Webhook Server Example</h2>
      <p className="text-zinc-400 mb-4">
        Create a simple webhook server to receive context updates:
      </p>
      <CodeBlock
        code={`from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.json
    print(f"Context updated: {payload['context_id']}")
    print(f"Changes: +{len(payload['changes']['added'])} "
          f"~{len(payload['changes']['modified'])} "
          f"-{len(payload['changes']['deleted'])}")
    return jsonify({'status': 'success'})

app.run(port=8080)`}
        language="python"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Manual Notification</h2>
      <CodeBlock code="cmp notify" language="bash" />
    </>
  )
}

function Configuration() {
  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-100 mb-4">Configuration</h1>
      <p className="text-xl text-zinc-400 mb-8">
        Customize CMP behavior with .cmpignore files and environment variables.
      </p>

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">.cmpignore</h2>
      <p className="text-zinc-400 mb-4">
        Similar to .gitignore, exclude files and directories from context generation:
      </p>
      <CodeBlock
        code={`# .cmpignore
node_modules/
*.log
dist/
build/
.env
*.test.ts
coverage/`}
        language="gitignore"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Environment Variables</h2>
      <CodeBlock
        code={`# UltraContext API Key
ULTRA_CONTEXT=uc_live_your_api_key_here

# Custom ignore patterns
CMP_IGNORE="*.log,dist/,build/"

# Token budget warning threshold
CMP_TOKEN_LIMIT=8000`}
        language="bash"
      />

      <h2 className="text-2xl font-bold text-zinc-100 mt-12 mb-4">Export Formats</h2>
      <p className="text-zinc-400 mb-4">
        Export context in different formats for custom integrations:
      </p>
      <CodeBlock
        code={`# Export as JSON
cmp export json -o context.json

# Export as Markdown
cmp export markdown -o context.md

# Export as XML
cmp export xml -o context.xml`}
        language="bash"
      />
    </>
  )
}
