"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Check, ArrowRight, Star, Zap, Shield, Users, Crown, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Logo } from "@/components/logo"

// PayPal SDK type declaration
declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PricingPage() {
  const { data: session } = useSession()
  const [isYearly, setIsYearly] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date()

  const monthlyPrice = 99
  const yearlyPrice = 772
  const yearlyEquivalent = 1188
  const savings = yearlyEquivalent - yearlyPrice
  const savingsPercentage = Math.round((savings / yearlyEquivalent) * 100)

  // Ensure we're on the client side before rendering PayPal buttons
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load PayPal SDK and render buttons
  useEffect(() => {
    if (!isClient) return

    // Load PayPal SDK if not already loaded
    if (!window.paypal) {
      const script = document.createElement('script')
      script.src = "https://www.paypal.com/sdk/js?client-id=Ad8W3h0i0xL_5ZFByBd6jalBxaim9R7Yc3tnHDgo6pfCCSzqzfLkt--nm1hhtsQ2hVQh-y7Fab9XzWIl&vault=true&intent=subscription"
      script.onload = () => renderPayPalButton()
      document.body.appendChild(script)
    } else {
      renderPayPalButton()
    }
  }, [isYearly, isClient])

  const renderPayPalButton = () => {
    if (!window.paypal) return

    const containerId = isYearly ? "paypal-button-container-yearly" : "paypal-button-container-monthly"
    const container = document.getElementById(containerId)
    
    if (container) {
      // Clear existing buttons
      container.innerHTML = ''
      
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data, actions) {
          return actions.subscription.create({
            plan_id: isYearly ? 'P-91V4006850544234XNCDW52I' : 'P-22365777UK845691BNCDW4WI'
          });
        },
        onApprove: function(data, actions) {
          window.location.href = '/checkout?subscription_id=' + data.subscriptionID;
        }
      }).render(`#${containerId}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex gap-6">
              <Link href="/#features" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-teal-600">
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
            <Link href="/pricing">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge className="mb-6 bg-teal-100 text-teal-700 hover:bg-teal-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Simple, transparent pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-teal-700 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
              Start free, scale as you grow. Join thousands of creators automating their Pinterest success.
            </p>
            
            {/* Enhanced Billing Toggle */}
            <div className="flex items-center justify-center mb-16">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center relative">
                {/* Background slider */}
                <div 
                  className={`absolute top-1 bottom-1 bg-white rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                    isYearly ? 'translate-x-[100px] w-[120px]' : 'translate-x-0 w-[100px]'
                  }`}
                />
                
                {/* Monthly Option */}
                <button
                  onClick={() => setIsYearly(false)}
                  className={`relative z-10 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    !isYearly 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Monthly
                </button>
                
                {/* Yearly Option */}
                <button
                  onClick={() => setIsYearly(true)}
                  className={`relative z-10 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isYearly 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Yearly
                  <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{savingsPercentage}%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="relative border-2 border-slate-200 bg-white/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  {/* Button positioned below price */}
                  <div className="pt-2">
                    {!session ? (
                      <Link href="/signup-free-trial">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium">
                          Get Started
                        </Button>
                      </Link>
                    ) : !isPremium ? (
                      <Button disabled className="w-full bg-slate-200 text-slate-500 cursor-not-allowed">
                        Your Current Plan
                      </Button>
                    ) : (
                      <Link href="/signup-free-trial">
                        <Button variant="outline" className="w-full">
                          Get Started
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">3 posts per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">2 hours storage</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Manual posting only</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">Watermarked images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Growth Plan */}
              <Card className="relative border-2 border-teal-500 bg-white shadow-xl scale-105 lg:scale-110">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white px-4 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl">Growth Plan</CardTitle>
                  <CardDescription>Perfect for growing creators</CardDescription>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">
                      ${isYearly ? Math.round(yearlyPrice / 12) : monthlyPrice}
                    </span>
                    <span className="text-slate-500">
                      /{isYearly ? 'month' : 'month'}
                    </span>
                    {isYearly && (
                      <div className="text-sm text-green-600 mt-2">
                        Save ${savings} ({savingsPercentage}% off)
                      </div>
                    )}
                    {isYearly && (
                      <div className="text-xs text-slate-500 line-through">
                        Was ${Math.round(yearlyEquivalent / 12)}/month
                      </div>
                    )}
                  </div>
                  {/* Button positioned below price */}
                  <div className="pt-2">
                    {isPremium ? (
                      <Button disabled className="w-full bg-teal-200 text-teal-700 cursor-not-allowed">
                        Your Current Plan
                      </Button>
                    ) : !session ? (
                      // Show "Get Started" for non-logged-in users
                      <Link href="/signup-free-trial">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium">
                          Get Started
                        </Button>
                      </Link>
                    ) : (
                      // Show PayPal buttons for logged-in free users
                      <div className="space-y-3">
                        {isClient ? (
                          <div 
                            id={isYearly ? "paypal-button-container-yearly" : "paypal-button-container-monthly"}
                            className="min-h-[50px]"
                          ></div>
                        ) : (
                          <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">100 posts per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">Unlimited storage</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">Auto-scheduling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">No watermarks</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">Custom branding</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">All image sizes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-teal-500" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <CardDescription>For teams and agencies</CardDescription>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                  {/* Button positioned below price */}
                  <div className="pt-2">
                    <Link href="/contact">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium">
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Unlimited posts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Multiple team members</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">White-label solution</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>


            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Compare Plans and Features</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Choose the plan that fits your needs. Upgrade or downgrade at any time.
              </p>
            </div>
            
            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-lg border border-slate-200">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-6 font-semibold text-slate-700">Features</th>
                      <th className="text-center p-6 font-semibold text-slate-700">Free</th>
                      <th className="text-center p-6 font-semibold text-teal-600 bg-teal-50">Growth Plan</th>
                      <th className="text-center p-6 font-semibold text-purple-600 bg-purple-50">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">Posts per day</td>
                      <td className="p-6 text-center text-slate-500">3</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">100</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Unlimited</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">Storage period</td>
                      <td className="p-6 text-center text-slate-500">2 hours</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">Unlimited</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Unlimited</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">Watermark</td>
                      <td className="p-6 text-center text-slate-500">Yes</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">No</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">No</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">Auto-scheduling</td>
                      <td className="p-6 text-center text-slate-500">No</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">Yes</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Yes</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">Custom branding</td>
                      <td className="p-6 text-center text-slate-500">No</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">Yes</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Yes</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-6 font-medium text-slate-600">All image sizes</td>
                      <td className="p-6 text-center text-slate-500">Portrait only</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">Yes</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Yes</td>
                    </tr>
                    <tr>
                      <td className="p-6 font-medium text-slate-600">Support</td>
                      <td className="p-6 text-center text-slate-500">Basic</td>
                      <td className="p-6 text-center text-teal-600 bg-teal-50 font-semibold">Priority</td>
                      <td className="p-6 text-center text-purple-600 bg-purple-50 font-semibold">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="text-left p-6 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                  <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div className="text-left p-6 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-slate-600">Yes! You can start with our free plan and upgrade when you're ready for more features.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Logo noLink={true} />
              <p className="text-sm text-gray-500">
                EmpusaAI is a web-based platform that automates Pinterest content creation and publishing from any URL,
                helping brands and creators save time and boost engagement.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/help">Help</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 EmpusaAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
