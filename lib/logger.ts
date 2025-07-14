// A lightweight debug logger that outputs structured messages.
// Usage: logDebug('PinterestConnect', { step: 'start', state, redirectUri })
// Logs only in development by default, or when ENABLE_PINTEREST_DEBUG=true in env.

export function logDebug(label: string, data: Record<string, unknown>) {
  const shouldLog = process.env.NODE_ENV === "development" || process.env.ENABLE_PINTEREST_DEBUG === "true"
  if (!shouldLog) return
  const timestamp = new Date().toISOString()
  // Avoid logging any tokens or secrets inadvertently
  const sanitized = JSON.parse(JSON.stringify(data, (_key, value) => {
    if (typeof value === "string" && value.length > 150) {
      return value.slice(0, 150) + "…"
    }
    return value
  }))
  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] [${label}]`, sanitized)
} 