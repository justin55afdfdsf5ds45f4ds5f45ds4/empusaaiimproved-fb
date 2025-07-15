"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "@/components/motion-wrapper"

import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { Logo } from "@/components/logo"
import { fadeInUp, staggerContainer, fadeIn, scaleIn, slideInFromLeft, slideInFromRight } from "@/lib/animation-variants"
import { PinterestGridBg } from "@/components/pinterest-grid-bg"
import { AnimatedCTA } from "@/components/animated-cta"
import { AnimatedHero } from "@/components/animated-hero"
import { PinterestAutomation } from "@/components/pinterest-automation"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-teal-600 transition-colors">
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
            <AnimatedCTA href="/login" variant="primary">
              Get Started
            </AnimatedCTA>
            <Link href="https://www.empusaai.com/signup-free-trial" target="_blank">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="text-sm font-semibold leading-6 text-gray-600">
                  Book a demo <span aria-hidden="true">→</span>
                </Button>
              </motion.div>
            </Link>
            <MobileMenu />
          </div>
        </motion.div>
      </header>
      <main className="flex-1">
        <AnimatedHero />
        <PinterestAutomation />
        <section className="relative bg-gradient-to-b from-white to-teal-50/30">
          <div className="container px-4 md:px-6 pb-12 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex justify-center gap-4"
            >
              <AnimatedCTA href="/pricing" variant="primary" className="px-8 py-6 text-lg">
                Get Started Now
              </AnimatedCTA>
              <AnimatedCTA href="/signup-free-trial" variant="secondary" className="px-8 py-6 text-lg">
                Try For Free
              </AnimatedCTA>
            </motion.div>
          </div>
        </section>

        {/* YouTube Video Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-teal-50 to-white">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <motion.div 
                variants={scaleIn}
                className="aspect-video w-full overflow-hidden rounded-xl shadow-xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/9lVHjhWvuUg?si=TXSZwUxpKoMlddwN"
                  title="Empusa AI Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>

              {/* Call-to-action button */}
              <motion.div 
                variants={fadeInUp}
                className="mt-8 flex justify-center">
                <AnimatedCTA href="/signup-free-trial" variant="secondary" className="text-lg px-8 py-6">
                  Try it out for free!
                </AnimatedCTA>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white relative overflow-hidden" id="features">
          <PinterestGridBg />
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="container px-4 md:px-6 relative">
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Pinterest Content Creation Made Simple
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Empusa AI handles everything from content generation to Pinterest publishing with just one click
                </p>
              </div>
            </motion.div>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              {[
                {
                  title: "Quality Pinterest content with one click",
                  description:
                    "Our AI analyzes your URL and generates Pinterest-optimized images with SEO-friendly titles and descriptions that drive engagement.",
                  icon: "✨",
                },
                {
                  title: "Save 10+ hours a week on Pinterest marketing",
                  description:
                    "Automatically publish to Pinterest with optimized content. No more manual pinning or struggling with content creation.",
                  icon: "⏱️",
                },
                {
                  title: "Boost Pinterest traffic instantly",
                  description:
                    "Our SEO-optimized pins help increase visibility and drive more traffic to your website from Pinterest's 450+ million users.",
                  icon: "📈",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="flex flex-col items-center text-center gap-4 rounded-lg border bg-white p-6 shadow-lg"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-600 relative overflow-hidden">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to dominate Pinterest?</h2>
                <p className="max-w-[700px] md:text-xl">
                  Join brands, creators, and marketers who use Empusa AI to automate their Pinterest content strategy.
                </p>
              </div>
              <motion.div 
                variants={scaleIn}
                className="flex flex-col gap-2 min-[400px]:flex-row">
                <AnimatedCTA href="/pricing" variant="white">
                  Get Started
                </AnimatedCTA>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="w-full border-t bg-white py-12">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/">
                <Logo />
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
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900">
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
        </motion.div>
      </footer>
    </div>
  )
}
