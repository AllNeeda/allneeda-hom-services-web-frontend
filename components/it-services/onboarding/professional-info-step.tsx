"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X } from "lucide-react"

interface ProfessionalInfoStepProps {
  // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
  currentStep: number
  totalSteps: number
}

// Added strong types to fix `never[]` issues
interface SkillItem {
  id: string
  skill: string
  level: string
}
interface EducationItem {
  id: string
  country: string
  university: string
  degree: string
  field: string
  year: string
}
interface CertificationItem {
  id: string
  name: string
  issuer: string
  year: string
}

type ProfessionalInfoState = {
  occupation: string
  skills: SkillItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  website: string
}

// eslint-disable-next-line
export function ProfessionalInfoStep({ onNext, onBack, formData, currentStep, totalSteps }: ProfessionalInfoStepProps) {
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfoState>({
    occupation: "",
    skills: [],
    education: [],
    certifications: [],
    website: "",
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [selectedDegree, setSelectedDegree] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [certificationName, setCertificationName] = useState("")
  const [certificationIssuer, setCertificationIssuer] = useState("")
  const [certificationYear, setCertificationYear] = useState("")
  const [selectedOccupation, setSelectedOccupation] = useState("graphics-design")

  const occupationOptions = [
    { value: "graphics-design", label: "Graphics & Design" },
    { value: "programming-tech", label: "Programming & Tech" },
    { value: "digital-marketing", label: "Digital Marketing" },
  ]

  const skillsByOccupation: Record<string, string[]> = {
    "graphics-design": [
      "AI Artists",
      "Album Cover Design",
      "App Design",
      "Architecture & Interior Design",
      "Book Design",
      "Brand Style Guides",
      "Brochure Design",
      "Building Engineering",
      "Building Information Modeling",
      "Business Cards & Stationery",
      "Cartoons & Comics",
      "Character Modeling",
      "Fashion Design",
      "Flyer Design",
      "Game Art",
      "Graphics for Streamers",
      "Illustration",
      "Image Editing",
      "Industrial & Product Design",
      "Infographic Design",
      "Jewelry Design",
      "Logo Design",
      "NFT Art",
      "Packaging & Label Design",
      "Portraits & Caricatures",
      "Presentation Design",
      "Social Media Design",
      "T-Shirts & Merchandise",
      "UX Design",
      "Website Design",
    ],
    "programming-tech": [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "NestJS",
      "TypeScript",
      "Python",
      "Django",
      "Flask",
      "Laravel",
      "Go",
      "Java",
      "Spring Boot",
      "Android",
      "iOS",
      "Flutter",
      "React Native",
      "Database Design",
      "PostgreSQL",
      "MongoDB",
      "DevOps",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Cloud Architecture",
    ],
    "digital-marketing": [
      "SEO",
      "Technical SEO",
      "On-page SEO",
      "Off-page SEO",
      "SEM",
      "Google Ads",
      "Facebook Ads",
      "PPC Campaigns",
      "Content Marketing",
      "Copywriting",
      "Email Marketing",
      "Marketing Automation",
      "Social Media Strategy",
      "Influencer Marketing",
      "Analytics & Reporting",
      "Conversion Rate Optimization",
      "Affiliate Marketing",
      "Brand Strategy",
    ],
  }

  const skills = skillsByOccupation[selectedOccupation] ?? []

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.length < 5 ? [...prev, skill] : prev,
    )
  }

  const handleAddSkill = () => {
    if (selectedSkill && selectedLevel) {
      const newSkill: SkillItem = {
        id: Date.now().toString(),
        skill: selectedSkill,
        level: selectedLevel,
      }
      setProfessionalInfo((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      setSelectedSkill("")
      setSelectedLevel("")
    }
  }

  const handleRemoveSkill = (id: string) => {
    setProfessionalInfo((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }))
  }

  const handleAddEducation = () => {
    if (selectedCountry && selectedUniversity && selectedDegree && selectedField && selectedYear) {
      const newEducation: EducationItem = {
        id: Date.now().toString(),
        country: selectedCountry,
        university: selectedUniversity,
        degree: selectedDegree,
        field: selectedField,
        year: selectedYear,
      }
      setProfessionalInfo((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }))
      setSelectedCountry("")
      setSelectedUniversity("")
      setSelectedDegree("")
      setSelectedField("")
      setSelectedYear("")
    }
  }

  const handleRemoveEducation = (id: string) => {
    setProfessionalInfo((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const handleAddCertification = () => {
    if (certificationName && certificationIssuer && certificationYear) {
      const newCertification: CertificationItem = {
        id: Date.now().toString(),
        name: certificationName,
        issuer: certificationIssuer,
        year: certificationYear,
      }
      setProfessionalInfo((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification],
      }))
      setCertificationName("")
      setCertificationIssuer("")
      setCertificationYear("")
    }
  }

  const handleRemoveCertification = (id: string) => {
    setProfessionalInfo((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ professionalInfo: { ...professionalInfo, skills: selectedSkills } })
  }


  return (
    <div className="max-w-6xl mx-auto bg-background">
      {/* Progress Steps */}
      <div className="border-b border-border bg-background">
        <div className="px-4 py-4 grid gap-4 grid-cols-1 md:grid-cols-2 items-center w-full overflow-x-hidden min-w-0">
          {/* Steps */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full min-w-0">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600">Personal Info</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:flex items-center justify-center">
              <div className="w-6 md:w-8 h-px bg-border"></div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600">Professional Info</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:flex items-center justify-center">
              <div className="w-6 md:w-8 h-px bg-border"></div>
            </div>
            {/* Step 3 */}
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
      <div className="px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Professional Info</h1>
            <p className="text-muted-foreground">
              This is your time to shine. Let potential buyers know what you do best and how you gained your skills,
              certifications and experience.
            </p>
            <p className="text-sm text-muted-foreground mt-2">* Mandatory fields</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Your Occupation */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Your Occupation*</Label>
              <div className="flex gap-4 items-center">
                <Select value={selectedOccupation} onValueChange={(v) => { setSelectedOccupation(v); setSelectedSkills([]) }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Graphics & Design" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">From</span>
                <Select>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="2025" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">To</span>
                <Select>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="2025" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Choose <span className="font-bold">two to five</span> of your best skills in {
                    occupationOptions.find(o => o.value === selectedOccupation)?.label ?? "your field"
                  }
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                      disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 5}
                    />
                    <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
              <Button type="button" variant="link" className="text-green-600 p-0 h-auto">
                + Add New
              </Button>
            </div>

            {/* Skills with Experience Level */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Skills*</Label>
              <div className="flex gap-4">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Full stack web development" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullstack">Full stack web development</SelectItem>
                    <SelectItem value="frontend">Frontend development</SelectItem>
                    <SelectItem value="backend">Backend development</SelectItem>
                    <SelectItem value="mobile">Mobile development</SelectItem>
                    <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Intermediate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAddSkill}
                  disabled={!selectedSkill || !selectedLevel}
                >
                  Add
                </Button>
              </div>

              {/* Display Added Skills */}
              {professionalInfo.skills.length > 0 && (
                <div className="space-y-3 pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Added Skills:</Label>
                  <div className="flex flex-wrap gap-2">
                    {professionalInfo.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border">
                        <span className="text-sm font-medium capitalize">
                          {skill.skill} - {skill.level}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="h-5 w-5 p-0 hover:bg-gray-200 rounded-full"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Education</Label>
              <p className="text-sm text-muted-foreground">
                Add any relevant education details that will help customers to get to know you better.
              </p>
              <div className="flex gap-4">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Afghanistan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="afghanistan">Afghanistan</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="nangarhar">Nangarhar</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kabul">Kabul University</SelectItem>
                    <SelectItem value="nangarhar">Nangarhar University</SelectItem>
                    <SelectItem value="harvard">Harvard University</SelectItem>
                    <SelectItem value="other">Other University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ba">B.A</SelectItem>
                    <SelectItem value="bs">B.Sc</SelectItem>
                    <SelectItem value="ma">M.A</SelectItem>
                    <SelectItem value="ms">M.Sc</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Bachelors of Technology</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddEducation}
                disabled={!selectedCountry || !selectedUniversity || !selectedDegree || !selectedField || !selectedYear}
                 className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add
              </Button>

              {/* Display Added Education */}
              {professionalInfo.education.length > 0 && (
                <div className="space-y-4 pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Added Education:</Label>
                  <div className="space-y-3">
                    {professionalInfo.education.map((edu) => (
                      <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base mb-1">
                              {edu.university}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {edu.degree} Degree, graduated
                            </p>
                            <p className="text-xs text-gray-500">
                              Graduated {edu.year}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="h-6 w-6 p-0 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certification */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Certification</Label>
              <p className="text-sm text-muted-foreground">
                Include any certificates or awards that are relevant to the services you&apos;re offering.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Input 
                  placeholder="Certification name" 
                  value={certificationName}
                  onChange={(e) => setCertificationName(e.target.value)}
                />
                <Input 
                  placeholder="Issuing organization" 
                  value={certificationIssuer}
                  onChange={(e) => setCertificationIssuer(e.target.value)}
                />
                <Select value={certificationYear} onValueChange={setCertificationYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="button" 
                className="bg-green-600 hover:bg-green-700 text-white "
                onClick={handleAddCertification}
                disabled={!certificationName || !certificationIssuer || !certificationYear}
              >
                Add
              </Button>

              {/* Display Added Certifications */}
              {professionalInfo.certifications.length > 0 && (
                <div className="space-y-4 pt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Added Certifications:</Label>
                  <div className="space-y-3">
                    {professionalInfo.certifications.map((cert) => (
                      <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base mb-1">
                              {cert.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              Issued by {cert.issuer}
                            </p>
                            <p className="text-xs text-gray-500">
                              Year: {cert.year}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCertification(cert.id)}
                            className="h-6 w-6 p-0 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Personal Website */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Personal Website</Label>
              <p className="text-sm text-muted-foreground">Private</p>
              <Input placeholder="Provide a link to your own professional website" />
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