import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Empusa AI Logo" width={150} height={50} />
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
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
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
                  <Link href="https://calendly.com/fk146543/30min" target="_blank">
                    <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg">
                      Grab a demo
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">It's easier than ever</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  From content analysis to Pinterest publishing in three simple steps
                </p>
              </div>
            </div>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              {[
                {
                  step: "Step 1",
                  title: "Paste your blog link",
                  description:
                    "Simply copy and paste the URL of your blog post, article, or any web page you want to create Pinterest content for.",
                  icon: "🔗",
                },
                {
                  step: "Step 2",
                  title: "Hit generate",
                  description:
                    "Our AI analyzes your content, extracts key themes, and generates 10 Pinterest-ready images with SEO-optimized titles and descriptions.",
                  icon: "⚡",
                },
                {
                  step: "Step 3",
                  title: "Publish to Pinterest",
                  description:
                    "With one click, automatically publish your new pins to Pinterest, perfectly timed for maximum engagement and reach.",
                  icon: "🚀",
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 p-6 relative">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 text-2xl">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-teal-600">{step.step}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                  {i < 2 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="https://calendly.com/fk146543/30min" target="_blank">
                <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg">
                  Grab a demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-600">
                    Pinterest Automation
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Generate up to 100 pins per day</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Empusa AI helps brands, creators, and affiliate marketers dominate Pinterest with consistent,
                    high-quality content.
                  </p>
                </div>
                <ul className="grid gap-2">
                  {[
                    "Generate 10 Pinterest-ready images from any URL",
                    "Automatic SEO-optimized title and description generation",
                    "One-click publishing directly to Pinterest",
                    "Save hours of Pinterest marketing time",
                    "Increase traffic and engagement on Pinterest",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-teal-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <Link href="https://calendly.com/fk146543/30min" target="_blank">
                    <Button className="bg-teal-600 hover:bg-teal-700">Grab a demo</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-[500px]">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                      style={{
                        aspectRatio: item % 2 === 0 ? "2/3" : "1/1",
                        animation: `float ${2 + item}s ease-in-out infinite`,
                        animationDelay: `${item * 0.3}s`,
                      }}
                    >
                      <div className="h-3/4 bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-teal-500"></div>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Be one of the lucky early adopters</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Empusa AI is revolutionizing Pinterest marketing by automating the entire content creation and
                  publishing process. Our AI analyzes your content, generates high-quality Pinterest images, writes
                  SEO-optimized titles and descriptions, and publishes directly to your Pinterest account with one
                  click.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Free access for users with 100k+ followers on Pinterest, TikTok, YouTube, Instagram, or Facebook",
                "Priority access to new features and updates",
                "Dedicated account manager for enterprise clients",
                "Custom integration with your existing content workflow",
                "Unlimited API access for enterprise plans",
                "Early adopter pricing locked in for life",
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 p-4 rounded-lg bg-white shadow-md">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="https://calendly.com/fk146543/30min" target="_blank">
                <Button className="bg-teal-600 hover:bg-teal-700 px-8 py-6 text-lg">
                  Grab a demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pricing</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  We're still figuring out the fair pricing for our members. Book a call to get early access.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-12 lg:grid-cols-2">
              <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Custom Pricing</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We're offering custom pricing based on your needs and volume. Schedule a demo to discuss your
                    requirements.
                  </p>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {[
                    "Tailored to your Pinterest marketing needs",
                    "Volume-based discounts available",
                    "Enterprise solutions for brands and agencies",
                    "Special pricing for creators with large followings",
                  ].map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-teal-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="https://calendly.com/fk146543/30min" target="_blank" className="w-full">
                  <Button className="bg-teal-600 hover:bg-teal-700 w-full">Book a call for access</Button>
                </Link>
              </div>

              <div className="flex flex-col rounded-lg border border-teal-600 bg-white p-6 shadow-lg">
                <div className="mb-4 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-600 w-fit">
                  Special offer
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Free Access</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Qualify for free access if you have over 100k followers on any major platform.
                  </p>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  {[
                    "100k+ followers on Pinterest",
                    "100k+ followers on TikTok",
                    "100k+ followers on YouTube",
                    "100k+ followers on Instagram",
                    "100k+ followers on Facebook",
                  ].map((platform, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-teal-600" />
                      <span>{platform}</span>
                    </li>
                  ))}
                </ul>
                <Link href="https://calendly.com/fk146543/30min" target="_blank" className="w-full">
                  <Button className="bg-teal-600 hover:bg-teal-700 w-full">Book a call for access</Button>
                </Link>
              </div>
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
                <Link href="https://calendly.com/fk146543/30min" target="_blank">
                  <Button className="bg-white text-teal-600 hover:bg-gray-100">Grab a demo</Button>
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
                <Image src="/images/logo.png" alt="Empusa AI Logo" width={150} height={50} />
              </Link>
              <p className="text-sm text-gray-500">
                Empusa AI is a web-based platform that automates Pinterest content creation and publishing from any URL,
                helping brands and creators save time and boost engagement.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
              </div>
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
