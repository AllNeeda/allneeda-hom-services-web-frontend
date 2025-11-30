"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter, MessageCircle, Linkedin } from "lucide-react"

export function ReferralForm() {
  const [emails, setEmails] = useState("")
  const referralLink = "https://www.servicyee.com/join/P2Eur"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
  }

  const shareOnSocial = (platform: string) => {
    const message = "Join me on Servicyee and get amazing services!"
    const url = referralLink

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + " " + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
  }

  return (
    <div className="max-w-2xl mx-auto mb-16 -mt-40 relative z-10">
      <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Invite friends through email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Add Email addresses"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Separate emails with commas</p>
          </div>
          <div className="flex justify-between items-center">
            <Button className="bg-black hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-gray-900 px-8 transition-colors">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Or share your personal referral link</h3>
            <div className="flex items-center gap-2 mb-4">
              <Input
                value={referralLink}
                readOnly
                className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("facebook")}
                className="p-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("twitter")}
                className="p-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("whatsapp")}
                className="p-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareOnSocial("linkedin")}
                className="p-2 bg-transparent dark:bg-transparent border-gray-200 dark:border-gray-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
