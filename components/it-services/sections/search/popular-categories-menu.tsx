"use client"

import { useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"

const categories = [
  { name: "All Categories", active: false },
  { name: "Graphics & Design", active: true },
  { name: "Digital Marketing", active: false },
  { name: "Writing & Translation", active: false },
  { name: "Video & Animation", active: false },
  { name: "Music & Audio", active: false },
  { name: "Programming & Tech", active: false },
  { name: "Business", active: false },
  { name: "Lifestyle", active: false },
  { name: "Trending", active: false },
]

export function PopularCategoriesMenu({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string
  //eslint-disable-next-line
  onCategoryChange: (category: string) => void
}) {
  const items = useMemo(() => categories.map(c => c.name), [])
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (name: string) => {
    onCategoryChange(name)
    // Remove all params and set only the new category param
    const params = new URLSearchParams()
    params.set("category", name)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Remove container and px on small screens, only use container on md+ */}
      <div className="w-full md:container md:mx-auto md:px-4 px-0">
        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 overflow-x-auto py-3 sm:py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-2 sm:px-2 md:px-0">
          {items.map((name) => (
            <button
              key={name}
              onClick={() => handleClick(name)}
              className={`whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === name
                  ? "text-emerald-600 border-b-2 border-emerald-600 pb-3 sm:pb-4"
                  : "text-gray-600 hover:text-gray-900 pb-3 sm:pb-4"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}