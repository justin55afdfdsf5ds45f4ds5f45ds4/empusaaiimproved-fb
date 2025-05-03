import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
              <Link href="#features" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-teal-600 transition-colors">
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
            <MobileMenu />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Dominate Pinterest with AI-Generated Content
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Empusa AI automatically creates and publishes SEO-optimized Pinterest content from any URL, helping
                    brands and creators save time and boost engagement.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-orange-100 grid grid-cols-2 grid-rows-2 gap-2 p-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="rounded-lg overflow-hidden shadow-md bg-white hover:scale-105 transition-transform"
                        style={{
                          aspectRatio: item % 3 === 0 ? "2/3" : "1/1",
                          animation: `float ${2 + item}s ease-in-out infinite`,
                        }}
                      >
                        <div className="h-3/4 bg-gradient-to-br from-teal-200 to-orange-200"></div>
                        <div className="p-2">
                          <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Pinterest Content Creation Made Simple
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Empusa AI handles everything from content generation to Pinterest publishing with just one click
                </p>
              </div>
            </div>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              {[
                {
                  title: "Quality Pinterest content with one click",
                  description:
                    "Our AI analyzes your URL and generates Pinterest-optimized images with SEO-friendly titles and descriptions that drive engagement.",
                  icon: "✨",
                  animation: "animate-bounce",
                },
                {
                  title: "Save 10+ hours a week on Pinterest marketing",
                  description:
                    "Automatically publish to Pinterest with optimized content. No more manual pinning or struggling with content creation.",
                  icon: "⏱️",
                  animation: "animate-pulse",
                },
                {
                  title: "Boost Pinterest traffic instantly",
                  description:
                    "Our SEO-optimized pins help increase visibility and drive more traffic to your website from Pinterest's 450+ million users.",
                  icon: "📈",
                  animation: "animate-bounce",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center gap-4 rounded-lg border bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  style={{
                    animation: `float ${3 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  <div className={`text-4xl ${feature.animation}`}>{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to dominate Pinterest?</h2>
                <p className="max-w-[700px] md:text-xl">
                  Join brands, creators, and marketers who use Empusa AI to automate their Pinterest content strategy.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button className="bg-white text-teal-600 hover:bg-gray-100">Get Started</Button>
                </Link>
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
                <Link href="#features" className="text-sm text-gray-500 hover:text-gray-900">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm text-gray-500 hover:text-gray-900">
                  Pricing
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
