"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"

type Attachment = { name: string; size: string }
type Delivery = {
  id: number
  title: string
  user: { name: string; initials: string; avatar: string }
  message: string[]
  attachments: Attachment[]
}

export default function OrderDeliverables() {
  const deliveries: Delivery[] = [
    {
      id: 1,
      title: "DELIVERY #1",
      user: { name: "Danish I", initials: "DI", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" },
      message: [
        "Hey,",
        "Here is your delivery. Please have a look at the logos and let me know if any improvements are needed. I offer unlimited revisions. If you like the logos, please accept the delivery and I'll send you the files.",
        "Thanks a lot for the order again.",
        "Best Regards,",
        "Danish Iqbal",
      ],
      attachments: [
        { name: "1-1Z7.jpg", size: "173 KB" },
        { name: "2-102.jpg", size: "192 KB" },
      ],
    },
    {
      id: 2,
      title: "DELIVERY #2",
      user: { name: "Danish I", initials: "DI", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" },
      message: ["Hey,", "Here is another concept. Please have a look at this too."],
      attachments: [{ name: "3-73.jpg", size: "184 KB" }],
    },
    {
      id: 3,
      title: "DELIVERY #3",
      user: { name: "Danish I", initials: "DI", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" },
      message: [
        "Hey,",
        "Here is your 2nd delivery. I have delivered more than 5 concepts with different ideas. Please have a look and let me know how it is. If it's good then please accept it and I will send you the files.",
        "Thanks a lot!",
      ],
      attachments: [
        { name: "b-10.jpg", size: "181 KB" },
        { name: "e-1.jpg", size: "147 KB" },
        { name: "c-5.jpg", size: "148 KB" },
        { name: "d-4.jpg", size: "159 KB" },
        { name: "f.jpg", size: "168 KB" },
        { name: "a-11.jpg", size: "144 KB" },
      ],
    },
    {
      id: 4,
      title: "DELIVERY #4",
      user: { name: "Danish I", initials: "DI", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" },
      message: [
        "Hey,",
        "Here is your delivery. Please have a look at it. I am anxiously waiting for your response about the logos that I am delivering. If you like them then please accept the delivery so that I can create files and send you.",
      ],
      attachments: [
        { name: "1-128.jpg", size: "192 KB" },
        { name: "4-49.jpg", size: "204 KB" },
        { name: "3-80.jpg", size: "185 KB" },
        { name: "2-103.jpg", size: "185 KB" },
        { name: "5-15.jpg", size: "175 KB" },
      ],
    },
  ]

  return (
    <div className="space-y-6 bg-white dark:bg-gray-950 p-2 sm:p-4 border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-3xl mx-auto">
      {deliveries.map((delivery) => (
        <Card
          key={delivery.id}
          className="shadow-sm p-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl"
        >
          <CardHeader className="bg-gray-100 dark:bg-gray-800 rounded-t-xl px-4 py-3">
            <div className="flex items-center justify-between h-8">
              <CardTitle className="text-sm font-semibold tracking-wide flex items-center text-gray-900 dark:text-gray-100">
                {delivery.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-[10px] flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                Delivered
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarImage src={delivery.user.avatar} />
                <AvatarFallback>{delivery.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{delivery.user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">message</span>
                </div>
                <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                  {delivery.message.map((p, idx) => (
                    <p key={idx} className="leading-relaxed break-words">{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {delivery.attachments.length > 0 && (
              <div className="mt-5">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  ATTACHMENTS
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {delivery.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-3 flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-16 mb-2 rounded-lg bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate w-full">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">({file.size})</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 mt-1 gap-1 mx-auto w-full flex items-center justify-center"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mt-6 dark:bg-gray-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}