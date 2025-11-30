import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import Image from "next/image"

interface FreelancerCardProps {
  freelancer: {
    id: number
    name: string
    profession: string
    avatar: string
    rating: number
    reviews: number
    skills: string[]
    location: string
    rate: string
    jobSuccess: string
    isOnline: boolean
  }
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 h-full flex flex-col">
      <CardContent className="px-4 flex flex-col h-full">
        {/* Profile Header */}
        <div className="text-center mb-3">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2">
              <Image
                src={freelancer.avatar}
                alt={freelancer.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Online Status Dot */}
            {freelancer.isOnline && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            )}
          </div>
          
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{freelancer.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{freelancer.profession}</p>
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">{freelancer.rating}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">({freelancer.reviews} reviews)</span>
          </div>
        </div>

        {/* Skills - Natural height */}
        <div className="flex flex-wrap gap-1 mb-3 justify-center">
          {freelancer.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800 text-xs px-2 py-1"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Details - Natural height */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Location</p>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{freelancer.location}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Rate</p>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{freelancer.rate}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Job Success</p>
            <p className="font-medium text-gray-900 dark:text-white text-sm">{freelancer.jobSuccess}</p>
          </div>
        </div>

        {/* View Profile Button - Always at bottom */}
        <div className="mt-auto">
          <Button className="w-full bg-green-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-green-200 dark:hover:bg-emerald-900 hover:text-emerald-700 dark:hover:text-emerald-300 border-0 font-medium text-sm py-2">
            View Profile
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 