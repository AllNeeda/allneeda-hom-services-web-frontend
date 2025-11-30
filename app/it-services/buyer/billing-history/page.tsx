"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus} from "lucide-react"
import { BillingHistory } from "@/components/it-services/billing/billing-history"


export default function BillingHistoryPage() {

  const walletBalance = 1247.5
  const pendingAmount = 299.0
  const totalSpent = 2847.0

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-950 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Wallet & Payments
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Manage your balance and payment methods
            </p>
          </div>

          <div className="flex sm:justify-end">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                ${walletBalance.toFixed(2)}
              </div>
              <p className="text-emerald-100 text-sm mt-1">Ready to spend</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Pending Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${pendingAmount.toFixed(2)}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                In escrow
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                This year
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 p-4 bg-white rounded-lg">
          <BillingHistory />        
        </div>
      </div>
    </div>
  )
}
