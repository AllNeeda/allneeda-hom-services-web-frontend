"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, SlidersHorizontal, X, Filter, MapPin, Clock, DollarSign, Star, Globe, Palette } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function SearchFilters() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showAllFilters, setShowAllFilters] = useState(false)
  const [budgetRange, setBudgetRange] = useState([20, 70987])
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["United Kingdom"])
  const [selectedLevel, setSelectedLevel] = useState("Level Two")
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState("Up to 3 days")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [selectedDesignTools, setSelectedDesignTools] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const toggleFilter = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName)
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations([...selectedLocations, location])
    } else {
      setSelectedLocations(selectedLocations.filter((l) => l !== location))
    }
  }

  const handleDesignToolChange = (tool: string, checked: boolean) => {
    if (checked) {
      setSelectedDesignTools([...selectedDesignTools, tool])
    } else {
      setSelectedDesignTools(selectedDesignTools.filter((t) => t !== tool))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages([...selectedLanguages, language])
    } else {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language))
    }
  }

  return (
    <>
      {showAllFilters && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 " onClick={() => setShowAllFilters(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-80 sm:w-96 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 z-50 ${showAllFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">All Filters</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllFilters(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Refine your search with advanced filters</p>
          </div>

          {/* Filter Sections */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Delivery Time Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("delivery")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Delivery Time</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("delivery") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("delivery") && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <RadioGroup value={selectedDeliveryTime} onValueChange={setSelectedDeliveryTime}>
                    <div className="flex items-center justify-between p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Express 24H" id="express" />
                        <Label htmlFor="express" className="text-gray-700 dark:text-gray-300">Express 24H</Label>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(1,945)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Up to 3 days" id="3days" />
                        <Label htmlFor="3days" className="text-gray-700 dark:text-gray-300">Up to 3 days</Label>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(8,136)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Up to 7 days" id="7days" />
                        <Label htmlFor="7days" className="text-gray-700 dark:text-gray-300">Up to 7 days</Label>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(917)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Anytime" id="anytime" />
                        <Label htmlFor="anytime" className="text-gray-700 dark:text-gray-300">Anytime</Label>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">(240)</span>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>

            {/* Budget Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("budget")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Budget Range</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("budget") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("budget") && (
                <div className="mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <Slider
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      max={100000}
                      min={0}
                      step={10}
                      className="mb-4"
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      ${budgetRange[0].toLocaleString()} - ${budgetRange[1].toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      value={budgetRange[0]}
                      onChange={(e) => setBudgetRange([Number.parseInt(e.target.value) || 0, budgetRange[1]])}
                      className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="$20"
                    />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <Input
                      type="number"
                      value={budgetRange[1]}
                      onChange={(e) => setBudgetRange([budgetRange[0], Number.parseInt(e.target.value) || 0])}
                      className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      placeholder="$70987"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Design Tool Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("designTool")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Design Tools</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("designTool") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("designTool") && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {["Figma", "Adobe Photoshop", "Adobe Illustrator", "Sketch", "Canva", "InVision"].map((tool) => (
                    <div key={tool} className="flex items-center space-x-3 p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <Checkbox
                        id={tool.toLowerCase().replace(/\s+/g, '-')}
                        checked={selectedDesignTools.includes(tool)}
                        onCheckedChange={(checked) => handleDesignToolChange(tool, !!checked)}
                      />
                      <Label htmlFor={tool.toLowerCase().replace(/\s+/g, '-')} className="text-gray-700 dark:text-gray-300">
                        {tool}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("location")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Location</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("location") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("location") && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {["United States", "United Kingdom", "Canada", "Germany", "Turkey", "Australia", "India", "Brazil"].map((location) => (
                    <div key={location} className="flex items-center space-x-3 p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <Checkbox
                        id={location.toLowerCase().replace(/\s+/g, '-')}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={(checked) => handleLocationChange(location, !!checked)}
                      />
                      <Label htmlFor={location.toLowerCase().replace(/\s+/g, '-')} className="text-gray-700 dark:text-gray-300">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Speaks Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("speaks")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Languages</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("speaks") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("speaks") && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {["English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Portuguese"].map((language) => (
                    <div key={language} className="flex items-center space-x-3 p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <Checkbox
                        id={language.toLowerCase().replace(/\s+/g, '-')}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={(checked) => handleLanguageChange(language, !!checked)}
                      />
                      <Label htmlFor={language.toLowerCase().replace(/\s+/g, '-')} className="text-gray-700 dark:text-gray-300">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() => toggleSection("level")}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Seller Level</h4>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    expandedSections.includes("level") ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              {expandedSections.includes("level") && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {["Top Rated Seller", "Level Two", "Level One", "New Seller"].map((level) => (
                    <div key={level} className="flex items-center space-x-3 p-3 sm:p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 touch-manipulation">
                      <Checkbox
                        id={level.toLowerCase().replace(/\s+/g, '-')}
                        checked={selectedLevel === level}
                        onCheckedChange={(checked) => checked && setSelectedLevel(level)}
                      />
                      <Label htmlFor={level.toLowerCase().replace(/\s+/g, '-')} className="text-gray-700 dark:text-gray-300">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setSelectedLocations([])
                  setSelectedLevel("Level Two")
                  setSelectedDeliveryTime("Up to 3 days")
                  setBudgetRange([20, 70987])
                  setSelectedDesignTools([])
                  setSelectedLanguages([])
                }}
              >
                Clear All
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowAllFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8 relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 lg:mb-0">
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base"
            onClick={() => setShowAllFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">All Filters</span>
            <span className="sm:hidden">Filters</span>
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base"
              onClick={() => toggleFilter("delivery")}
            >
              <span className="hidden sm:inline">Delivery Time</span>
              <span className="sm:hidden">Delivery</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {activeFilter === "delivery" && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 z-30 max-h-96 overflow-y-auto">
                <RadioGroup value={selectedDeliveryTime} onValueChange={setSelectedDeliveryTime}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Express 24H" id="express" />
                    <Label htmlFor="express" className="text-gray-700 dark:text-gray-300">Express 24H</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Up to 3 days" id="3days" />
                    <Label htmlFor="3days" className="text-gray-700 dark:text-gray-300">Up to 3 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Up to 7 days" id="7days" />
                    <Label htmlFor="7days" className="text-gray-700 dark:text-gray-300">Up to 7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Anytime" id="anytime" />
                    <Label htmlFor="anytime" className="text-gray-700 dark:text-gray-300">Anytime</Label>
                  </div>
                </RadioGroup>
                <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">Apply →</Button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base"
              onClick={() => toggleFilter("budget")}
            >
              <span>Budget</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {activeFilter === "budget" && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 z-30 max-h-96 overflow-y-auto">
                <div className="mb-6">
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={100000}
                    min={0}
                    step={10}
                    className="mb-4"
                  />
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <Input
                    type="number"
                    value={budgetRange[0]}
                    onChange={(e) => setBudgetRange([Number.parseInt(e.target.value), budgetRange[1]])}
                    className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="$20"
                  />
                  <span className="text-gray-600 dark:text-gray-400">—</span>
                  <Input
                    type="number"
                    value={budgetRange[1]}
                    onChange={(e) => setBudgetRange([budgetRange[0], Number.parseInt(e.target.value)])}
                    className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="$70987"
                  />
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Apply →</Button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base"
              onClick={() => toggleFilter("level")}
            >
              <span>Level</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {activeFilter === "level" && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 z-30 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="top-rated"
                      checked={selectedLevel === "Top Rated Seller"}
                      onCheckedChange={(checked) => checked && setSelectedLevel("Top Rated Seller")}
                    />
                    <Label htmlFor="top-rated" className="text-gray-700 dark:text-gray-300">Top Rated Seller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="level-two"
                      checked={selectedLevel === "Level Two"}
                      onCheckedChange={(checked) => checked && setSelectedLevel("Level Two")}
                    />
                    <Label htmlFor="level-two" className="text-gray-700 dark:text-gray-300">Level Two</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="level-one"
                      checked={selectedLevel === "Level One"}
                      onCheckedChange={(checked) => checked && setSelectedLevel("Level One")}
                    />
                    <Label htmlFor="level-one" className="text-gray-700 dark:text-gray-300">Level One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new-seller"
                      checked={selectedLevel === "New Seller"}
                      onCheckedChange={(checked) => checked && setSelectedLevel("New Seller")}
                    />
                    <Label htmlFor="new-seller" className="text-gray-700 dark:text-gray-300">New Seller</Label>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">Apply →</Button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base"
              onClick={() => toggleFilter("location")}
            >
              <span>Location</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {activeFilter === "location" && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 z-30 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="us"
                      checked={selectedLocations.includes("United States")}
                      onCheckedChange={(checked) => handleLocationChange("United States", !!checked)}
                    />
                    <Label htmlFor="us" className="text-gray-700 dark:text-gray-300">United States</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uk"
                      checked={selectedLocations.includes("United Kingdom")}
                      onCheckedChange={(checked) => handleLocationChange("United Kingdom", !!checked)}
                    />
                    <Label htmlFor="uk" className="text-gray-700 dark:text-gray-300">United Kingdom</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canada"
                      checked={selectedLocations.includes("Canada")}
                      onCheckedChange={(checked) => handleLocationChange("Canada", !!checked)}
                    />
                    <Label htmlFor="canada" className="text-gray-700 dark:text-gray-300">Canada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="germany"
                      checked={selectedLocations.includes("Germany")}
                      onCheckedChange={(checked) => handleLocationChange("Germany", !!checked)}
                    />
                    <Label htmlFor="germany" className="text-gray-700 dark:text-gray-300">Germany</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="turkey"
                      checked={selectedLocations.includes("Turkey")}
                      onCheckedChange={(checked) => handleLocationChange("Turkey", !!checked)}
                    />
                    <Label htmlFor="turkey" className="text-gray-700 dark:text-gray-300">Turkey</Label>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">Apply →</Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm sm:text-base">
            <span className="hidden sm:inline">Best Seller</span>
            <span className="sm:hidden">Best</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeFilter && <div className="fixed inset-0 z-20" onClick={() => setActiveFilter(null)} />}
    </>
  )
}
