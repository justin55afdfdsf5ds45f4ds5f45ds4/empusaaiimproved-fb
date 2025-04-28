import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Empusa AI Blog</h1>
              <p className="text-gray-500 md:text-xl max-w-[700px]">
                Insights, tips, and updates on Pinterest marketing and AI content creation
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <article className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">The Birth of Empusa AI: Revolutionizing Pinterest Marketing</h2>
                <div className="flex items-center text-gray-500 mb-6">
                  <span>{currentDate}</span>
                  <span className="mx-2">•</span>
                  <span>By Justin Lord</span>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center">
                    <div className="text-4xl">📊</div>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    Today marks an exciting milestone as we officially launch Empusa AI, a revolutionary platform
                    designed to transform how brands and creators approach Pinterest marketing.
                  </p>
                  <p className="mb-4">
                    Pinterest has long been an untapped goldmine for traffic and engagement. With over 450 million
                    monthly active users searching for inspiration, it presents an enormous opportunity for brands and
                    creators to connect with their audience. However, creating high-quality Pinterest content has
                    traditionally been a time-consuming process requiring graphic design skills, copywriting expertise,
                    and a deep understanding of Pinterest's algorithm.
                  </p>
                  <p className="mb-4">
                    That's where Empusa AI comes in. We've built a platform that automates the entire Pinterest content
                    creation and publishing workflow. Simply paste a URL, and our AI analyzes the content, generates 10
                    Pinterest-optimized images, writes SEO-friendly titles and descriptions, and publishes directly to
                    your Pinterest account with one click.
                  </p>
                  <h3 className="text-xl font-bold mt-8 mb-4">Why We Built Empusa AI</h3>
                  <p className="mb-4">
                    As marketers themselves, we experienced firsthand the challenges of maintaining a consistent
                    Pinterest presence. Creating pins manually was taking hours each week, and we knew there had to be a
                    better way.
                  </p>
                  <p className="mb-4">
                    We assembled a team of AI experts and Pinterest marketing specialists to build a solution that would
                    make professional Pinterest marketing accessible to everyone, from solo creators to large
                    enterprises.
                  </p>
                  <h3 className="text-xl font-bold mt-8 mb-4">What Makes Empusa AI Different</h3>
                  <p className="mb-4">
                    Unlike other tools that only handle one part of the Pinterest marketing workflow, Empusa AI is an
                    end-to-end solution:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">Automatic image generation based on your content</li>
                    <li className="mb-2">SEO-optimized titles and descriptions</li>
                    <li className="mb-2">One-click publishing to Pinterest</li>
                    <li className="mb-2">Performance tracking and analytics</li>
                    <li>Up to 100 pins per day</li>
                  </ul>
                  <p className="mb-4">
                    Our AI has been trained on thousands of successful Pinterest pins to understand what drives
                    engagement and traffic, ensuring that every pin we create is optimized for performance.
                  </p>
                  <h3 className="text-xl font-bold mt-8 mb-4">Join Us as an Early Adopter</h3>
                  <p className="mb-4">
                    We're currently offering special early adopter benefits for brands and creators who join Empusa AI.
                    If you have over 100k followers on Pinterest, TikTok, YouTube, Instagram, or Facebook, you may
                    qualify for free access.
                  </p>
                  <p className="mb-4">
                    We're excited to see how Empusa AI transforms your Pinterest strategy and helps you drive more
                    traffic and engagement.
                  </p>
                  <p>
                    Ready to revolutionize your Pinterest marketing?{" "}
                    <Link
                      href="https://calendly.com/fk146543/30min"
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Grab a demo today
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </article>
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
