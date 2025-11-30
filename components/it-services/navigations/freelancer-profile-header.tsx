'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share, Eye, Edit, Plus, X, Upload } from "lucide-react"
import { useState, ChangeEvent } from "react"
import Link from "next/link"

export function FreelancerProfileHeader() {
  const [profileData, setProfileData] = useState({
    name: "Irfan Khan",
    email: "irfan.khan@example.com",
    username: "@irfankhan0101",
    country: "Afghanistan",
    languages: ["Pashto", "Persian", "English", "Urdu"],
    avatar: "/placeholder.svg?height=80&width=80"
  })

  const [newLanguage, setNewLanguage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData({
        ...profileData,
        languages: [...profileData.languages, newLanguage.trim()]
      })
      setNewLanguage("")
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    setProfileData({
      ...profileData,
      languages: profileData.languages.filter(lang => lang !== languageToRemove)
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveProfile = () => {
    // Here you would typically save to backend
    console.log("Profile updated:", profileData)
    // Close the dialog after saving
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    // Reset form data to original values if needed
    setIsDialogOpen(false)
  }

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-start space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profileData.avatar} alt={profileData.name} />
          <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{profileData.name}</h1>
            <Badge variant="secondary">{profileData.username}</Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span>🇦🇫 {profileData.country}</span>
            <span>Speaks {profileData.languages.join(", ")}</span>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Edit className="w-4 h-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" />
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Profile Information</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Profile Image Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium text-gray-900 dark:text-gray-100">Profile Image</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profileData.avatar} alt={profileData.name} />
                        <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-gray-900 dark:text-gray-100">Choose Image</span>
                          </div>
                        </Label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Enter your full name"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="Enter your email"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        placeholder="Enter username"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-900 dark:text-gray-100">Country</Label>
                      <Input
                        id="country"
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        placeholder="Enter your country"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium text-gray-900 dark:text-gray-100">Languages</Label>
                    
                    {/* Add New Language */}
                    <div className="flex space-x-2">
                      <Input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add a new language"
                        onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      />
                      <Button onClick={addLanguage} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Current Languages */}
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((language, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm text-gray-900 dark:text-gray-100">{language}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(language)}
                            className="h-5 w-5 p-0 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={"/it-services/public-profile"}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Link>
        </Button>
      </div>
    </div>
  )
}
