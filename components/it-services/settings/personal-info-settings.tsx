"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export function PersonalInfoSettings() {
  const [fullName, setFullName] = useState("Irfanullah Dhark")
  const [email, setEmail] = useState("j***********k@gmail.com")
  const [onlineStatus, setOnlineStatus] = useState("GO OFFLINE FOR...")
  const [deactivationReason, setDeactivationReason] = useState("")

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8 w-full">
      {/* Profile Update Notice */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Need to update your public profile?{" "}
          <Link
            href="/it-services/profile"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
          >
            Go to My Profile
          </Link>
        </p>
      </div>

      {/* Personal Information Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            FULL NAME
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full sm:max-w-md"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            EMAIL
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:max-w-md"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onlineStatus" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            ONLINE STATUS <span className="text-green-600 dark:text-green-400">●</span>
          </Label>
          <Select value={onlineStatus} onValueChange={setOnlineStatus}>
            <SelectTrigger className="w-full sm:max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GO OFFLINE FOR">GO OFFLINE FOR...</SelectItem>
              <SelectItem value="one-hour">ONE HOUR</SelectItem>
              <SelectItem value="one-day">ONE DAY</SelectItem>
              <SelectItem value="one-week">ONE WEEK</SelectItem>
              <SelectItem value="forever">FOREVER</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            When online, your Services are visible under the Online search filter.
          </p>
        </div>

        <Button className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:text-white">
          Save Changes
        </Button>
      </div>

      {/* Account Deactivation */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">ACCOUNT DEACTIVATION</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">What happens when you deactivate your account?</p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
              <li>• Your profile and services wont be shown on Servicyee anymore. 🔒</li>
              <li>• Active orders will be cancelled. 🔒</li>
              <li>• You wont be able to re-activate your Services.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Im leaving because...
              </Label>
              <Select value={deactivationReason} onValueChange={setDeactivationReason}>
                <SelectTrigger className="w-full sm:max-w-md mt-2">
                  <SelectValue placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporary-break">Taking a temporary break</SelectItem>
                  <SelectItem value="too-busy">Too busy with other work</SelectItem>
                  <SelectItem value="not-satisfied">Not satisfied with the platform</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full sm:w-auto text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
            >
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
