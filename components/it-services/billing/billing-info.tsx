"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function BillingInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Billing information</h2>

        <div className="max-w-2xl space-y-6">
          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="dark:text-gray-100">Full name</Label>
            <Input id="fullName" defaultValue="irfankhan0101" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Company name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="dark:text-gray-100">Company name</Label>
            <Input id="companyName" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="dark:text-gray-100">Country</Label>
            <Select defaultValue="afghanistan">
              <SelectTrigger className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                <SelectItem value="afghanistan">Afghanistan</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State/Region */}
          <div className="space-y-2">
            <Label htmlFor="state" className="dark:text-gray-100">State/Region</Label>
            <Input id="state" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="dark:text-gray-100">Address</Label>
            <Input id="address" placeholder="Street or PO Box" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="dark:text-gray-100">City</Label>
            <Input id="city" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Postal code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="dark:text-gray-100">Postal code</Label>
            <Input id="postalCode" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <Label htmlFor="taxId" className="dark:text-gray-100">Tax ID</Label>
            <Input id="taxId" className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100" />
          </div>

          {/* Invoices section */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Invoices</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will find your invoices under the{" "}
              <a href="#" className="text-green-600 dark:text-green-400 underline">
                Billing history
              </a>{" "}
              tab.
            </p>

            <div className="flex items-center space-x-2">
              <Checkbox id="emailInvoices" />
              <Label htmlFor="emailInvoices" className="text-sm dark:text-gray-100">
                I want to get invoices via email as well.
              </Label>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-6">
            <Button className="bg-black hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-gray-900">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
