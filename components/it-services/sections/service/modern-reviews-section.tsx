import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin } from "lucide-react"

export function ModernReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "John Smith",
      country: "United States",
      rating: 5,
      date: "1 week ago",
      text: "Excellent work! The website looks amazing and works perfectly. Very professional and delivered on time.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      country: "Canada",
      rating: 5,
      date: "2 weeks ago",
      text: "Outstanding developer! Great communication and delivered exactly what I needed. Highly recommended!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const ratingBreakdown = [
    { stars: 5, count: 224, percentage: 80 },
    { stars: 4, count: 42, percentage: 15 },
    { stars: 3, count: 10, percentage: 4 },
    { stars: 2, count: 3, percentage: 1 },
    { stars: 1, count: 1, percentage: 0 },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Reviews</h3>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">4.8</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400 dark:fill-yellow-400 dark:text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Based on 280 reviews</p>
        </div>

        <div className="space-y-2">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{item.stars}★</span>
              <Progress value={item.percentage} className="flex-1 h-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-b-0">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">{review.name}</h5>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    <span>{review.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400 dark:fill-yellow-400 dark:text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
