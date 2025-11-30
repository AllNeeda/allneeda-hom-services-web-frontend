import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, User } from "lucide-react"
import Link from "next/link"

export function RecommendationCards() {
  const recommendations = [
    {
      title: "RECOMMENDED FOR YOU",
      icon: <Smartphone className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      heading: "Download the Servicyee app",
      description: "Stay productive, anywhere you go.",
      href: "#"
    },
    {
      title: "PROFILE PROGRESS",
      icon: <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />,
      heading: "You've added 35% of your profile",
      description: "Complete it to get tailored suggestions.",
      href: "/it-services/profile"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recommendations.map((item, index) => (
        <Link key={index} href={item.href}>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">{item.title}</p>
              <div className="flex items-start space-x-3">
                <div className="mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.heading}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
