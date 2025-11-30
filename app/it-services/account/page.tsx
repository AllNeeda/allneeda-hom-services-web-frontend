"use client"

import { useMemo, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ServiceCard } from "@/components/it-services/service/service-card"
import { FreelancerCard } from "@/components/it-services/user/freelancer-card"

type Service = {
  id: number
  image: string
  category: string
  title: string
  rating: number
  reviews: number
  author: { name: string; avatar: string }
  price: number
}

type Freelancer = {
  id: number
  name: string
  profession: string
  avatar: string
  rating: number
  reviews: number
  skills: string[]
  location: string
  rate: string
  jobSuccess: string
  isOnline: boolean
}

function useMockServices(seed: string, count = 12): Service[] {
  return useMemo(() => {
    const cats = ["Design", "Marketing", "Writing", "Video", "Audio", "Tech", "Business", "Lifestyle"]
    const images = [
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&w=600",
      "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&w=600",
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&w=600",
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&w=600",
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&w=600",
      "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&w=600",
    ]
    const avatars = [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/65.jpg",
      "https://randomuser.me/api/portraits/men/41.jpg",
      "https://randomuser.me/api/portraits/men/85.jpg",
      "https://randomuser.me/api/portraits/women/12.jpg",
    ]
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      image: images[(i + seed.length) % images.length],
      category: cats[(i + seed.length) % cats.length],
      title: `${seed} Service #${i + 1}`,
      rating: Math.round((4 + ((i + seed.length) % 10) / 10) * 100) / 100,
      reviews: 20 + ((i * 13) % 300),
      author: {
        name: ["Wanda Runo", "Ali Tufan", "Sophie Lee", "Carlos Vega", "Jamie Fox", "Taylor Ray"][(i + 2) % 6],
        avatar: avatars[(i + 3) % avatars.length],
      },
      price: 25 + ((i * 17) % 750),
    }))
  }, [seed, count])
}

function useMockFreelancers(seed: string, count = 12): Freelancer[] {
  return useMemo(() => {
    const names = ["Alex Morgan", "Jordan Lee", "Sam Carter", "Riley Chen", "Taylor Kim", "Jamie Brooks", "Avery Park", "Drew Patel"]
    const professions = ["UI/UX Designer", "Full-Stack Developer", "SEO Specialist", "Copywriter", "Video Editor", "Sound Engineer"]
    const avatars = [
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/women/28.jpg",
      "https://randomuser.me/api/portraits/men/64.jpg",
      "https://randomuser.me/api/portraits/women/18.jpg",
      "https://randomuser.me/api/portraits/men/14.jpg",
      "https://randomuser.me/api/portraits/women/77.jpg",
    ]
    const skills = ["Figma", "React", "Next.js", "SEO", "Copywriting", "After Effects", "Pro Tools", "Node.js"]
    const locations = ["USA", "UK", "Germany", "Canada", "Australia", "Remote"]
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      name: names[(i + seed.length) % names.length],
      profession: professions[(i + 3) % professions.length],
      avatar: avatars[(i + 2) % avatars.length],
      rating: Math.round((4.5 + ((i + 1) % 5) / 10) * 100) / 100,
      reviews: 50 + ((i * 11) % 800),
      skills: [skills[(i + 1) % skills.length], skills[(i + 4) % skills.length], skills[(i + 6) % skills.length]],
      location: locations[(i + 2) % locations.length],
      rate: `$${25 + ((i * 7) % 75)}/hr`,
      jobSuccess: `${90 + ((i * 3) % 10)}%`,
      isOnline: (i + seed.length) % 2 === 0,
    }))
  }, [seed, count])
}

function CarouselSection({
  title,
  services,
}: {
  title: string
  services: Service[]
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const firstChild = el.children[0] as HTMLElement | undefined
    const cardWidth = firstChild?.clientWidth || 0
    const style = window.getComputedStyle(el)
    const gap = parseInt(style.columnGap || style.gap || "0", 10) || 0
    const viewport = el.clientWidth
    const cardsPerView = Math.max(1, Math.floor((viewport - 1) / Math.max(1, cardWidth + gap)))
    const distance = (cardWidth + gap) * cardsPerView
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" })
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards("left")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards("right")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pb-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
        >
          {services.map((service) => (
            <div key={service.id} className="snap-start w-64 sm:w-72 md:w-80 flex-shrink-0">
              <div className="h-full w-full">
                <ServiceCard service={service} />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile navigation */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-1">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards("left")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards("right")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function CarouselSectionFreelancers({
  title,
  freelancers,
}: {
  title: string
  freelancers: Freelancer[]
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const firstChild = el.children[0] as HTMLElement | undefined
    const cardWidth = firstChild?.clientWidth || 0
    const style = window.getComputedStyle(el)
    const gap = parseInt(style.columnGap || style.gap || "0", 10) || 0
    const viewport = el.clientWidth
    const cardsPerView = Math.max(1, Math.floor((viewport - 1) / Math.max(1, cardWidth + gap)))
    const distance = (cardWidth + gap) * cardsPerView
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" })
  }

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards("left")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards("right")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pb-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
        >
          {freelancers.map((f) => (
            <div key={f.id} className="snap-start w-64 sm:w-72 md:w-80 flex-shrink-0">
              <div className="h-full w-full">
                <FreelancerCard freelancer={f} />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile navigation */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-1">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards("left")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards("right")}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default function AccountPage() {
  const popular = useMockServices("Popular", 14)
  const recommended = useMockServices("Recommended", 14)
  const verified = useMockServices("Verified Pro", 14)
  const topRatedFreelancers = useMockFreelancers("Top Rated", 14)
  const recent = useMockServices("Recently Viewed", 10)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-10 space-y-10 md:space-y-12">
        <CarouselSection title="Recommended for You" services={recommended} />
        <CarouselSection title="Popular Services" services={popular} />
        <CarouselSection title="Recently Viewed" services={recent} />
        <CarouselSection title="Verified Pro Services" services={verified} />
        <CarouselSectionFreelancers title="Top Rated Sellers" freelancers={topRatedFreelancers} />
      </main>
    </div>
  )
}