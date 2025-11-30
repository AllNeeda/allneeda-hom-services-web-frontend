import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export function DeliveryTab() {
  const deliveries = [
    {
      id: 1,
      title: "DELIVERY #1",
      user: {
        name: "Naz",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "N",
      },
      message:
        "Hello Shahzad/Naz/Naz/Naz! I hope that you know that your delivery is completed. I hope you are any questions or additional changes you would like to make, please let me know via our Fiverr chat.",
      additionalMessage: "Best regards, Naz",
      attachments: [
        { name: "shahzad_naz.html", size: "6 KB" },
        { name: "shahzad_naz.html", size: "6 KB" },
      ],
    },
    {
      id: 2,
      title: "DELIVERY #2",
      user: {
        name: "Naz",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "N",
      },
      message: "signature installation tutorial and new signature files included.",
      attachments: [
        { name: "shahzad_naz.html", size: "6 KB" },
        { name: "shahzad_naz.html", size: "6 KB" },
        { name: "How to - new.html", size: "6 KB" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {deliveries.map((delivery) => (
        <Card key={delivery.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Delivery Header */}
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm font-medium">
                  {delivery.title}
                </Badge>
              </div>

              {/* User Info and Message */}
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={delivery.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{delivery.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground mb-1">{delivery.user.name}s message</div>
                  <div className="text-sm text-foreground mb-2">{delivery.message}</div>
                  {delivery.additionalMessage && (
                    <div className="text-sm text-foreground">{delivery.additionalMessage}</div>
                  )}
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">ATTACHMENTS</div>
                <div className="grid gap-3">
                  {delivery.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">H</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">{attachment.size}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
