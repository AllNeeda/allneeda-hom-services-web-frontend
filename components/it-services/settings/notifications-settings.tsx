"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

interface NotificationSetting {
  id: string
  label: string
  email: boolean
  push: boolean
}

export function NotificationsSettings() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: "inbox", label: "Inbox messages", email: false, push: false },
    { id: "order", label: "Order messages", email: true, push: false },
    { id: "updates", label: "Order updates", email: true, push: false },
    { id: "rating", label: "Rating Messages", email: false, push: false },
    { id: "service", label: "Service Messages", email: true, push: false },
  ])

  const [realTimeNotifications, setRealTimeNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)

  const updateNotification = (id: string, type: "email" | "push", value: boolean) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, [type]: value } : notif)))
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Notification Preferences Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4"></div>
          <div className="p-4 text-center font-medium text-gray-900 dark:text-gray-100">Email</div>
          <div className="p-4 text-center font-medium text-gray-900 dark:text-gray-100">Push</div>
        </div>

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
          >
            <div className="p-4 font-medium text-gray-900 dark:text-gray-100">{notification.label}</div>
            <div className="p-4 flex justify-center">
              <Checkbox
                checked={notification.email}
                onCheckedChange={(checked) => updateNotification(notification.id, "email", checked as boolean)}
              />
            </div>
            <div className="p-4 flex justify-center">
              <Checkbox
                checked={notification.push}
                onCheckedChange={(checked) => updateNotification(notification.id, "push", checked as boolean)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Notifications */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Real-time notifications</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Receive on-screen updates, announcements, and more while online.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 dark:text-gray-100">Real-time notifications</span>
            </div>
            <Switch checked={realTimeNotifications} onCheckedChange={setRealTimeNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">Sound effects</span>
            <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="pt-4">
        <Button className="bg-black text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
          Update preferences
        </Button>
      </div>
    </div>
  )
}
