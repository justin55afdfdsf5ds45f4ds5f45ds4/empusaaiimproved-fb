import { Phone, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Logo } from "@/components/logo"

const GrowthPlanFeatures = [
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Up to 100 posts per day" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Priority support" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Pinterest strategy coach access" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "AI content generation" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Bulk post scheduling" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Custom link insertion" },
  { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, text: "Access to new features" },
]

const AgencyPlanFeatures = [
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Unlimited posts per day" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Unlimited AI generations" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "White-label branding" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Team access & collaboration" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Private onboarding & Slack support" }, // Updated
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Dedicated account manager" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Advanced analytics dashboard" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Custom integrations (API/Webhooks)" },
  { icon: <CheckCircle2 className="h-5 w-5 text-sky-500" />, text: "Pinterest strategy workshops" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/#features" className="text-sm font-medium hover:text-teal-600 transition-colors">
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
            <Link href="https://cal.com/justin-lord-a80mr6/30min" target="_blank">
              <Button className="bg-teal-600 hover:bg-teal-700">Grab a demo</Button>
            </Link>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        {/* Section 1: Hero / Intro */}
        <section className="text-center mb-16 lg:mb-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 py-2">
            Simple Plans That Scale With You
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Whether you're a solo creator or a large agency, we've got a plan that fits your Pinterest goals.
          </p>
        </section>

        {/* Section 2: Pricing Plans */}
        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Plan 1 – Growth Plan */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border-2 border-green-500 bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">Growth Plan</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-md pt-1">
                  Designed for creators and small businesses ready to scale Pinterest growth.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$500</span>
                  <span className="text-lg text-slate-500 dark:text-slate-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {GrowthPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      {feature.icon}
                      <span className="text-slate-700 dark:text-slate-300">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Plan 2 – Agency Plan */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col bg-slate-800 dark:bg-slate-900/80 text-white backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-sky-400">Custom Agency Plan</CardTitle>
                <CardDescription className="text-slate-400 text-md pt-1">
                  Run a large account or agency? Get tailored solutions with powerful features.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">Let's Talk</span>
                  <p className="text-sm text-slate-400 mt-1">Tailored pricing for your specific needs.</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {AgencyPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      {feature.icon}
                      <span className="text-slate-300">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <a
                  href="https://cal.com/justin-lord-a80mr6/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  <Phone className="mr-2 h-5 w-5" /> Book a Call
                </a>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator className="my-12 lg:my-16 bg-slate-300 dark:bg-slate-700" />

        {/* Section 3: Trial Eligibility CTA */}
        <section className="text-center py-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Want a Free Trial?
          </h2>
          <p className="text-md sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 px-4">
            If you have over 100k followers on any social platform, you may qualify for a 7-day free trial of our
            premium plan. Email us or book a call to check your eligibility.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" /> Book a Call
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/30 dark:hover:text-green-400"
              asChild
            >
              <a href="mailto:justinlord@empusaai.com">
                Contact Us
              </a>
            </Button>
          </div>
        </section>
      </div>
      <footer className="w-full border-t bg-white py-12">
        <div className="container px-4 md:px-6">
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
                <Link href="/#features" className="text-sm text-gray-500 hover:text-gray-900">
                  Features
                </Link>
                <Link href="/#pricing" className="text-sm text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
                <Link
                  href="https://cal.com/justin-lord-a80mr6/30min"
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
