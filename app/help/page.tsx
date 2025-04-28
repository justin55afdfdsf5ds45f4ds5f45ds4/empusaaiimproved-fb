import Link from "next/link"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  E
                </div>
                <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">
                  A
                </div>
                <span className="ml-2 font-bold text-xl">Empusa AI</span>
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/#features" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Features
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-teal-600 transition-colors">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-medium hover:text-teal-600 transition-colors">
              Log in
            </Link>
            <Link href="https://calendly.com/fk146543/30min" target="_blank">
              <Button className="bg-teal-600 hover:bg-teal-700">Grab a demo</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Help Center</h1>
              <p className="text-gray-500 md:text-xl max-w-[700px]">
                Need assistance with Empusa AI? We're here to help.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
                <p className="text-gray-500 mb-6">Have questions or need help? Reach out to our support team.</p>
                <a
                  href="mailto:justinlord@empusaai.com"
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  justinlord@empusaai.com
                </a>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">How does Empusa AI work?</h4>
                      <p className="text-gray-500">
                        Empusa AI analyzes your URL, extracts content, and generates Pinterest-optimized images with SEO
                        titles and descriptions. You can then publish directly to Pinterest with one click.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">How many pins can I create per day?</h4>
                      <p className="text-gray-500">
                        You can generate up to 100 pins per day with Empusa AI, depending on your plan.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Do I need a Pinterest account?</h4>
                      <p className="text-gray-500">
                        Yes, you'll need a Pinterest account to publish pins. Empusa AI connects to your Pinterest
                        account to automate the publishing process.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Getting Started</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">1. Book a demo</h4>
                      <p className="text-gray-500">
                        Schedule a demo call to see Empusa AI in action and discuss your specific needs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">2. Set up your account</h4>
                      <p className="text-gray-500">
                        After your demo, we'll help you set up your Empusa AI account and connect your Pinterest
                        profile.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">3. Start creating content</h4>
                      <p className="text-gray-500">
                        Paste your URL, generate pins, and publish to Pinterest with one click.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">
                    A
                  </div>
                  <span className="ml-2 font-bold text-xl">Empusa AI</span>
                </div>
              </Link>
              <p className="text-sm text-gray-500">
                Empusa AI is a web-based platform that automates Pinterest content creation and publishing from any URL,
                helping brands and creators save time and boost engagement.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Product</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/#features" className="text-sm text-gray-500 hover:text-gray-900">
                  Features
                </Link>
                <Link href="/#pricing" className="text-sm text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
                <Link
                  href="https://calendly.com/fk146543/30min"
                  target="_blank"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Enterprise
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Resources</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900">
                  Blog
                </Link>
                <Link href="/help" className="text-sm text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Company</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
                  About
                </Link>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                  Privacy
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Empusa AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
