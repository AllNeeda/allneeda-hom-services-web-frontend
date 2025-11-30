"use client"

import { useState } from "react"
import { OnboardingIntro } from "./onboarding-intro"
import { PersonalInfoStep } from "./personal-info-step"
import { ProfessionalInfoStep } from "./professional-info-step"
import { AccountSecurityStep } from "./account-security-step"
import { OnboardingComplete } from "./onboarding-complete"

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    personalInfo: {},
    professionalInfo: {},
    accountSecurity: {},
  })

  const steps = [
    { component: OnboardingIntro, title: "Introduction" },
    { component: PersonalInfoStep, title: "Personal Info" },
    { component: ProfessionalInfoStep, title: "Professional Info" },
    { component: AccountSecurityStep, title: "Account Security" },
    { component: OnboardingComplete, title: "Complete" },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = (data?: any) => {
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }))
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="bg-background ">
      <CurrentStepComponent
        onNext={handleNext}
        onBack={handleBack}
        formData={formData}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </div>
  )
}
