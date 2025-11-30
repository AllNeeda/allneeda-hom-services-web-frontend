"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Check, X } from "lucide-react"

interface PersonalInfoStepProps {
  // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
  currentStep: number
  totalSteps: number
}

interface Language {
  language: string
  level: string
  id: string
}

// eslint-disable-next-line
export function PersonalInfoStep({ onNext, onBack, formData, currentStep, totalSteps }: PersonalInfoStepProps) {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    displayName: "John Doe",
    profilePicture: null,
    description: "",
    languages: [] as Language[],
  })

  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")

  const handleAddLanguage = () => {
    if (selectedLanguage && selectedLevel) {
      const newLanguage: Language = {
        language: selectedLanguage,
        level: selectedLevel,
        id: Date.now().toString(), // Simple ID generation
      }
      
      setPersonalInfo(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }))
      
      // Reset selections
      setSelectedLanguage("")
      setSelectedLevel("")
    }
  }

  const handleRemoveLanguage = (id: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ personalInfo })
  }


  return (
    <div className="max-w-6xl mx-auto bg-background">

      {/* Progress Steps */}
      <div className="border-b border-border bg-background">
        <div className="px-4 py-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600">Personal Info</span>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-[10px] sm:text-sm">
                2
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Professional Info</span>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 h-px bg-border"></div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-muted-foreground text-muted-foreground flex items-center justify-center text-[10px] sm:text-sm">
                3
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Account Security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-4 py-12 max-w-2xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Personal Info</h1>
            <p className="text-muted-foreground">
              Tell us a bit about yourself. This information will appear on your public profile, so that potential
              buyers can get to know you better.
            </p>
            <p className="text-sm text-muted-foreground mt-2">* Mandatory fields</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Full Name* <span className="text-muted-foreground font-normal">Private</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Display Name*</Label>
              <Input
                value={personalInfo.displayName}
                onChange={(e) => setPersonalInfo((prev) => ({ ...prev, displayName: e.target.value }))}
                required
              />
            </div>

            {/* Profile Picture */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Profile Picture*</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  A
                </div>
                <Button type="button" variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Description*</Label>
              <Textarea
                placeholder="Share a bit about your work experience, cool projects you've completed, and your area of expertise."
                value={personalInfo.description}
                onChange={(e) => setPersonalInfo((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-32"
                required
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>min 150 characters</span>
                <span>0 / 600</span>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Languages*</Label>
              <div className="flex gap-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Language Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Native/Bilingual</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddLanguage}
                  disabled={!selectedLanguage || !selectedLevel}
                >
                  Add
                </Button>
              </div>

              {/* Display Added Languages */}
              {personalInfo.languages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Added Languages:</Label>
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.languages.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm font-medium capitalize">
                          {lang.language} - {lang.level}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
