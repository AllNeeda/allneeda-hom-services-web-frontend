"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PublishStepProps {
   // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

export function PublishStep({ onNext }: PublishStepProps) {
  const handlePublish = () => {
    // Handle Service publication
    onNext({ published: true })
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Main Content */}
      <div className="text-center space-y-8">
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <div className="w-64 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/assets/it-services/checklist.jpg"
              alt="Final step checklist"
              width={160}
              height={120}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Youre almost there!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Lets publish your Service and get you ready to start selling.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button onClick={handlePublish} className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg">
            Publish Service
          </Button>
          <Button variant="link" className="text-green-600">
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}
