"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { OverviewStep } from "./overview-step"
import { PricingStep } from "./pricing-step"
import { DescriptionStep } from "./description-step"
import { RequirementsStep } from "./requirements-step"
import { GalleryStep } from "./gallery-step"
import { PublishStep } from "./publish-step"

export function ServiceCreationFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    overview: {},
    pricing: {},
    description: {},
    requirements: {},
    gallery: {},
  })

  const steps = [
    { id: "overview", title: "Overview", component: OverviewStep },
    { id: "pricing", title: "Pricing", component: PricingStep },
    { id: "description", title: "Description & FAQ", component: DescriptionStep },
    { id: "requirements", title: "Requirements", component: RequirementsStep },
    { id: "gallery", title: "Gallery", component: GalleryStep },
    { id: "publish", title: "Publish", component: PublishStep },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = (data?: any) => {
    if (data) {
      const stepKey = steps[currentStep].id
      setFormData((prev) => ({ ...prev, [stepKey]: data }))
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Progress Steps */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Timeline Progress */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => handleStepClick(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                      index < currentStep
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : index === currentStep
                          ? "bg-green-500 text-white shadow-lg shadow-orange-500/25"
                          : "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-gray-400"
                    } ${index <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}`}
                    disabled={index > currentStep}
                    aria-current={index === currentStep ? "step" : undefined}
                    aria-label={`Step ${index + 1}: ${step.title}`}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                  </button>

                  {/* Step Label */}
                  <div className="mt-4 text-center">
                    <div className={`text-sm font-medium transition-colors ${
                      index <= currentStep
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-screen-xl mx-auto px-3 sm:px-4 py-2 sm:py-3 lg:py-8">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          formData={formData}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </main>
    </div>
  )
}
  