"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function Balances() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Available balances</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {/* Fiverr Balance */}
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">Servicyee Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>From canceled orders</span>
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">$0.00</div>
              </div>
            </CardContent>
          </Card>

          {/* Fiverr Credits */}
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">Servicyee Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Credits</span>
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">$0.00</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Use for purchases.</div>
              </div>
            </CardContent>
          </Card>

          {/* Earn Credits */}
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg">Like to earn some credits?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Refer people you know and everyone benefits!</p>
                <Button className="w-full bg-black hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-black">
                  <Link href={"/it-services/referral/"}>Earn Servicyee Credits</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
