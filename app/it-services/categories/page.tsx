import { CategoryFAQ } from "@/components/it-services/category/category-faq"
import { CategoryGrid } from "@/components/it-services/category/category-grid"
import { CategoryHero } from "@/components/it-services/category/category-hero"
import { RelatedTags } from "@/components/it-services/category/related-tags"

export default function ProgrammingTechPage() {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHero />
      <CategoryGrid />
      <CategoryFAQ />
      <RelatedTags />
    </div>
  )
}
