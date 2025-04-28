import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function AboutPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Empusa AI</h1>
              <p className="text-gray-500 md:text-xl max-w-[700px]">
                Revolutionizing Pinterest marketing with AI-powered content creation and automation
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-500 mb-4">
                  At Empusa AI, our mission is to empower brands, creators, and marketers to dominate Pinterest without
                  the time-consuming process of content creation and publishing.
                </p>
                <p className="text-gray-500 mb-4">
                  We believe that great content shouldn't take hours to create. Our AI-powered platform automates the
                  entire Pinterest marketing workflow, from content generation to publishing, helping you save time
                  while growing your Pinterest presence.
                </p>
                <p className="text-gray-500">
                  By leveraging cutting-edge AI technology, we're making professional Pinterest marketing accessible to
                  everyone, from solo creators to large enterprises.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-gray-500 mb-4">
                  Empusa AI was founded by Justin Lord, who recognized the immense potential of Pinterest for driving
                  traffic but was frustrated by the time-consuming process of creating and publishing content.
                </p>
                <p className="text-gray-500 mb-4">
                  After spending countless hours manually creating Pinterest pins, Justin decided there had to be a
                  better way. He assembled a team of AI experts and Pinterest marketers to build a solution that would
                  automate the entire process.
                </p>
                <p className="text-gray-500">
                  Today, Empusa AI is helping brands and creators around the world transform their Pinterest strategy
                  with AI-powered automation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-teal-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold">What We Do</h2>
              <p className="text-gray-500 md:text-xl max-w-[700px]">
                Empusa AI is a comprehensive Pinterest automation platform that handles every aspect of your Pinterest
                marketing strategy
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Content Generation",
                  description:
                    "Our AI analyzes your URL and generates 10 Pinterest-optimized images with unique designs.",
                },
                {
                  title: "SEO Optimization",
                  description:
                    "We automatically create SEO-optimized titles and descriptions that help your pins get discovered.",
                },
                {
                  title: "Automated Publishing",
                  description:
                    "With one click, publish your pins directly to Pinterest, perfectly timed for maximum engagement.",
                },
                {
                  title: "Performance Analytics",
                  description:
                    "Track the performance of your pins and understand what's working to continuously improve results.",
                },
                {
                  title: "Content Calendar",
                  description:
                    "Schedule pins in advance to maintain a consistent Pinterest presence without daily work.",
                },
                {
                  title: "Enterprise Solutions",
                  description:
                    "Custom integrations and high-volume solutions for brands and agencies managing multiple accounts.",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col p-6 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold">Meet Our Founder</h2>
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
              <h3 className="text-xl font-bold">Justin Lord</h3>
              <p className="text-gray-500">Founder & CEO</p>
              <p className="text-gray-500 max-w-[700px]">
                Justin is a passionate entrepreneur with a background in AI and digital marketing. His vision for Empusa
                AI came from his own struggles with Pinterest marketing and his desire to help creators and brands save
                time while achieving better results.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-teal-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to transform your Pinterest strategy?
                </h2>
                <p className="max-w-[700px] md:text-xl">
                  Join brands, creators, and marketers who use Empusa AI to automate their Pinterest content.
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
