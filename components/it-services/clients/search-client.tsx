"use client"

import { useState, useMemo } from "react"
import { PopularCategoriesMenu } from "@/components/it-services/sections/search/popular-categories-menu"
import { CategoryHero } from "@/components/it-services/sections/search/category-hero"
import { SearchFilters } from "@/components/it-services/sections/search/search-filters"
import { ServiceGrid } from "@/components/it-services/service/service-grid"
import { Pagination } from "@/components/it-services/sections/search/pagination"
import { TrendingServices } from "@/components/it-services/service/trending-services"
import SubCategories from "@/components/it-services/sections/search/sub-categories"

export default function SearchClient() {
  const [activeCategory, setActiveCategory] = useState("Graphics & Design")

  const heroContent = useMemo(() => {
    const map: Record<string, { title: string; description: string; illustration: string; gradient: string }> = {
      "All Categories": {
        title: "All Services",
        description: "Explore a wide range of professional services tailored to your needs.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Graphics & Design": {
        title: "Graphics & Design",
        description: "Bring your ideas to life with stunning visuals and creative design.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Digital Marketing": {
        title: "Digital Marketing",
        description: "Grow your business with expert campaigns and measurable results.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Writing & Translation": {
        title: "Writing & Translation",
        description: "Words that engage, inform, and convert — in any language.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Video & Animation": {
        title: "Video & Animation",
        description: "Captivate your audience with motion and storytelling.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Music & Audio": {
        title: "Music & Audio",
        description: "Professional sound design, music production, and voice overs.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Programming & Tech": {
        title: "Programming & Tech",
        description: "Build, integrate, and scale with expert engineering.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Business": {
        title: "Business",
        description: "Consulting, planning, and operations to power your growth.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Lifestyle": {
        title: "Lifestyle",
        description: "Personalized coaching, wellness, and more to level up life.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
      "Trending": {
        title: "Trending Services",
        description: "What’s hot right now — discover the latest in-demand skills.",
        illustration: "/vector-service.png",
        gradient: "from-rose-200 via-red-100 to-orange-100",
      },
    }

    return map[activeCategory] ?? map["All Categories"]
  }, [activeCategory])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex flex-col">
      {/* PopularCategoriesMenu: sticky on top for mobile, static for desktop */}
      <div className="w-full sticky top-0 z-30 bg-white dark:bg-gray-950 md:static md:z-auto md:bg-transparent">
        <PopularCategoriesMenu
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      {/* CategoryHero: responsive padding and stacking */}
      <div className="w-full">
        <CategoryHero
          category={heroContent.title}
          description={heroContent.description}
          illustration={heroContent.illustration}
          gradient={heroContent.gradient}
        />
      </div>
      {/* SubCategories: responsive margin */}
      <div className="w-full">
        <SubCategories />
      </div>
      {/* Main content: responsive container and spacing */}
      <div className="w-full flex-1">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          
              <SearchFilters />
              <TrendingServices />
              <ServiceGrid />
              <Pagination />
        </div>
      </div>
    </div>
  )
}