"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface OverviewStepProps {
   // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
  currentStep: number
  totalSteps: number
}
 // eslint-disable-next-line
interface Category {
  label:string;
  value:string;
}

// Add strong typing for metadata keys/state
type MetadataKeys = "websiteType" | "programmingLanguage" | "websiteFeatures"

interface OverviewState {
  title: string
  category: string
  subcategory: string
  serviceType: string
  metadata: Record<MetadataKeys, string[]>
  searchTags: string[]
  positiveKeywords: string[]
  licenseAgreement: boolean
}

 // eslint-disable-next-line
export function OverviewStep({ onNext, formData }: OverviewStepProps) {
  const [overview, setOverview] = useState<OverviewState>({
    title: "I will build a modern full stack web application with Next.js, React, and Django",
    category: "technology",
    subcategory: "Software",
    serviceType: "CUSTOM WEBSITES",
    metadata: {
      websiteType: ["E-COMMERCE STORE"],
      programmingLanguage: ["ASP.NET", "JavaScript", "HTML & CSS", "Perl"],
      websiteFeatures: ["Marketing", "Forum", "Customer support", "Inventory"],
    },
    searchTags: ["NEXT JS APP", "WEB DEVELOPMENT", "WEB APPLICATION", "CREATE WEBSITE", "FULL STACK APP"],
    positiveKeywords: ["WEB DEVELOPEMENT", "FULL STACK", "NEXTJS"], // Changed to array
    licenseAgreement: false,
  })

  const [activeMetadataTab, setActiveMetadataTab] = useState<MetadataKeys>("websiteType")
  const [keywordInput, setKeywordInput] = useState("")

  const websiteTypes = ["BUSINESS", "E-COMMERCE STORE", "LANDING PAGE", "BLOG", "PORTFOLIO"]

  const programmingLanguages = [
    "ASP.NET", "JavaScript", "HTML & CSS", "Perl", "PHP", "Python", "Ruby/RoR", "Scala",
    "Flash", "Java", "TypeScript", "C#", "Go", "Kotlin", "React", "Bootstrap", "AngularJS",
    "Tailwind CSS", "JQuery", "Angular", "Django", "Vue.js", "Other"
  ]

  const websiteFeatures = [
    "Marketing", "Forum", "Customer support", "Inventory", "Payment", "Social media", "Shipping",
    "Analytics", "Video", "Form", "Events", "Music", "Chat", "Membership", "Map", "FAQ",
    "Gallery", "Booking", "Calendar", "Portfolio", "Dashboard", "Reviews", "Landing page", "Blog"
  ]

  const categories = [
    { 
      label: "Technology", 
      value: "technology",
      subcategories: ["Software", "Hardware", "AI", "Gadgets"]
    },
    { 
      label: "Health", 
      value: "health",
      subcategories: ["Nutrition", "Fitness", "Mental Health", "Medicine"]
    },
    { 
      label: "Education", 
      value: "education",
      subcategories: ["Schools", "Online Courses", "Universities", "Tutoring"]
    },
    { 
      label: "Business", 
      value: "business",
      subcategories: ["Startups", "Marketing", "Finance", "Management"]
    },
    { 
      label: "Entertainment", 
      value: "entertainment",
      subcategories: ["Movies", "Music", "TV Shows", "Gaming"]
    },
    { 
      label: "Sports", 
      value: "sports",
      subcategories: ["Football", "Basketball", "Tennis", "Cricket"]
    },
    { 
      label: "Science", 
      value: "science",
      subcategories: ["Physics", "Biology", "Chemistry", "Astronomy"]
    },
    { 
      label: "Travel", 
      value: "travel",
      subcategories: ["Adventure", "Luxury", "Budget Travel", "Destinations"]
    },
    { 
      label: "Food", 
      value: "food",
      subcategories: ["Recipes", "Restaurants", "Healthy Eating", "Street Food"]
    },
    { 
      label: "Art & Culture", 
      value: "art-culture",
      subcategories: ["Painting", "Sculpture", "Music", "Theater"]
    },
  ];

  // Get current subcategories based on selected category
  const currentSubcategories = categories.find(cat => cat.value === overview.category)?.subcategories || []
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(overview)
  }

  const toggleMetadataItem = (category: MetadataKeys, item: string) => {
    setOverview((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [category]: prev.metadata[category].includes(item)
          ? prev.metadata[category].filter((i: string) => i !== item)
          : [...prev.metadata[category], item],
      },
    }))
  }

  const handleCategoryChange = (categoryValue: string) => {
    setOverview(prev => ({ 
      ...prev, 
      category: categoryValue,
      subcategory: "" // Reset subcategory when category changes
    }))
  }

  const getSelectedCount = (category: MetadataKeys) => {
    return overview.metadata[category]?.length || 0
  }

  const getMaxCount = (category: MetadataKeys) => {
    switch (category) {
      case "websiteType": return 5
      case "programmingLanguage": return 10
      case "websiteFeatures": return 10
      default: return 5
    }
  }

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && overview.positiveKeywords.length < 5) {
      setOverview(prev => ({
        ...prev,
        positiveKeywords: [...prev.positiveKeywords, keyword.trim().toUpperCase()]
      }))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setOverview(prev => ({
      ...prev,
      positiveKeywords: prev.positiveKeywords.filter((keyword: string) => keyword !== keywordToRemove)
    }))
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword(keywordInput)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1  gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2">

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Service Title */}
            <div className="space-y-3 lg:space-y-4">
              <div>
                <Label className="text-base font-medium">Service title</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  As your Service storefront, your title is the most important place to include keywords that buyers would
                  likely use to search for a service like yours.
                </p>
              </div>
              <div className="relative">
                <Textarea
                  value={overview.title}
                  onChange={(e) => setOverview((prev) => ({ ...prev, title: e.target.value }))}
                  className="min-h-20 pr-16 text-sm sm:text-base"
                  placeholder="I will do something I'm really good at"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">{overview.title.length} / 80 max</div>
              </div>
              <p className="text-xs text-red-500">This can contain letters and numbers only</p>
            </div>

            {/* Category */}
            <div>
                <div>
                  <Label>Category</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 py-3 lg:py-4">
                    Choose the category and sub-category most suitable for your Service.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 py-3 lg:py-4">
                  <div>
                    {/* Main category */}
                    <Select
                      value={overview.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-full text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item, index) => (
                          <SelectItem value={item.value} key={index}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {/* Sub category - now dynamic based on selected category */}
                    <Select
                      value={overview.subcategory}
                      onValueChange={(value) => setOverview((prev) => ({ ...prev, subcategory: value }))}
                      disabled={!overview.category} // Disable if no category selected
                    >
                      <SelectTrigger className="w-full text-sm sm:text-base">
                        <SelectValue placeholder={overview.category ? "Select subcategory" : "Select category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {currentSubcategories.map((subcat, index) => (
                          <SelectItem value={subcat} key={index}>
                            {subcat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
            </div>

            {/* Service Metadata */}
            <div className="space-y-3 lg:space-y-4">
              <div>
                <Label className="text-base font-medium">Service metadata</Label>
              </div>

              {/* Metadata Tabs Container */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Sidebar - Metadata Categories */}
                  <div className="w-full lg:w-1/3 bg-gray-100 dark:bg-gray-700 p-3 lg:p-4 space-y-3 lg:space-y-4">
                    {/* Website Type Tab */}
                    <div 
                      className={`cursor-pointer p-2 lg:p-3 rounded-lg transition-colors ${
                        activeMetadataTab === "websiteType" 
                          ? "bg-white dark:bg-gray-800 shadow-sm" 
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveMetadataTab("websiteType")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm lg:text-base">
                          WEBSITE TYPE *
                        </span>
                        <span className="text-green-600">✓</span>
                      </div>
                      {activeMetadataTab === "websiteType" && (
                        <div className="mt-2 text-xs text-gray-500">
                          {getSelectedCount("websiteType")} / {getMaxCount("websiteType")}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600"></div>

                    {/* Programming Language Tab */}
                    <div 
                      className={`cursor-pointer p-2 lg:p-3 rounded-lg transition-colors ${
                        activeMetadataTab === "programmingLanguage" 
                          ? "bg-white dark:bg-gray-800 shadow-sm" 
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveMetadataTab("programmingLanguage")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm lg:text-base">
                          PROGRAMMING LANGUAGE
                        </span>
                        <span className="text-green-600">✓</span>
                      </div>
                      {activeMetadataTab === "programmingLanguage" && (
                        <div className="mt-2 text-xs text-gray-500">
                          {getSelectedCount("programmingLanguage")} / {getMaxCount("programmingLanguage")}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600"></div>

                    {/* Website Features Tab */}
                    <div 
                      className={`cursor-pointer p-2 lg:p-3 rounded-lg transition-colors ${
                        activeMetadataTab === "websiteFeatures" 
                          ? "bg-white dark:bg-gray-800 shadow-sm" 
                          : "hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => setActiveMetadataTab("websiteFeatures")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm lg:text-base">
                          WEBSITE FEATURES *
                        </span>
                        <span className="text-green-600">✓</span>
                      </div>
                      {activeMetadataTab === "websiteFeatures" && (
                        <div className="mt-2 text-xs text-gray-500">
                          {getSelectedCount("websiteFeatures")} / {getMaxCount("websiteFeatures")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Content Pane */}
                  <div className="w-full lg:w-2/3 p-4 lg:p-6 bg-white dark:bg-gray-800">
                    {/* Website Type Content */}
                    {activeMetadataTab === "websiteType" && (
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <Label className="text-base font-medium">
                            Select the website type you support*
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 gap-2 lg:gap-3">
                          {websiteTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={overview.metadata.websiteType.includes(type)}
                                onCheckedChange={() => toggleMetadataItem("websiteType", type)}
                              />
                              <Label htmlFor={type} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Programming Language Content */}
                    {activeMetadataTab === "programmingLanguage" && (
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <Label className="text-base font-medium">
                            Select the language you provide services for
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                          {programmingLanguages.map((lang) => (
                            <div key={lang} className="flex items-center space-x-2">
                              <Checkbox
                                id={lang}
                                checked={overview.metadata.programmingLanguage.includes(lang)}
                                onCheckedChange={() => toggleMetadataItem("programmingLanguage", lang)}
                              />
                              <Label htmlFor={lang} className="text-sm">
                                {lang}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website Features Content */}
                    {activeMetadataTab === "websiteFeatures" && (
                      <div className="space-y-3 lg:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <Label className="text-base font-medium">
                            Select the features you support*
                          </Label>
                          <span className="text-sm text-gray-500">
                            {getSelectedCount("websiteFeatures")} / {getMaxCount("websiteFeatures")}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                          {websiteFeatures.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={overview.metadata.websiteFeatures.includes(feature)}
                                onCheckedChange={() => toggleMetadataItem("websiteFeatures", feature)}
                              />
                              <Label htmlFor={feature} className="text-sm">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Tags and Positive Keywords */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8">
              <div className="space-y-3 lg:space-y-4">
                <div>
                  <Label className="text-base font-medium">Positive keywords</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Enter search terms you feel your buyers will use when looking for your service.
                  </p>
                </div>
                
                {/* Tag Input Field */}
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-12 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Display existing tags */}
                    {overview.positiveKeywords.map((keyword) => (
                      <div 
                        key={keyword} 
                        className="flex items-center gap-1 bg-gray-200 dark:bg-gray-600 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm text-gray-800 dark:text-gray-200"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Input field for new tags */}
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={handleKeywordKeyPress}
                      placeholder={overview.positiveKeywords.length >= 5 ? "Maximum tags reached" : "Type and press Enter..."}
                      disabled={overview.positiveKeywords.length >= 5}
                      className="flex-1 min-w-24 lg:min-w-32 outline-none bg-transparent text-sm placeholder-gray-400 disabled:placeholder-gray-300"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  {overview.positiveKeywords.length} / 5 tags maximum. Use letters and numbers only.
                </p>
              </div>
            </div>

            {/* License Agreement */}
            <div className="flex items-start space-x-3 p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Checkbox
                id="license"
                checked={overview.licenseAgreement}
                onCheckedChange={(checked) => setOverview((prev) => ({ ...prev, licenseAgreement: !!checked }))}
              />
              <div className="text-sm">
                <Label htmlFor="license" className="font-medium">
                  I declare that I have obtained all necessary licenses to offer this service under applicable laws.
                </Label>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  I understand that providing licensed services without the required license goes against Services{" "}
                  <Button variant="link" className="p-0 h-auto text-green-600">
                    Community Standards
                  </Button>{" "}
                  and may result in permanent suspension of my account.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 lg:px-8 text-sm lg:text-base">
                Save & Continue
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
