import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface ServiceCardProps {
  service: {
    id: number
    image: string
    category: string
    title: string
    rating: number
    reviews: number
    author: {
      name: string
      avatar: string
    }
    price: number
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 py-0  dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 h-full flex flex-col w-full">
      <CardContent className="p-0 flex flex-col h-full ">
        <div className="relative w-full h-48 ">
          <Link href={"/it-services/service/"}>
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover rounded-t-lg"
            style={{ backgroundColor: "var(--card-img-bg, #f3f4f6)" }}
            priority={false}
          />
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full"
          >
            <Heart className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </Button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <Badge
            variant="secondary"
            className="mb-2 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {service.category}
          </Badge>

          <h3 className="font-medium text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight text-sm">
            <Link href={"/it-services/service/"}>
            {service.title}
            </Link>
          </h3>

          <div className="flex items-center mb-4">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-100">{service.rating}</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              ({service.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <Image
                src={service.author.avatar || "/placeholder.svg"}
                alt={service.author.name}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{service.author.name}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Starting at</div>
              <div className="font-semibold text-gray-900 dark:text-white">${service.price}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
