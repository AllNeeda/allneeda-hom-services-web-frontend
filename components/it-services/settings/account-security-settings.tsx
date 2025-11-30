"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Monitor } from "lucide-react"

interface ConnectedDevice {
  id: string
  browser: string
  os: string
  location: string
  lastActivity: string
  isCurrentDevice: boolean
}

export function AccountSecuritySettings() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [connectedDevices] = useState<ConnectedDevice[]>([
    {
      id: "1",
      browser: "Chrome 139.0.0.0",
      os: "Windows",
      location: "Sweden",
      lastActivity: "48 minutes ago",
      isCurrentDevice: true,
    },
    {
      id: "2",
      browser: "Chrome 139.0.0.0",
      os: "Windows",
      location: "Alexandria, VA, United States",
      lastActivity: "9 hours ago",
      isCurrentDevice: false,
    },
  ])

  return (
    <div className="space-y-8">
      {/* Set Password */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">SET PASSWORD</h3>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="space-y-2 col-span-1">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
             <p className="text-xs text-gray-500 dark:text-gray-400">
              8 characters or longer. Combine upper and lowercase letters and numbers.
            </p>
          </div>

          <div className="space-y-2 col-span-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              8 characters or longer. Combine upper and lowercase letters and numbers.
            </p>
          </div>

          <div className="md:col-span-2">
            <Button className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 w-full md:w-auto">
              Save Changes
            </Button>
          </div>
        </div>
      </div>


      {/* Connected Devices */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">CONNECTED DEVICES</h3>

        <div className="space-y-4">
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
              <div className="flex items-center space-x-4 flex-1">
                <Monitor className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {device.browser}, {device.os}
                    </span>
                    {device.isCurrentDevice && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded mt-1 sm:mt-0">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last Activity {device.lastActivity} • {device.location}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-200 bg-transparent w-full sm:w-auto border-gray-200 dark:border-gray-700"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-right">
          <Button
            variant="outline"
            className="text-gray-600 dark:text-gray-200 bg-transparent w-full sm:w-auto border-gray-200 dark:border-gray-700"
          >
            Sign Out From All Devices
          </Button>
        </div>
      </div>
    </div>
  )
}
