"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModernServiceGallery() {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
  ]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800">
        <Image
          src={images[currentImage]}
          alt="Service preview"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-white dark:hover:bg-zinc-800"
          onClick={() => setCurrentImage(currentImage > 0 ? currentImage - 1 : images.length - 1)}
        >
          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white dark:hover:bg-zinc-800"
          onClick={() => setCurrentImage(currentImage < images.length - 1 ? currentImage + 1 : 0)}
        >
          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </Button>
      </div>

      {/* Thumbnail Gallery */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                currentImage === index
                  ? "border-blue-500 dark:border-blue-400"
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-500"
              }`}
              style={{
                background: "transparent"
              }}
            >
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
