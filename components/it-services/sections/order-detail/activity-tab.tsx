import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, MessageCircle, Clock, CheckCircle, Truck, FileText, Calendar, AlertCircle } from "lucide-react"

export function ActivityTab() {
  const activities = [
    {
      id: 1,
      type: "order_placed",
      date: "Jan 5",
      time: "2:00 PM",
      title: "You placed the order",
      description: null,
      user: null,
      status: "completed",
    },
    {
      id: 2,
      type: "message",
      date: "Jan 5",
      time: "2:05 PM",
      title: "Load more",
      description: "Thank you attention to finish web app",
      user: {
        name: "Naz",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "N",
        role: "seller",
      },
      status: "message",
    },
    {
      id: 3,
      type: "message",
      date: "Jan 5",
      time: "2:10 PM",
      title: "userTH4578 sent a message",
      description: "Some information is shown in English language - Translate",
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      status: "message",
    },
    {
      id: 4,
      type: "message",
      date: "Jan 5",
      time: "2:15 PM",
      title: "userTH4578 sent a message",
      description: "Can we talk in our account?",
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      status: "message",
    },
    {
      id: 5,
      type: "message",
      date: "Jan 5",
      time: "3:00 PM",
      title: "Naz sent a message",
      description: "Hi, ok",
      user: {
        name: "Naz",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "N",
        role: "seller",
      },
      status: "message",
    },
    {
      id: 6,
      type: "delivery_extension",
      date: "Jan 5",
      time: "3:30 PM",
      title: "userTH4578 delivery date extension request was auto-accepted",
      description: null,
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      status: "extension_approved",
    },
    {
      id: 7,
      type: "delivery_extension_request",
      date: "Jan 5",
      time: "3:35 PM",
      title: "Hi, Please approve delivery extension request",
      description: null,
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      details: {
        originalDate: "May 5, 2024",
        newDate: "May 6, 2024",
      },
      status: "extension_request",
    },
    {
      id: 8,
      type: "delivery_date_updated",
      date: "Jan 5",
      time: "4:00 PM",
      title: "Your delivery date was updated to May 6",
      description: null,
      user: null,
      status: "date_updated",
    },
    {
      id: 9,
      type: "delivery_request",
      date: "Jan 5",
      time: "4:30 PM",
      title: "You accepted userTH4578 request to extend the delivery date",
      description: null,
      user: null,
      status: "request_accepted",
    },
    {
      id: 10,
      type: "delivery_submitted",
      date: "Jan 5",
      time: "5:00 PM",
      title: "userTH4578 delivered your order",
      description: null,
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      status: "delivered",
    },
    {
      id: 11,
      type: "delivery",
      date: "Jan 5",
      time: "5:05 PM",
      title: "DELIVERY #1",
      subtitle: "userTH4578 message",
      description:
        "Thank again for your order! Your delivery is completed. I hope you are any questions or additional changes you would like to make, please let me know via our Fiverr chat.\n\nThank again and have a great day! :)",
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      attachments: [{ name: "email-signature.png", size: "2.1 MB", type: "image" }],
      status: "delivery",
    },
    {
      id: 12,
      type: "order_completed",
      date: "Jan 5",
      time: "6:00 PM",
      title: "Your order was completed",
      description: null,
      user: null,
      status: "completed",
    },
    {
      id: 13,
      type: "review_request",
      date: "Jan 5",
      time: "6:15 PM",
      title: "You left a 5 star review",
      description: null,
      user: null,
      status: "review_left",
    },
    {
      id: 14,
      type: "buyer_review",
      date: "Jan 5",
      time: "6:20 PM",
      title: "YOUR REVIEW",
      description: "Excellent job! Highly recommended!",
      user: null,
      rating: {
        sellerCommunication: 5,
        qualityOfDelivery: 5,
        valueOfDelivery: 5,
      },
      status: "buyer_review",
    },
    {
      id: 15,
      type: "seller_review",
      date: "Jan 5",
      time: "7:00 PM",
      title: "userTH4578 left you a 5 star review",
      subtitle: "userTH4578 REVIEW",
      description: "Great client with interesting ideas!",
      user: {
        name: "userTH4578",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "U",
        role: "buyer",
      },
      rating: 5,
      status: "seller_review",
    },
    {
      id: 16,
      type: "fiverr_available",
      date: "Jan 5",
      time: "7:30 PM",
      title: "userTH4578 is no longer available on Fiverr",
      description: null,
      user: null,
      status: "unavailable",
    },
  ]
// eslint-disable-next-line 
  const getActivityIcon = (type: string, status: string) => {
    switch (type) {
      case "order_placed":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-600" />
      case "delivery_extension":
      case "delivery_extension_request":
        return <Clock className="h-5 w-5 text-amber-600" />
      case "delivery_date_updated":
      case "delivery_request":
        return <Calendar className="h-5 w-5 text-emerald-600" />
      case "delivery_submitted":
      case "delivery":
        return <Truck className="h-5 w-5 text-emerald-600" />
      case "order_completed":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "review_request":
      case "buyer_review":
      case "seller_review":
        return <Star className="h-5 w-5 text-amber-500" />
      case "fiverr_available":
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return <div className="h-5 w-5 rounded-full bg-muted" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
      case "extension_approved":
      case "date_updated":
      case "request_accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "message":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "extension_request":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "delivery":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "buyer_review":
      case "seller_review":
      case "review_left":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "unavailable":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">Jan 5</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-transparent hover:border-l-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    {activity.user ? (
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                        <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                          {activity.user.initials}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                        {getActivityIcon(activity.type, activity.status)}
                      </div>
                    )}

                    {activity.user && (
                      <Badge variant="outline" className="mt-2 text-xs px-2 py-0.5">
                        {activity.user.role}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!activity.user && (
                            <div className="p-1 rounded-full bg-muted">
                              {getActivityIcon(activity.type, activity.status)}
                            </div>
                          )}
                          <h4 className="text-sm font-semibold text-foreground leading-tight">{activity.title}</h4>
                          <Badge className={`text-xs px-2 py-1 ${getStatusColor(activity.status)}`}>
                            {activity.status.replace("_", " ")}
                          </Badge>
                        </div>

                        {activity.subtitle && (
                          <p className="text-xs text-muted-foreground mb-2 font-medium">{activity.subtitle}</p>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-4 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>

                    {activity.description && (
                      <div className="bg-muted/30 p-4 rounded-lg mb-4 border border-muted">
                        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    )}

                    {activity.details && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg mb-4 border border-amber-200 dark:border-amber-800">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Original date:</span>
                            <div className="font-semibold text-foreground">{activity.details.originalDate}</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">New date:</span>
                            <div className="font-semibold text-emerald-600">{activity.details.newDate}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.attachments && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">ATTACHMENTS</span>
                        </div>
                        <div className="space-y-2">
                          {activity.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-muted hover:bg-muted/70 transition-colors"
                            >
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">{attachment.name}</div>
                                <div className="text-xs text-muted-foreground">{attachment.size}</div>
                              </div>
                              <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activity.rating && typeof activity.rating === "number" && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < activity.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-foreground">{activity.rating}/5</span>
                      </div>
                    )}

                    {activity.rating && typeof activity.rating === "object" && (
                      <div className="space-y-3 mt-4">
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Seller communication level</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < activity.rating.sellerCommunication
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Quality of delivery</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < activity.rating.qualityOfDelivery
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Value of delivery</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < activity.rating.valueOfDelivery
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
