import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Shield, Bell } from "lucide-react"
import Link from "next/link"

const settingsCards = [
  {
    icon: User,
    title: "Personal information",
    description: "Update your name, email address, online visibility, and account status.",
    href: "/it-services/settings/personal-information",
  },
  {
    icon: Shield,
    title: "Account security",
    description: "Update your password and manage additional security settings.",
    href: "/it-services/settings/account-security",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Select the notifications you want—and how you'd like to receive them.",
    href: "/it-services/settings/notifications",
  },
]

export function SettingsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {settingsCards.map((card) => {
        const IconComponent = card.icon
        return (
          <Link key={card.title} href={card.href} className="block group">
            <Card className="h-full transition-shadow cursor-pointer border hover:shadow-lg group-hover:border-green-500">
              <CardHeader className="flex flex-row items-start gap-4">
                <span className="rounded-md bg-muted p-2">
                  <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
                </span>
                <div>
                  <CardTitle className="text-lg font-medium text-gray-900 group-hover:text-green-700 mb-1">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
