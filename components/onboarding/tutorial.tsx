"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ArrowRight, ArrowLeft, Sparkles, PlusCircle, Calendar, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface TutorialStep {
  title: string
  description: string
  action?: string
  href?: string
  icon: React.ReactNode
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Empusa AI!",
    description: "Let's get you started with creating amazing Pinterest content. This quick tutorial will show you the key features to maximize your Pinterest success.",
    icon: <Sparkles className="h-8 w-8 text-teal-600" />
  },
  {
    title: "Create Your First Post",
    description: "Click 'Create New Post' to generate Pinterest-optimized content from any URL. Our AI will create stunning images and compelling descriptions automatically.",
    action: "Create Post",
    href: "/dashboard/create",
    icon: <PlusCircle className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Schedule Your Posts",
    description: "Use our scheduling feature to post at optimal times for maximum engagement. Plan your content calendar and let Empusa AI handle the posting.",
    href: "/dashboard/posts",
    icon: <Calendar className="h-8 w-8 text-purple-600" />
  },
  {
    title: "View Your Analytics",
    description: "Track your Pinterest performance with our comprehensive dashboard. Monitor growth, engagement, and optimize your strategy with real-time insights.",
    href: "/dashboard",
    icon: <BarChart3 className="h-8 w-8 text-green-600" />
  }
];

interface OnboardingTutorialProps {
  onComplete: () => void
  onSkip?: () => void
}

export function OnboardingTutorial({ onComplete, onSkip }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowConfetti(true)
      setTimeout(() => {
        onComplete()
      }, 2000) // Show confetti for 2 seconds before completing
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip?.()
    onComplete()
  }

  const currentStepData = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {/* Confetti particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Success message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-teal-200">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Sparkles className="h-16 w-16 text-teal-600 mx-auto animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations! 🎉</h2>
                <p className="text-gray-600">You're all set to create amazing Pinterest content!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStepData.icon}
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {currentStepData.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {currentStepData.description}
            </p>

            {/* Action button for steps with actions */}
            {currentStepData.action && currentStepData.href && (
              <div className="mb-6">
                <Link href={currentStepData.href}>
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3"
                    onClick={() => {
                      setTimeout(handleNext, 1000)
                    }}
                  >
                    {currentStepData.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Tutorial
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                  {!isLastStep && <ArrowRight className="h-4 w-4" />}
                  {isLastStep && <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Help text */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false)

  const startTutorial = () => {
    setShowTutorial(true)
  }

  const completeTutorial = () => {
    setShowTutorial(false)
    setHasCompletedTutorial(true)
    localStorage.setItem('empusa-tutorial-completed', 'true')
  }

  const checkTutorialStatus = () => {
    const completed = localStorage.getItem('empusa-tutorial-completed')
    if (completed === 'true') {
      setHasCompletedTutorial(true)
    } else {
      setShowTutorial(true)
    }
  }

  return {
    showTutorial,
    hasCompletedTutorial,
    startTutorial,
    completeTutorial,
    checkTutorialStatus
  }
}
