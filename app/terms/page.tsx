import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">E</div>
              <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">A</div>
              <span className="ml-2 font-bold text-xl">Empusa AI</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium hover:text-teal-600">Features</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-teal-600">Pricing</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-teal-600">Blog</Link>
            <Link href="/about" className="text-sm font-medium hover:text-teal-600">About</Link>
          </div>
          <Link href="https://calendly.com/fk146543/30min" target="_blank">
            <Button className="bg-teal-600 hover:bg-teal-700">Grab a demo</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50">
          <div className="container px-4 md:px-6 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-bold">Terms of Service</h1>
            <p className="text-gray-500 md:text-xl mt-2">Last updated: {new Date().toLocaleDateString("en-US", {year:"numeric",month:"long",day:"numeric"})}</p>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto prose">
            <p>Welcome to Empusa AI! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using Empusa AI, you agree to be bound by these Terms.</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By creating an account or using any part of the Service, you accept and agree to these Terms and our <Link href="/privacy">Privacy&nbsp;Policy</Link>. If you do not agree, you may not use the Service.</p>

            <h2>2. Free Trial &amp; Subscription</h2>
            <p>Empusa AI offers a limited free trial. Continued access to premium features requires a paid subscription as described on our <Link href="/pricing">Pricing</Link> page. Fees are non-refundable except as required by law.</p>

            <h2>3. Your Responsibilities</h2>
            <ul>
              <li>Provide accurate account information and keep it up-to-date.</li>
              <li>Safeguard your password and account access.</li>
              <li>Ensure that content you generate or publish complies with all applicable laws and Pinterest policies.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>The Empusa AI platform, including all software, visuals, and trademarks, is our property. Subject to these Terms, we grant you a limited, non-exclusive, revocable license to use the Service.</p>

            <h2>5. Termination</h2>
            <p>We may suspend or terminate your account at any time for misuse, non-payment, or violations of these Terms.</p>

            <h2>6. Disclaimers</h2>
            <p>The Service is provided “as-is.” We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.</p>

            <h2>7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Empusa AI shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the Service.</p>

            <h2>8. Changes to Terms</h2>
            <p>We may update these Terms occasionally. Material changes will be notified via email or within the Service. Continued use constitutes acceptance of the revised Terms.</p>

            <h2>9. Contact</h2>
            <p>If you have questions about these Terms, contact us at <a href="mailto:justinlord@empusaai.com">justinlord@empusaai.com</a>.</p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-12">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Empusa AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 