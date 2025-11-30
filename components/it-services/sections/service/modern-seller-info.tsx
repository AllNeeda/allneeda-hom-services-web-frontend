import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, CheckCircle, MessageCircle } from "lucide-react"

export function ModernSellerInfo() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">About The Seller</h3>

      <div className="flex gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Seller" />
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Md. Mahim</h4>
            <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            >
              Top Rated Seller
            </Badge>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300"
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

          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            Professional full-stack developer with 5+ years of experience. Specialized in modern web technologies and
            delivering high-quality solutions.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Avg. Response Time</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">1 hour</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500 dark:text-gray-400">Last Delivery</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">1 day</div>
            </div>
          </div>

          <Button className="w-full bg-transparent dark:bg-transparent" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  )
}
