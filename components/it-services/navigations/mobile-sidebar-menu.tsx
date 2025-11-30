"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronRight, Grid2X2, Search, MoveRight, MoveLeft, User } from "lucide-react"

type SidebarMenuProps = { isOpen: boolean; onClose: () => void }

type DropdownItem = { label: string; href: string }

type MenuItem = {
  label: string
  href: string
  icon?: "grid" | "cart" | "account"
  dropdownItems?: DropdownItem[]
}

type SubMenuSection = { title: string; items: DropdownItem[] }

// Main menu structure
const menu: MenuItem[] = [
  { label: "Browse", href: "/it-services/search", icon: "cart" },
  { label: "Account", href: "/it-services/account/", icon: "account" },
  {
    label: "Browse categories",
    href: "/it-services/categories",
    icon: "grid",
    dropdownItems: [
      { label: "Trending 🔥", href: "/it-services/search?category=trending" },
      { label: "Graphics & Design", href: "/it-services/categories/graphics-design" },
      { label: "Programming & Tech", href: "/it-services/categories/programming-tech" },
      { label: "Digital Marketing", href: "/it-services/categories/digital-marketing" },
      { label: "Video & Animation", href: "/it-services/categories/video-animation" },
      { label: "Writing & Translation", href: "/it-services/categories/writing-translation" },
      { label: "Music & Audio", href: "/it-services/categories/music-audio" },
      { label: "Business", href: "/it-services/categories/business" },
      { label: "Finance", href: "/it-services/categories/finance" },
      { label: "AI Services", href: "/it-services/categories/ai-services" },
      { label: "Personal Growth", href: "/it-services/categories/personal-growth" },
      { label: "Consulting", href: "/it-services/categories/consulting" },
      { label: "Data", href: "/it-services/categories/data" },
    ],
  },
]

// Second-level submenu content keyed by dropdown item label
const subMenus: Record<string, SubMenuSection[]> = {
  "Trending 🔥": [
    {
      title: "Publish Your Book",
      items: [
        { label: "Book Design", href: "/it-services/trending/book-design" },
        { label: "Book Editing", href: "/it-services/trending/book-editing" },
        { label: "Book & eBook Marketing", href: "/it-services/trending/book-marketing" },
        { label: "Children's Book Illustration", href: "/it-services/trending/children-illustration" },
        { label: "Beta Reading", href: "/it-services/trending/beta-reading" },
        { label: "Convert to eBook", href: "/it-services/trending/convert-ebook" },
        { label: "Book & eBook Writing", href: "/it-services/trending/book-writing" },
      ],
    },
    {
      title: "Create Your Website",
      items: [
        { label: "E-commerce & Dropshipping", href: "/it-services/trending/ecommerce-dropshipping" },
        { label: "Shopify", href: "/it-services/trending/shopify" },
        { label: "WordPress", href: "/it-services/trending/wordpress" },
        { label: "Website Design", href: "/it-services/trending/website-design" },
        { label: "E-Commerce Marketing", href: "/it-services/trending/ecommerce-marketing" },
      ],
    },
  ],
  "Graphics & Design": [
    {
      title: "Logo & Brand Identity",
      items: [
        { label: "Logo Design", href: "/it-services/graphics/logo-design" },
        { label: "Brand Style Guides", href: "/it-services/graphics/style-guides" },
        { label: "Business Cards & Stationery", href: "/it-services/graphics/business-cards" },
        { label: "Fonts & Typography", href: "/it-services/graphics/fonts-typography" },
        { label: "Art Direction", href: "/it-services/graphics/art-direction" },
        { label: "Logo Maker Tool", href: "/it-services/graphics/logo-maker" },
      ],
    },
    {
      title: "Art & Illustration",
      items: [
        { label: "Illustration", href: "/it-services/graphics/illustration" },
        { label: "AI Artists", href: "/it-services/graphics/ai-artists" },
        { label: "AI Avatar Design", href: "/it-services/graphics/ai-avatar-design" },
        { label: "Portraits & Caricatures", href: "/it-services/graphics/portraits-caricatures" },
        { label: "Comic Illustration", href: "/it-services/graphics/comic-illustration" },
        { label: "Cartoon Illustration", href: "/it-services/graphics/cartoon-illustration" },
        { label: "Storyboards", href: "/it-services/graphics/storyboards" },
        { label: "Album Cover Design", href: "/it-services/graphics/album-covers" },
        { label: "Pattern Design", href: "/it-services/graphics/pattern-design" },
        { label: "Tattoo Design", href: "/it-services/graphics/tattoo-design" },
      ],
    },
  ],
}

