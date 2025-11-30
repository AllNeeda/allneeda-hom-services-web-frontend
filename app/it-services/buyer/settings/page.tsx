"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Bell, Camera, Save, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate entrepreneur looking for quality freelance services to grow my business.",
    website: "https://johndoe.com",
    company: "Tech Innovations Inc.",
  })

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMessages: true,
    emailPromotions: false,
    pushOrders: true,
    pushMessages: true,
    pushPromotions: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-1 mb-4 sm:mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger 
                value="profile" 
                className="text-xs sm:text-sm py-2 px-1 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="text-xs sm:text-sm py-2 px-1 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="text-xs sm:text-sm py-2 px-1 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md"
              >
                Privacy
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="text-xs sm:text-sm py-2 px-1 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md"
              >
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Profile Picture */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center p-4 sm:p-6 pt-0">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                    <AvatarImage src="/professional-man-avatar.png" />
                    <AvatarFallback className="text-xl sm:text-2xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent dark:text-gray-200">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mt-1">
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 flex-1"
                      />
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 self-start sm:self-auto">
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-2 sm:space-x-2 sm:space-y-0 pt-2">
                    <Button variant="outline" className="bg-transparent dark:text-gray-200">
                      Cancel
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4 sm:mt-6">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Notification Preferences
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to be notified</p>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Order Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified about order status changes
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">New Messages</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications for new messages
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Promotions & Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get updates about new features and promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailPromotions}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailPromotions: checked })}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Push Notifications */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Order Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get push notifications for order changes
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">New Messages</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive push notifications for messages
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">Promotions & Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get push notifications for promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushPromotions}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushPromotions: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-4 sm:mt-6">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Privacy Settings
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control your privacy and visibility</p>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">Public Profile</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make your profile visible to freelancers
                      </p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">Show Email Address</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display your email on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">Show Phone Number</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Display your phone number on your profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">Allow Direct Messages</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let freelancers send you direct messages
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Change Password */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Change Password
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your password to keep your account secure
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 mt-1"
                    />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2">Update Password</Button>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Two-Factor Authentication
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Enable 2FA</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Secure your account with two-factor authentication
                      </p>
                    </div>
                    <Button variant="outline" className="bg-transparent dark:text-gray-200 mt-2 sm:mt-0">
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-red-200 dark:border-red-800 bg-white dark:bg-gray-900">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                    Danger Zone
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Delete Account</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                    </div>
                    <Button variant="destructive" className="mt-2 sm:mt-0">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}