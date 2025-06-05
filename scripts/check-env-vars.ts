// Script to check environment variable naming compliance
// Run this to verify all environment variables follow Vercel's naming rules

const envVarPattern = /^[a-zA-Z]([a-zA-Z0-9_])+$/

// List of environment variables used in the application
const environmentVariables = [
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "MONGODB_URI",
  "OPENAI_API_KEY",
  "FALAI_API_KEY",
  "AUTH_PINTEREST_ID",
  "AUTH_PINTEREST_SECRET",
  "PINTEREST_REDIRECT_URI",
  "AUTH_URL",
  "AUTH_SECRET",
  "FALAI_MODEL_ID",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "FIRECRAWL_API_KEY",
]

function checkEnvironmentVariables() {
  console.log("🔍 Checking environment variable naming compliance...\n")

  let hasInvalidVars = false

  environmentVariables.forEach((varName) => {
    const isValid = envVarPattern.test(varName)
    const status = isValid ? "✅" : "❌"

    console.log(`${status} ${varName}`)

    if (!isValid) {
      hasInvalidVars = true
      console.log(`   ↳ Invalid: Must match pattern [a-zA-Z]([a-zA-Z0-9_])+`)
    }
  })

  // Check for the problematic "F" variable
  const problematicVars = ["F"]

  problematicVars.forEach((varName) => {
    const isValid = envVarPattern.test(varName)
    if (!isValid) {
      hasInvalidVars = true
      console.log(`❌ ${varName} (REMOVE THIS)`)
      console.log(`   ↳ Invalid: Too short, must be at least 2 characters`)
    }
  })

  console.log("\n" + "=".repeat(50))

  if (hasInvalidVars) {
    console.log("❌ Found invalid environment variables!")
    console.log("📝 Action required: Remove invalid variables from Vercel settings")
  } else {
    console.log("✅ All environment variables are valid!")
  }
}

// Run the check
checkEnvironmentVariables()

export {}
