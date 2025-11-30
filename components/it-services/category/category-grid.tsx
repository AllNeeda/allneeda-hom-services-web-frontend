import { 
  Globe, 
  Code, 
  Cpu, 
  Smartphone, 
  Layout, 
  Wrench, 
  Shield, 
  Bitcoin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    title: "Websites",
    items: ["Website Development", "Website Maintenance", "WordPress", "Shopify", "Custom Websites", "Website Templates"],
    headerColor: "bg-gradient-to-br from-orange-400 to-orange-600",
    icon: Globe,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Application Development",
    items: [
      "Web Applications",
      "Desktop Applications",
      "Game Development",
      "Chatbot Development",
      "Browser Extensions",
      "API Development"
    ],
    headerColor: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    icon: Code,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Software Development",
    items: ["Software Development", "AI Development", "API & Integrations", "Scripting", "Plugins Development", "Database Design"],
    headerColor: "bg-gradient-to-br from-teal-400 to-teal-600",
    icon: Cpu,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Mobile Apps",
    items: [
      "Mobile App Development",
      "Cross-platform Apps",
      "Android App Development",
      "iOS App Development",
      "Mobile App Maintenance",
      "App Store Optimization"
    ],
    headerColor: "bg-gradient-to-br from-purple-400 to-purple-600",
    icon: Smartphone,
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Website Platforms",
    items: ["Wix", "Webflow", "GoDaddy", "Squarespace", "WooCommerce", "Shopify Development"],
    headerColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    icon: Layout,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Vice Coding",
    items: ["Development & MVP", "Troubleshooting & Improvements", "Development & DevOps", "Consultation & Training", "Code Review"],
    headerColor: "bg-gradient-to-br from-teal-500 to-teal-700",
    icon: Wrench,
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Support & Cybersecurity",
    items: ["Support & IT", "Cloud Computing", "DevOps Engineering", "Cybersecurity", "Development for Beginners", "Security Auditing"],
    headerColor: "bg-gradient-to-br from-amber-500 to-amber-700",
    icon: Shield,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&crop=center"
  },
  {
    title: "Blockchain & Cryptocurrency",
    items: [
      "Blockchain Development & Solutions",
      "Decentralized Apps (DApps)",
      "Coin Design & Tokenomics",
      "Blockchain Security & Auditing",
      "Exchange Platforms",
      "Smart Contracts"
    ],
    headerColor: "bg-gradient-to-br from-slate-500 to-slate-700",
    icon: Bitcoin,
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&crop=center"
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
          Explore Programming & Tech
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div
                key={index}
                className="group cursor-pointer"
              >
                {/* Visual Header with Image */}
                <div className="h-40 relative overflow-hidden rounded-lg mb-4">
                  {/* Background Image */}
                  <Image
                    src={category.imageUrl}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={index < 4}
                  />
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-white/90 transition-colors">
                      {category.title}
                    </h3>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center group/item">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 group-hover/item:bg-blue-500 transition-colors"></div>
                        <Link href={`/it-services/search/?${item}`}  >
                          {item}
                        </Link>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
            <span>View all categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
