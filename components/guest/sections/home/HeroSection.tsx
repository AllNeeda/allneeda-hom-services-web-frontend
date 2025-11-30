"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wrench, Monitor, UtensilsCrossed, ShoppingCart, Sparkles, Car, Heart } from "lucide-react"
import Image from "next/image"

interface Service {
  id: number
  title: string
  description: string
  features: string[]
  image: string
  icon: React.ReactNode
  gradient: string
}

const services: Service[] = [
  {
    id: 1,
    title: "HVAC Services",
    description: "Professional heating, ventilation, and air conditioning solutions for your home and business. Our certified technicians ensure optimal comfort year-round.",
    features: ["24/7 Emergency Service", "Energy Efficiency Audits", "Preventive Maintenance", "Smart Thermostat Installation"],
    image: "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Wrench className="w-8 h-8" />,
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: 2,
    title: "IT Services",
    description: "Comprehensive technology solutions including network setup, cybersecurity, cloud services, and technical support for businesses of all sizes.",
    features: ["Cloud Migration", "Cybersecurity Solutions", "24/7 Help Desk", "Network Infrastructure"],
    image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Monitor className="w-8 h-8" />,
    gradient: "from-purple-600 to-blue-500"
  },
  {
    id: 3,
    title: "Food Services",
    description: "Premium catering and food delivery services for events, offices, and special occasions. Fresh ingredients, diverse menus, and exceptional presentation.",
    features: ["Custom Menu Planning", "Event Catering", "Corporate Lunch Programs", "Dietary Accommodations"],
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <UtensilsCrossed className="w-8 h-8" />,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Grocery Services",
    description: "Convenient grocery shopping and delivery service bringing fresh produce, pantry staples, and specialty items directly to your doorstep.",
    features: ["Same-Day Delivery", "Fresh Produce Selection", "Bulk Order Discounts", "Subscription Plans"],
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <ShoppingCart className="w-8 h-8" />,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 5,
    title: "Cleaning Services",
    description: "Professional residential and commercial cleaning services using eco-friendly products. From regular maintenance to deep cleaning projects.",
    features: ["Eco-Friendly Products", "Flexible Scheduling", "Deep Cleaning Specialists", "Post-Construction Cleanup"],
    image: "https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Sparkles className="w-8 h-8" />,
    gradient: "from-pink-500 to-purple-500"
  },
  {
    id: 6,
    title: "Transportation Services",
    description: "Reliable transportation solutions including ride services, delivery, and logistics support for individuals and businesses throughout the region.",
    features: ["Real-Time Tracking", "Fleet Management", "Express Delivery", "Corporate Accounts"],
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Car className="w-8 h-8" />,
    gradient: "from-indigo-500 to-blue-600"
  },
  {
    id: 7,
    title: "Healthcare Services",
    description: "Comprehensive healthcare support including home nursing, medical consultations, and wellness programs tailored to individual needs.",
    features: ["Home Care Services", "Telemedicine Consultations", "Wellness Programs", "Emergency Response"],
    image: "https://images.pexels.com/photos/4173123/pexels-photo-4173123.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Heart className="w-8 h-8" />,
    gradient: "from-red-500 to-pink-500"
  }
]

export default function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-play functionality
  React.useEffect(() => {
    if (!api) {
      return
    }

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

  return (
    <div className="relative w-full min-h-[60vh] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Carousel
        setApi={setApi}
        className="w-full h-[60vh] "
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {services.map((service) => (
            <CarouselItem key={service.id} className="h-[60vh] ">
              <Card className="border-0 rounded-none h-full bg-transparent">
                <CardContent className="p-0 h-full">
                  <div className="grid lg:grid-cols-2 h-full">
                    {/* Left Side - Content */}
                    <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-8 lg:py-0  backdrop-blur-sm">
                      <div className="max-w-xl mx-auto lg:mx-0">
                        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white mb-6 shadow-lg`}>
                          {service.icon}
                          <span className="text-sm font-medium">Premium Service</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                          {service.title}
                        </h1>
                        
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {service.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 ">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            size="lg" 
                            className={`bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-all duration-300 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105`}
                          >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="lg"
                            className="border-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300"
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Image */}
                    <div className="relative lg:h-full h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-20`} />
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={service.id <= 2}
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <CarouselPrevious className="left-8 bg-white/90 border-0 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110" />
        <CarouselNext className="right-8 bg-white/90 border-0 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110" />
        
        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}