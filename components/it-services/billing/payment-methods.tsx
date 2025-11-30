"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment methods</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Easily manage your payments methods through our secure system.
        </p>

        <div className="space-y-4">
          {/* Existing PayPal method */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PayPal</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">PayPal</span>
              </div>
            </CardContent>
          </Card>

          {/* Add payment method button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-16 border-dashed border-2 hover:border-gray-400 dark:hover:border-gray-600 bg-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          >
            <Plus className="h-5 w-5" />
            Add a payment method
          </Button>
        </div>
      </div>
    </div>
  )
}
