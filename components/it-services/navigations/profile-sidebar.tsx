"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Clock, Eye, ExternalLink, Edit2, Save, X, Upload, Globe, Star } from "lucide-react"
import Link from "next/link"
import { useState, ChangeEvent } from "react"

export function ProfileSidebar() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Irfan Khan",
    username: "@irfankhan0101",
    location: "Located in Afghanistan",
    joinDate: "Joined in December 2023",
    languages: [
      "Pashto (Native/Bilingual)",
      "Persian (Native/Bilingual)", 
      "English (Fluent)",
      "Urdu (Fluent)"
    ],
    workingHours: "Preferred working hours",
    avatar: "/placeholder.svg?height=96&width=96"
  })

  const [editData, setEditData] = useState({ ...profileData })

  const handleEdit = () => {
    setEditData({ ...profileData })
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData({ ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({ ...profileData })
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...editData.languages]
    newLanguages[index] = value
    setEditData(prev => ({ ...prev, languages: newLanguages }))
  }

  const addLanguage = () => {
    setEditData(prev => ({ 
      ...prev, 
      languages: [...prev.languages, "New Language"] 
    }))
  }

  const removeLanguage = (index: number) => {
    setEditData(prev => ({ 
      ...prev, 
      languages: prev.languages.filter((_, i) => i !== index) 
    }))
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData(prev => ({ 
          ...prev, 
          avatar: e.target?.result as string 
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/20 rounded-xl w-full max-w-md mx-auto sm:max-w-full transition-all duration-200 hover:shadow-xl dark:hover:shadow-gray-900/30">
      <CardContent className="p-6 sm:p-8">
        {/* Profile Header Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white dark:border-gray-800 shadow-lg dark:shadow-gray-900/50 transition-all duration-200 group-hover:scale-105">
              <AvatarImage src={isEditing ? editData.avatar : profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="bg-blue-600 dark:bg-blue-500 text-white text-2xl font-bold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer">
                <label htmlFor="avatar-upload" className="cursor-pointer p-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/30 dark:hover:bg-white/20 transition-colors">
                  <Upload className="w-6 h-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>
          
          {/* Name and Edit Controls */}
          <div className="flex items-center gap-3 mb-3">
            {isEditing ? (
              <Input
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-center text-xl sm:text-2xl font-bold bg-transparent border-2 border-blue-200 dark:border-blue-700 rounded-xl px-4 py-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                placeholder="Enter your name"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.name}
              </h2>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-all duration-200 hover:scale-110 group"
                title={isEditing ? "Save changes" : "Edit profile"}
              >
                {isEditing ? (
                  <Save className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300" />
                ) : (
                  <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-700" />
                )}
              </button>
              {isEditing && (
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-200 hover:scale-110 group"
                  title="Cancel editing"
                >
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
                </button>
              )}
            </div>
          </div>
          
          {/* Username */}
          {isEditing ? (
            <Input
              value={editData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="text-center text-gray-500 dark:text-gray-400 bg-transparent border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm sm:text-base"
              placeholder="Enter username"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium">
              {profileData.username}
            </p>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            {isEditing ? (
              <Input
                value={editData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-transparent border-none p-0 h-auto flex-1 text-sm font-medium"
                placeholder="Enter location"
              />
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profileData.location}</span>
            )}
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            {isEditing ? (
              <Input
                value={editData.joinDate}
                onChange={(e) => handleInputChange('joinDate', e.target.value)}
                className="bg-transparent border-none p-0 h-auto flex-1 text-sm font-medium"
                placeholder="Enter join date"
              />
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profileData.joinDate}</span>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Languages</h3>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addLanguage}
                className="text-xs px-3 py-1.5 h-auto bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 transition-colors"
              >
                + Add
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {(isEditing ? editData.languages : profileData.languages).map((language, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <Input
                      value={language}
                      onChange={(e) => handleLanguageChange(index, e.target.value)}
                      className="bg-transparent border-none p-0 h-auto flex-1 text-sm"
                      placeholder="Enter language"
                    />
                    <button
                      onClick={() => removeLanguage(index)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                      title="Remove language"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Star className="w-3 h-3 text-yellow-500 dark:text-yellow-400 fill-current" />
                    <span>{language}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours Section */}
        <div className="mb-8">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mr-3">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            {isEditing ? (
              <Input
                value={editData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="bg-transparent border-none p-0 h-auto flex-1 text-sm font-medium"
                placeholder="Enter working hours"
              />
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profileData.workingHours}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:scale-[1.02] group"
            asChild
          >
            <Link href={"/it-services/public-profile"}>
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="truncate font-medium">Preview public profile</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 hover:scale-[1.02] group"
            asChild
          >
            <Link href={"/it-services/"}>
              <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="truncate font-medium">Explore Servicyee</span>
            </Link>
          </Button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm text-gray-600 dark:text-gray-300">
          <p className="leading-relaxed">
            You&apos;re currently on your <span className="font-semibold text-blue-600 dark:text-blue-400">buyer profile</span>. To access your freelancer profile, switch to{" "}
            <a href="/freelancer-profile" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              seller mode
            </a>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
