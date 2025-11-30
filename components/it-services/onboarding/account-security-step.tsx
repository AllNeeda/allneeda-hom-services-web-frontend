"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Mail, Phone } from "lucide-react"

interface AccountSecurityStepProps {
  // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
  currentStep: number
  totalSteps: number
}
// eslint-disable-next-line
export function AccountSecurityStep({ onNext, onBack, formData, currentStep, totalSteps }: AccountSecurityStepProps) {
  // eslint-disable-next-line
  const [accountSecurity, setAccountSecurity] = useState({
    emailVerified: true,
    phoneVerified: false,
  })

  const handleSubmit = () => {
    onNext({ accountSecurity })
  }


  return (
    <div className="bg-background">
     

      {/* Progress Steps */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Personal Info</span>
            </div>
            <div className="w-4 h-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Professional Info</span>
            </div>
            <div className="w-4 h-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Account Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Security</h1>
            <p className="text-muted-foreground">
              Trust and safety is a big deal in our community. Please verify your email and phone number so that we can
              keep your account secured.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Verification */}
            <div className="flex items-center justify-between p-6 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">Private</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
                  Verified
                </span>
              </div>
            </div>

            {/* Phone Verification */}
            <div className="flex items-center justify-between p-6 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone Number</h3>
                  <p className="text-sm text-muted-foreground">Private</p>
                  <p className="text-sm text-muted-foreground">Well never share your phone number.</p>
                </div>
              </div>
              <Button variant="outline">Add Phone Number</Button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
