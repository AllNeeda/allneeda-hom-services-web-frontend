import { Button } from "@/components/ui/button"
import { Play, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CategoryHeroProps {
  category: string
  description: string
  illustration: string
  gradient?: string
}

export function CategoryHero({
  category,
  description,
  illustration,
  gradient = "from-orange-50 to-pink-50",
}: CategoryHeroProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} min-h-[18rem] sm:min-h-[20rem] lg:min-h-[22rem] py-4 px-4`}>
      <div className="max-w-7xl mx-auto h-full">
        <div
          className="
            h-full
            flex flex-col
            lg:flex-row
            items-center
            lg:items-center
            lg:justify-between
            gap-6 md:gap-10 lg:gap-12
          "
        >
          {/* Text content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-lg">
            {/* breadcrumbs */}
            <nav className="mb-3 sm:mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center">
                  <Link href="/" className="inline-flex items-center hover:text-gray-900">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="flex items-center">
                  <Link href="/it-services" className="hover:text-gray-900">
                    IT Services
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium line-clamp-1" aria-current="page">
                  {category}
                </li>
              </ol>
            </nav>
            {/* category with description */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {category}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{description}</p>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent text-sm sm:text-base">
              <Play className="h-4 w-4" />
              <span>How Servicyee Works</span>
            </Button>
          </div>
          {/* Image: hidden on md and below, visible on lg+ with fixed height */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="w-full max-w-md">
              <Image
                src={illustration}
                alt={`${category} illustration`}
                className="w-full h-64 xl:h-80 object-contain"
                width={400}
                height={320}
                priority
                unoptimized
                sizes="(min-width: 1024px) 400px, 0px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}