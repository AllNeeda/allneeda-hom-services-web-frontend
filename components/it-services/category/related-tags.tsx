import { Badge } from "@/components/ui/badge"

const tags = [
  "Game Script",
  "Convert Website to App",
  "Custom CMS",
  "Website Design",
  "Python Developer",
  "PHP Programmer",
  "Unity Developer",
  "Shopify Expert",
  "Web services builder",
  "Squarespace Programmer",
  "Website builder",
  "Woocommerce builder",
  "Wordpress builder",
  "Book formatting",
  "Content Landing Page",
  "Web Scraping",
  "PHP Programmer",
]

export function RelatedTags() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-950 dark:text-white">
          You might be interested in Programming & Tech
        </h2>
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
