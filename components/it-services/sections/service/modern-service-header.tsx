import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Award } from "lucide-react"

export function ModernServiceHeader() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-8">
      <div className="space-y-6">
        {/* Service Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            I will do website development as full stack web developer, PHP, Laravel
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Professional full-stack development with modern technologies and best practices
          </p>
        </div>

        {/* Seller Profile */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Seller" />
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Md. Mahim</h3>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              >
                <Award className="h-3 w-3 mr-1" />
                Top Rated
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-400 dark:text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">4.8</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">(280)</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