function renderIcon(name?: MenuItem["icon"]) {
  const className = "w-4 h-4 text-emerald-700"
  switch (name) {
    case "grid":
      return <Grid2X2 className={className} />
    case "cart":
      return <Search className={className} />
    case "account":
      return <User className={className} />
    default:
      return null
  }
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const [openBrowse, setOpenBrowse] = useState(true)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)

  return (
    <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? '' : 'pointer-events-none'}`} aria-modal="true" role="dialog">
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose} />

      <div
        className={`absolute top-0 left-0 h-full w-[78%] max-w-xs bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">IT Services</span>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">✕</button>
        </div>

        <nav className="px-2 py-3 overflow-y-auto h-[calc(100%-56px)] relative">
          <ul className="mb-4">
            {menu.map((item) => (
              <li key={item.label}>
                {item.dropdownItems && item.dropdownItems.length > 0 ? (
                  <div>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                      onClick={() => setOpenBrowse((v) => !v)}
                    >
                      <span className="flex items-center gap-3 text-sm text-gray-900 dark:text-gray-100">
                        {renderIcon(item.icon)}
                        {item.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openBrowse ? "rotate-180" : ""}`} />
                    </button>
                    {openBrowse && (
                      <ul className="ml-4 mb-2 border-l border-gray-200 dark:border-gray-800">
                        {item.dropdownItems.map((sub) => (
                          <li key={sub.label} className="flex items-center">
                            <Link
                              href={sub.href}
                              className="flex-1 flex items-center justify-between pl-4 pr-2 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                              onClick={onClose}
                            >
                              <span>{sub.label}</span>
                            </Link>
                            <button
                              aria-label="Open submenu"
                              className="p-2 ml-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-gray-400 transition-colors"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedSub(sub.label)
                              }}
                            >
                              <MoveRight className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                    onClick={onClose}
                  >
                    <span className="flex items-center gap-3 text-sm text-gray-900 dark:text-gray-100">
                      {renderIcon(item.icon)}
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {subMenuSidebar({
            label: selectedSub || "",
            isOpen: Boolean(selectedSub),
            onBack: () => setSelectedSub(null),
            onClose,
          })}
        </nav>
      </div>
    </div>
  )
}




const subMenuSidebar = ({ label, isOpen, onBack, onClose }: { label: string; isOpen: boolean; onBack: () => void; onClose: () => void }) => {
  const sections = subMenus[label] || []
  return (
    <div className={`absolute inset-0 bg-white dark:bg-gray-900 z-10 transition-all duration-300 ease-out md:hidden ${isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}>
      <div className="px-4 py-4  flex items-center gap-2">
        <button aria-label="Back" onClick={onBack} className="p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors">
          <MoveLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      </div>
      <div className="h-[calc(100%-56px)] overflow-y-auto px-6 py-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h4 className="text-sm font-bold uppercase tracking-wide  mb-3">{section.title}</h4>
            <ul className="space-y-2">
              {section.items.map((it) => (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    className="block text-xs text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded-md px-2 py-2 transition-colors"
                    onClick={onClose}
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-sm text-gray-500">No items available.</p>
        )}
      </div>
    </div>
  )
}