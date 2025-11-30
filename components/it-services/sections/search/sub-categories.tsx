"use client"

import { useMemo, useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import React from "react"
type SubCategory = {
  title: string
  image: string
}

const SUBCATEGORY_MAP: Record<string, SubCategory[]> = {
  "Graphics & Design": [
    { title: "Logo Design", image: "https://picsum.photos/seed/logo/320/200" },
    { title: "Brand Style Guides", image: "https://picsum.photos/seed/brand/320/200" },
    { title: "Illustration", image: "https://picsum.photos/seed/illustration/320/200" },
    { title: "Image Editing", image: "https://picsum.photos/seed/image-edit/320/200" },
    { title: "Business Cards", image: "https://picsum.photos/seed/cards/320/200" },
    { title: "Social Posts", image: "https://picsum.photos/seed/social/320/200" },
    { title: "Presentation Design", image: "https://picsum.photos/seed/slides/320/200" },
    { title: "Packaging", image: "https://picsum.photos/seed/packaging/320/200" },
    { title: "Book Covers", image: "https://picsum.photos/seed/book/320/200" },
    { title: "Infographics", image: "https://picsum.photos/seed/infographic/320/200" },
    { title: "T‑Shirt Design", image: "https://picsum.photos/seed/tshirt/320/200" },
    { title: "UI Mockups", image: "https://picsum.photos/seed/ui/320/200" },
  ],
  "Digital Marketing": [
    { title: "Social Media Marketing", image: "https://picsum.photos/seed/smm/320/200" },
    { title: "SEO", image: "https://picsum.photos/seed/seo/320/200" },
    { title: "Email Marketing", image: "https://picsum.photos/seed/email/320/200" },
    { title: "Influencer Marketing", image: "https://picsum.photos/seed/influencer/320/200" },
    { title: "PPC Campaigns", image: "https://picsum.photos/seed/ppc/320/200" },
    { title: "Content Marketing", image: "https://picsum.photos/seed/content/320/200" },
    { title: "Affiliate Marketing", image: "https://picsum.photos/seed/affiliate/320/200" },
    { title: "ASO", image: "https://picsum.photos/seed/aso/320/200" },
    { title: "Analytics Setup", image: "https://picsum.photos/seed/analytics/320/200" },
    { title: "Funnel Design", image: "https://picsum.photos/seed/funnel/320/200" },
    { title: "Reputation Mgmt", image: "https://picsum.photos/seed/reputation/320/200" },
    { title: "Community Growth", image: "https://picsum.photos/seed/community/320/200" },
  ],
  "Writing & Translation": [
    { title: "Copywriting", image: "https://picsum.photos/seed/copy/320/200" },
    { title: "Translation", image: "https://picsum.photos/seed/translation/320/200" },
    { title: "Blog Posts", image: "https://picsum.photos/seed/blog/320/200" },
    { title: "Technical Writing", image: "https://picsum.photos/seed/technical/320/200" },
    { title: "Proofreading", image: "https://picsum.photos/seed/proof/320/200" },
    { title: "Product Descriptions", image: "https://picsum.photos/seed/product/320/200" },
    { title: "UX Writing", image: "https://picsum.photos/seed/ux/320/200" },
    { title: "Resume & CV", image: "https://picsum.photos/seed/resume/320/200" },
    { title: "Scriptwriting", image: "https://picsum.photos/seed/script/320/200" },
    { title: "White Papers", image: "https://picsum.photos/seed/whitepaper/320/200" },
    { title: "Press Releases", image: "https://picsum.photos/seed/press/320/200" },
    { title: "Subtitles", image: "https://picsum.photos/seed/subtitles/320/200" },
  ],
  "Video & Animation": [
    { title: "Video Editing", image: "https://picsum.photos/seed/edit/320/200" },
    { title: "Short Ads", image: "https://picsum.photos/seed/ads/320/200" },
    { title: "Product Shoots", image: "https://picsum.photos/seed/product-shoot/320/200" },
    { title: "Motion Graphics", image: "https://picsum.photos/seed/motion/320/200" },
    { title: "2D Animation", image: "https://picsum.photos/seed/2d/320/200" },
    { title: "3D Animation", image: "https://picsum.photos/seed/3d/320/200" },
    { title: "Logo Animation", image: "https://picsum.photos/seed/logo-anim/320/200" },
    { title: "Color Grading", image: "https://picsum.photos/seed/grade/320/200" },
    { title: "Captions", image: "https://picsum.photos/seed/caption/320/200" },
    { title: "YouTube Editing", image: "https://picsum.photos/seed/yt/320/200" },
    { title: "Reels/TikTok", image: "https://picsum.photos/seed/reels/320/200" },
    { title: "Storyboards", image: "https://picsum.photos/seed/story/320/200" },
  ],
  "Music & Audio": [
    { title: "Music Production", image: "https://picsum.photos/seed/music/320/200" },
    { title: "Voice Over", image: "https://picsum.photos/seed/voice/320/200" },
    { title: "Mix & Master", image: "https://picsum.photos/seed/mix/320/200" },
    { title: "Sound Design", image: "https://picsum.photos/seed/sound/320/200" },
    { title: "Podcast Editing", image: "https://picsum.photos/seed/podcast/320/200" },
    { title: "Jingles", image: "https://picsum.photos/seed/jingle/320/200" },
    { title: "Audiobooks", image: "https://picsum.photos/seed/audiobook/320/200" },
    { title: "SFX Packs", image: "https://picsum.photos/seed/sfx/320/200" },
    { title: "Music Lessons", image: "https://picsum.photos/seed/lessons/320/200" },
    { title: "Tuning & Timing", image: "https://picsum.photos/seed/tuning/320/200" },
    { title: "Dialogue Cleanup", image: "https://picsum.photos/seed/dialogue/320/200" },
    { title: "Arrangement", image: "https://picsum.photos/seed/arrange/320/200" },
  ],
  "Programming & Tech": [
    { title: "Web Development", image: "https://picsum.photos/seed/web/320/200" },
    { title: "Backend APIs", image: "https://picsum.photos/seed/api/320/200" },
    { title: "Databases", image: "https://picsum.photos/seed/db/320/200" },
    { title: "Mobile Apps", image: "https://picsum.photos/seed/mobile/320/200" },
    { title: "DevOps & CI/CD", image: "https://picsum.photos/seed/devops/320/200" },
    { title: "Cloud & Infra", image: "https://picsum.photos/seed/cloud/320/200" },
    { title: "Testing & QA", image: "https://picsum.photos/seed/qa/320/200" },
    { title: "AI/ML", image: "https://picsum.photos/seed/ai/320/200" },
    { title: "Data Engineering", image: "https://picsum.photos/seed/data-eng/320/200" },
    { title: "Cybersecurity", image: "https://picsum.photos/seed/security/320/200" },
    { title: "WordPress", image: "https://picsum.photos/seed/wp/320/200" },
    { title: "Shopify", image: "https://picsum.photos/seed/shopify/320/200" },
  ],
  "Business": [
    { title: "Business Plans", image: "https://picsum.photos/seed/plan/320/200" },
    { title: "Market Research", image: "https://picsum.photos/seed/research/320/200" },
    { title: "Project Management", image: "https://picsum.photos/seed/pm/320/200" },
    { title: "Legal Consulting", image: "https://picsum.photos/seed/legal/320/200" },
    { title: "Financial Modeling", image: "https://picsum.photos/seed/finance/320/200" },
    { title: "Pitch Decks", image: "https://picsum.photos/seed/deck/320/200" },
    { title: "HR Consulting", image: "https://picsum.photos/seed/hr/320/200" },
    { title: "Sales Strategy", image: "https://picsum.photos/seed/sales/320/200" },
    { title: "Customer Support", image: "https://picsum.photos/seed/support/320/200" },
    { title: "Bookkeeping", image: "https://picsum.photos/seed/books/320/200" },
    { title: "Virtual Assistant", image: "https://picsum.photos/seed/va/320/200" },
    { title: "Operations", image: "https://picsum.photos/seed/ops/320/200" },
  ],
  "Lifestyle": [
    { title: "Wellness Coaching", image: "https://picsum.photos/seed/wellness/320/200" },
    { title: "Fitness Training", image: "https://picsum.photos/seed/fitness/320/200" },
    { title: "Nutrition", image: "https://picsum.photos/seed/nutrition/320/200" },
    { title: "Personal Growth", image: "https://picsum.photos/seed/growth/320/200" },
    { title: "Mindfulness", image: "https://picsum.photos/seed/mind/320/200" },
    { title: "Language Lessons", image: "https://picsum.photos/seed/lesson/320/200" },
    { title: "Crafts & Hobbies", image: "https://picsum.photos/seed/craft/320/200" },
    { title: "Photography", image: "https://picsum.photos/seed/photo/320/200" },
    { title: "Home Organization", image: "https://picsum.photos/seed/organize/320/200" },
    { title: "Travel Planning", image: "https://picsum.photos/seed/travel/320/200" },
    { title: "Gardening", image: "https://picsum.photos/seed/garden/320/200" },
    { title: "Parenting", image: "https://picsum.photos/seed/parent/320/200" },
  ],
  "Trending Services": [
    { title: "AI Integrations", image: "https://picsum.photos/seed/ai-trend/320/200" },
    { title: "UGC Content", image: "https://picsum.photos/seed/ugc/320/200" },
    { title: "Short-form Video", image: "https://picsum.photos/seed/short/320/200" },
    { title: "Brand Revamps", image: "https://picsum.photos/seed/revamp/320/200" },
    { title: "Chatbots", image: "https://picsum.photos/seed/chatbot/320/200" },
    { title: "No-code Apps", image: "https://picsum.photos/seed/nocode/320/200" },
    { title: "Webflow", image: "https://picsum.photos/seed/webflow/320/200" },
    { title: "Carousel Design", image: "https://picsum.photos/seed/carousel/320/200" },
    { title: "Landing Pages", image: "https://picsum.photos/seed/landing/320/200" },
    { title: "Newsletter", image: "https://picsum.photos/seed/newsletter/320/200" },
    { title: "Micro SaaS", image: "https://picsum.photos/seed/saas/320/200" },
    { title: "Prompt Engineering", image: "https://picsum.photos/seed/prompt/320/200" },
  ],
}

export default function SubCategories() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastSubCategoryRef = useRef<string | null>(null)
  const [rawCategory, setRawCategory] = useState<string>(
    () => searchParams.get("category") || "Graphics & Design"
  )

  // React to URL param changes
  useEffect(() => {
    const next = searchParams.get("category") || "Graphics & Design"
    setRawCategory(next)
  }, [searchParams])

  // Normalize some potential aliases/slugs from the URL
  const normalizedCategory = useMemo(() => {
    const value = decodeURIComponent(rawCategory)
    if (value.toLowerCase() === "trending") return "Trending Services"
    if (value.toLowerCase() === "all" || value.toLowerCase() === "all categories") return "Trending Services"
    return value
  }, [rawCategory])

  const items = useMemo<SubCategory[]>(() => {
    return SUBCATEGORY_MAP[normalizedCategory] ?? SUBCATEGORY_MAP["Trending Services"]
  }, [normalizedCategory])

  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    if (!scrollRef.current) return
    const firstChild = scrollRef.current.children[0] as HTMLElement | undefined
    const width = firstChild?.clientWidth ?? 160
    const gap = 12
    scrollRef.current.scrollBy({ left: dir * (width + gap) })
  }

  const handleSelectSubCategory = (title: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", normalizedCategory)
    params.set("sub-category", title)
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Scroll to an offset (top-72 ≈ 18rem = 288px) when sub-category changes
  useEffect(() => {
    const current = searchParams.get("sub-category")
    if (lastSubCategoryRef.current !== current) {
      lastSubCategoryRef.current = current
      // Defer to next tick to ensure layout settled before scrolling
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 500, behavior: "smooth" })
        }
      }, 0)
    }
  }, [searchParams])

  return (
    <section className="mt-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Popular in {normalizedCategory}</h3>
          <div className="hidden sm:flex gap-2">
            <button
              aria-label="Prev"
              className="h-8 w-8 grid place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => scroll(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next"
              className="h-8 w-8 grid place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => scroll(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map(({ title, image }, idx) => (
            <div key={idx} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSelectSubCategory(title)}
                className="group w-36 sm:w-40 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-left"
                aria-label={`Select ${title}`}
              >
                <div className="relative h-24 sm:h-28 overflow-hidden">
                  <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="px-3 py-2">
                  <p className="text-center text-sm font-medium text-gray-800 min-h-9 leading-snug line-clamp-2">{title}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}