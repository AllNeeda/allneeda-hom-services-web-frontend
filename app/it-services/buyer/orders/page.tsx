"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Download,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: "#12345",
    title: "Logo Design for Tech Startup",
    description: "Modern, minimalist logo design with brand guidelines",
    freelancer: {
      name: "Sarah Wilson",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=64&h=64&fit=crop",
      rating: 4.9,
    },
    status: "in_progress",
    amount: "$299",
    date: "Dec 15, 2024",
    dueDate: "Dec 22, 2024",
    category: "Design & Creative",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=400&h=200&fit=crop",
  },
  {
    id: "#12344",
    title: "Website Development",
    description: "Full-stack web application with React and Node.js",
    freelancer: {
      name: "Mike Johnson",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=64&h=64&fit=crop",
      rating: 4.8,
    },
    status: "completed",
    amount: "$1,299",
    date: "Dec 12, 2024",
    dueDate: "Dec 20, 2024",
    category: "Web & App Design",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=400&h=200&fit=crop",
  },
  {
    id: "#12343",
    title: "Content Writing Package",
    description: "SEO-optimized blog posts and website copy",
    freelancer: {
      name: "Emma Davis",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&w=64&h=64&fit=crop",
      rating: 4.7,
    },
    status: "under_review",
    amount: "$199",
    date: "Dec 10, 2024",
    dueDate: "Dec 18, 2024",
    category: "Writing & Translation",
    image: "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&w=400&h=200&fit=crop",
  },
  {
    id: "#12342",
    title: "Mobile App UI Design",
    description: "iOS and Android app interface design",
    freelancer: {
      name: "Alex Chen",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&w=64&h=64&fit=crop",
      rating: 4.9,
    },
    status: "cancelled",
    amount: "$599",
    date: "Dec 8, 2024",
    dueDate: "Dec 15, 2024",
    category: "Design & Creative",
    image: "https://images.pexels.com/photos/1809341/pexels-photo-1809341.jpeg?auto=compress&w=400&h=200&fit=crop",
  },
]

const statusConfig = {
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status === activeTab
  })

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage all your service orders</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white dark:bg-gray-900 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search orders or freelancers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <Button variant="outline" className="bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="all" className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">All Orders</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">In Progress</TabsTrigger>
            <TabsTrigger value="completed" className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Completed</TabsTrigger>
            <TabsTrigger value="under_review" className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Under Review</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon

                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Order Image */}
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={order.image || "/placeholder.svg"}
                            alt={order.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{order.title}</h3>
                                <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig[order.status as keyof typeof statusConfig].label}
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-3">{order.description}</p>

                              {/* Freelancer Info */}
                              <div className="flex items-center space-x-3 mb-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={order.freelancer.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {order.freelancer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{order.freelancer.name}</p>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{order.freelancer.rating}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Meta */}
                              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <span>Order {order.id}</span>
                                <span>Category: {order.category}</span>
                                <span>Ordered: {order.date}</span>
                                <span>Due: {order.dueDate}</span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{order.amount}</p>
                              <div className="space-y-2">
                                <Link  href={"/it-services/order/1/"}>
                                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                  View Details
                                </Button>
                                </Link>
                                <Button size="sm" variant="outline" className="w-full my-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredOrders.length === 0 && (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
