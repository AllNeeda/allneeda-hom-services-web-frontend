import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, RefreshCw } from "lucide-react"

export function ModernPricingPackages() {
  const packages = [
    {
      name: "Basic",
      price: 15,
      description: "Perfect for simple websites",
      deliveryTime: "3 days",
      revisions: "2",
      features: ["Responsive Design", "3 Pages", "Basic SEO", "Contact Form"],
      popular: false,
    },
    {
      name: "Standard",
      price: 45,
      description: "Great for business websites",
      deliveryTime: "5 days",
      revisions: "3",
      features: ["Everything in Basic", "5 Pages", "Advanced SEO", "Social Media Integration", "Admin Panel"],
      popular: true,
    },
    {
      name: "Premium",
      price: 75,
      description: "Complete solution",
      deliveryTime: "7 days",
      revisions: "Unlimited",
      features: [
        "Everything in Standard",
        "10 Pages",
        "E-commerce Integration",
        "Payment Gateway",
        "Analytics Setup",
        "1 Month Support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Your Package</h3>
      </div>

      <div className="p-6 space-y-4">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
              pkg.popular
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-600"
                : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{pkg.name}</h4>
                {pkg.popular && (
                  <Badge className="bg-blue-500 text-white dark:bg-blue-600 dark:text-white">
                    Most Popular
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${pkg.price}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{pkg.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{pkg.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>{pkg.revisions} revisions</span>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {pkg.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                pkg.popular
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  : "bg-gray-900 hover:bg-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }`}
            >
              Continue (${pkg.price})
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
