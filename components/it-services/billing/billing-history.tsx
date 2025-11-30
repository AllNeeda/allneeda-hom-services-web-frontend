"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"

export function BillingHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Billing history</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select defaultValue="date-range">
            <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectItem value="date-range">Date range</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="document">
            <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectValue placeholder="Document" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="receipt">Receipt</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="currency">
            <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
              <SelectItem value="currency">Currency</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by invoice or order number..."
              className="pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Results info and download */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Showing 0 results.</p>
          <Button variant="outline" size="sm" className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
            <Download className="h-4 w-4 mr-2" />
            Download report
          </Button>
        </div>

        {/* Table header */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-t-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-7 gap-4 p-4 text-sm font-medium text-gray-700 dark:text-gray-200">
            <div>Date</div>
            <div>Document</div>
            <div>Service</div>
            <div>Order</div>
            <div>Currency</div>
            <div>Total</div>
            <div>PDF</div>
          </div>
        </div>

        {/* Empty state */}
        <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-950">
          <div className="flex flex-col items-center justify-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No invoices yet...</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Ready to place an order?</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Make sure{" "}
              <a href="#" className="text-green-600 dark:text-green-400 underline">
                your billing info
              </a>{" "}
              is up to date.
            </p>
            <Button className="bg-black hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-gray-900">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
