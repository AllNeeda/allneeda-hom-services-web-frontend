'use client'

import { ModernServiceHeader } from "@/components/it-services/sections/service/modern-service-header"
import { ModernServiceGallery } from "@/components/it-services/sections/service/modern-service-gallery"
import { ModernServiceOverview } from "@/components/it-services/sections/service/modern-service-overview"
import { ModernPricingPackages } from "@/components/it-services/sections/service/modern-pricing-packages"
import { ModernSellerInfo } from "@/components/it-services/sections/service/modern-seller-info"
import { ModernReviewsSection } from "@/components/it-services/sections/service/modern-reviews-section"
import { ModernFAQSection } from "@/components/it-services/sections/service/modern-faq-section"
import { ModernRelatedServices } from "@/components/it-services/sections/service/modern-related-services"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb" 

export default function ServiceDetailsPage() {
  // Since this is a client component, we'll handle params differently
  // For now, we'll use a placeholder id
  const id = "placeholder"
  console.log("service slug", id)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Breadcrumb Navigation */}
      <div className="border-b bg-white dark:bg-gray-950 px-4 py-4 shadow-sm dark:border-gray-800">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Servicyee
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/search"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Programming & Tech
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/search"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Website Development
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-gray-900 dark:text-white">
                  Full Stack Development
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <ModernServiceHeader />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ModernServiceGallery />
            <ModernServiceOverview />
            <ModernSellerInfo />
            <ModernReviewsSection />
            <ModernFAQSection />
          </div>

          {/* Sidebar - Pricing Packages */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ModernPricingPackages />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <ModernRelatedServices />
        </div>
      </div>
    </div>
  )
}
