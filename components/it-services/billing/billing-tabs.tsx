"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingHistory } from "./billing-history"
import { BillingInfo } from "./billing-info"
import { Balances } from "./balances"
import { PaymentMethods } from "./payment-methods"

export function BillingTabs() {
  return (
    <Tabs defaultValue="billing-history" className="w-full flex flex-col">
      <div className="w-full">
        <TabsList
          className="
            w-full
            mb-4
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-2
            md:grid-cols-4
          "
        >
          <TabsTrigger value="billing-history" className="w-full">
            Billing history
          </TabsTrigger>
          <TabsTrigger value="billing-info" className="w-full">
            Billing info
          </TabsTrigger>
          <TabsTrigger value="balances" className="w-full">
            Balances
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="w-full">
            Payment methods
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="w-full mt-36 sm:mt-8 lg:mt-0">
        <TabsContent value="billing-history" className="mt-0 sm:mt-2">
          <BillingHistory />
        </TabsContent>

        <TabsContent value="billing-info" className="mt-0 sm:mt-2">
          <BillingInfo />
        </TabsContent>

        <TabsContent value="balances" className="mt-0 sm:mt-2">
          <Balances />
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-0 sm:mt-2">
          <PaymentMethods />
        </TabsContent>
      </div>
    </Tabs>
  )
}
