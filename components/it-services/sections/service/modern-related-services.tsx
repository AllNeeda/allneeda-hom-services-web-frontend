import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

export function ModernRelatedServices() {
  const services = [
    {
      id: 1,
      title: "I will create a responsive website using React and Node.js",
      price: 25,
      rating: 4.9,
      reviews: 156,
      seller: "Alex Johnson",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "I will build a custom e-commerce website with payment integration",
      price: 85,
      rating: 4.8,
      reviews: 203,
      seller: "Maria Garcia",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "I will develop a modern landing page with animations",
      price: 35,
      rating: 4.7,
      reviews: 89,
      seller: "David Chen",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "I will create a full-stack web application with database",
      price: 120,
      rating: 4.9,
      reviews: 167,
      seller: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Related Services</h3>
        <Button variant="outline">View All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg mb-3">
              <Image
                src={service.image || "https://via.placeholder.com/400x300?text=Service"}
                alt={service.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-zinc-800"
              >
                <Heart className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt={service.seller} />
                  <AvatarFallback className="text-xs">{service.seller.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-300">{service.seller}</span>
              </div>

              <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {service.title}
              </h4>

              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.rating}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({service.reviews})</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Starting at</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">${service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
