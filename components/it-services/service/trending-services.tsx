"use client"

import { ServiceCard } from "@/components/it-services/service/service-card"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function TrendingServices() {
  const searchParams = useSearchParams()
 

  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      id: 3,
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&w=600",
      category: "Design & Creative",
      title: "I will build a fully responsive design in HTML,CSS, bootstrap...",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Sophie Lee",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      price: 983,
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will do mobile app development for ios and android",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Carlos Vega",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      },
      price: 983,
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will design modern websites in figma or adobe xd",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Mia Chen",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      price: 983,
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will design modern websites in figma or adobe xd",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Wanda Runo",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      price: 983,
    },
    {
      id: 7,
      image: "https://images.pexels.com/photos/3861973/pexels-photo-3861973.jpeg?auto=compress&w=600",
      category: "Design & Creative",
      title: "I will build a fully responsive design in HTML,CSS, bootstrap...",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Ali Tufan",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      price: 983,
    },
    {
      id: 8,
      image: "https://images.pexels.com/photos/3861974/pexels-photo-3861974.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will do mobile app development for ios and android",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Carlos Vega",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      },
      price: 983,
    },
    {
      id: 9,
      image: "https://images.pexels.com/photos/3861975/pexels-photo-3861975.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will design modern websites in figma or adobe xd",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Mia Chen",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      price: 983,
    },
    {
      id: 10,
      image: "https://images.pexels.com/photos/3861976/pexels-photo-3861976.jpeg?auto=compress&w=600",
      category: "Web & App Design",
      title: "I will design modern websites in figma or adobe xd",
      rating: 4.82,
      reviews: 94,
      author: {
        name: "Sophie Lee",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      price: 983,
    },
  ]

  const nextSlide = () => {
    if (containerRef.current) {
      const cardWidth = (containerRef.current.children[0] as HTMLElement)?.clientWidth || 0
      const gap = 24 // gap-6
      const scrollAmount = cardWidth + gap
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 4))
  }

  const prevSlide = () => {
    if (containerRef.current) {
      const cardWidth = (containerRef.current.children[0] as HTMLElement)?.clientWidth || 0
      const gap = 24 // gap-6
      const scrollAmount = cardWidth + gap
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
    setCurrentSlide(
      (prev) => (prev - 1 + Math.ceil(services.length / 4)) % Math.ceil(services.length / 4),
    )
  }

   // If there are any search params, do not show the component
   if (searchParams && Array.from(searchParams.entries()).length > 0) {
    return null
  }

  return (
    <section className=" bg-gray-50 dark:bg-gray-950 ">
      <div className="max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-200/70 dark:border-gray-800/70 shadow-sm rounded-xl px-4 pt-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 my-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Trending Services</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Most viewed and all-time top-selling services</p>
          </div>

          {/* Navigation */}
          <div className="hidden">
            <Button
              aria-label="Previous slide"
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="hidden sm:flex gap-2">
              {Array.from({ length: Math.ceil(services.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide 
                      ? "bg-emerald-500 dark:bg-emerald-400" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <Button
              aria-label="Next slide"
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel with centered overlay nav on large screens */}
        <div className="relative">
          {/* Left overlay button */}
          <div className="hidden lg:block">
            <Button
              aria-label="Previous slide"
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 rounded-full border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Scroll container */}
          <div 
            ref={containerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory mx-4 px-8 sm:px-10 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((item,index)=>(
              <div key={index} className="snap-start flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 min-w-0">
                <ServiceCard service={item} />
              </div>
            ))}
          </div>

          {/* Right overlay button */}
          <div className="hidden lg:block">
            <Button
              aria-label="Next slide"
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 rounded-full border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dots on non-large screens */}
        <div className="flex lg:hidden justify-center gap-2 mt-2">
          {Array.from({ length: Math.ceil(services.length / 2) }).map((_, index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                index === currentSlide ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Bottom nav on md and smaller screens (hidden on lg and up) */}
        <div className="mt-4 mb-6 flex lg:hidden justify-center gap-3">
          <Button
            aria-label="Previous slide"
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Next slide"
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}