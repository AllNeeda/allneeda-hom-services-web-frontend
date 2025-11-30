import { Suspense } from "react"
import { HeroSection } from "@/components/it-services/sections/main-page/hero-section"
import { TrendingServices  } from "@/components/it-services/service/trending-services"
import { ServiceGrid } from "@/components/it-services/service/service-grid"
import PopularCategories from "@/components/it-services/sections/main-page/popular-categories"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1">
        <HeroSection />
        <PopularCategories />
        <Suspense>
          <TrendingServices />
        </Suspense>
        <Suspense>
          <ServiceGrid />
        </Suspense>
      </main>
    </div>
  )
}
