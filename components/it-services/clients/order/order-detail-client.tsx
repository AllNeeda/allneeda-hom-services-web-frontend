"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityTab } from "@/components/it-services/sections/order-detail/activity-tab"
import { DetailsTab } from "@/components/it-services/sections/order-detail/details-tab"
import { RequirementsTab } from "@/components/it-services/sections/order-detail/requirements-tab"
import { DeliveryTab } from "@/components/it-services/sections/order-detail/delivery-tab"
import { OrderSidebar } from "@/components/it-services/navigations/order-sidebar"


export function OrderDetailClient() {
  const [activeTab, setActiveTab] = useState("activity")

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="activity" className="text-sm font-medium">
                  ACTIVITY
                </TabsTrigger>
                <TabsTrigger value="details" className="text-sm font-medium">
                  DETAILS
                </TabsTrigger>
                <TabsTrigger value="requirements" className="text-sm font-medium">
                  REQUIREMENTS
                </TabsTrigger>
                <TabsTrigger value="delivery" className="text-sm font-medium">
                  DELIVERY
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-0">
                <ActivityTab />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <DetailsTab />
              </TabsContent>

              <TabsContent value="requirements" className="mt-0">
                <RequirementsTab />
              </TabsContent>

              <TabsContent value="delivery" className="mt-0">
                <DeliveryTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSidebar />
          </div>
        </div>
      </main>

    </div>
  )
}
