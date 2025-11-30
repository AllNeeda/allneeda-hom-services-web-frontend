import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4 px-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          1
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          2
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          3
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          4
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          5
        </Button>
        <span className="px-2 text-gray-500">...</span>
        <Button variant="outline" size="sm">
          20
        </Button>

        <Button variant="outline" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs sm:text-sm text-gray-600">1 - 20 of 300+ property available</p>
    </div>
  )
}
