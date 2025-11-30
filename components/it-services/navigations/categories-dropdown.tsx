"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface Category {
  id: string
  name: string
  icon: string
  subcategories: {
    [key: string]: string[]
  }
}

const categories: Category[] = [
  {
    id: "development",
    name: "Development & IT",
    icon: "💻",
    subcategories: {
      "Web & App Design": ["Website Design", "App Design", "UX Design", "Landing Page Design", "Icon Design"],
    },
  },
  {
    id: "design",
    name: "Design & Creative",
    icon: "🎨",
    subcategories: {
      "Web & App Design": ["Website Design", "App Design", "UX Design", "Landing Page Design", "Icon Design"],
      "Art & Illustration": [
        "Illustration",
        "NFT Art",
        "Pattern Design",
        "Portraits & Caricatures",
        "Cartoons & Comics",
        "Tattoo Design",
        "Storyboards",
      ],
      "Visual Design": [
        "Image Editing",
        "Presentation Design",
        "Infographic Design",
        "Vector Tracing",
        "Resume Design",
      ],
    },
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    icon: "📊",
    subcategories: {
      "Marketing Design": ["Social Media Design", "Email Design", "Web Banners", "Signage Design"],
    },
  },
  {
    id: "writing",
    name: "Writing & Translation",
    icon: "✍️",
    subcategories: {
      "Content Writing": ["Article Writing", "Blog Writing", "Copywriting", "Technical Writing"],
    },
  },
  {
    id: "music",
    name: "Music & Audio",
    icon: "🎵",
    subcategories: {
      "Audio Production": ["Music Production", "Voice Over", "Audio Editing", "Sound Design"],
    },
  },
  {
    id: "video",
    name: "Video & Animation",
    icon: "🎬",
    subcategories: {
      "Video Production": ["Video Editing", "Animation", "Motion Graphics", "Explainer Videos"],
    },
  },
  {
    id: "engineering",
    name: "Engineering & Architecture",
    icon: "🏗️",
    subcategories: {
      Engineering: ["CAD Design", "3D Modeling", "Architecture Design", "Product Design"],
    },
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    icon: "💰",
    subcategories: {
      Gaming: ["Game Art", "Graphics for Streamers", "Twitch Store"],
      "Print Design": ["T-Shirts & Merchandise", "Flyer Design", "Brochure Design", "Poster Design", "Catalog Design"],
    },
  },
]

interface CategoriesDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CategoriesDropdown({ isOpen, onClose }: CategoriesDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0])

  if (!isOpen) return null

  return (
    <div
      className={`absolute top-full left-0 rounded bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50 w-fit min-w-[800px] max-w-4xl transition-all duration-300 ease-out ${
        isOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      onMouseLeave={onClose}
    >
      <div className="px-6 py-6">
        <div className="flex">
          {/* Left Sidebar - Main Categories */}
          <div className="w-64 rounded-lg px-4 flex-shrink-0">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCategory.id === category.id
                    ? "  text-emerald-800 dark:text-emerald-300"
                    : " text-gray-700 dark:text-gray-200"
                }`}
                onMouseEnter={() => setSelectedCategory(category)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            ))}
          </div>

          {/* Right Content - Subcategories */}
          <div className="pl-6 flex-1 min-w-0 pt-2">
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(selectedCategory.subcategories).map(([categoryName, items]) => (
                <div key={categoryName}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{categoryName}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item}>
                                                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
