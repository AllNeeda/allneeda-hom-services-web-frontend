"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, FileSignature } from "lucide-react";

export default function EarningsPage() {
  const [tab, setTab] = React.useState<string>("overview");

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Earnings</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your earnings and financial documents.</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <TabsList className="bg-transparent p-0 h-auto min-w-max">
              <TabsTrigger 
                value="overview" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
              >
                Financial documents
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="overview">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Available funds */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Available funds</div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Balance available for use</div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">$0.00</div>
                    <Button className="w-fit" variant="default">Add payout method</Button>
                  </div>
                </div>
                {/* Future payments */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Future payments</div>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Payments being cleared</div>
                      <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">$0.00</div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Payments for active orders</div>
                      <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">$0.00</div>
                    </div>
                  </div>
                </div>
                {/* Earnings & expenses */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 md:col-span-2 lg:col-span-1">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Earnings & expenses</div>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Since joining</div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Earnings to date</div>
                      <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">$0.00</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Your earnings since joining.</div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Expenses to date</div>
                      <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">$0.00</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Earnings spent on purchases since joining.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Date range</Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Activity</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Email activity report</Button>
                </div>
              </div>

              {/* Activity table */}
              <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Date</TableHead>
                        <TableHead className="min-w-[120px]">Activity</TableHead>
                        <TableHead className="min-w-[150px]">Description</TableHead>
                        <TableHead className="min-w-[100px]">From</TableHead>
                        <TableHead className="min-w-[100px]">Order</TableHead>
                        <TableHead className="text-right min-w-[100px]">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="py-12 sm:py-16 text-center">
                            <div className="mx-auto mb-4 h-20 w-20 sm:h-24 sm:w-24 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600">
                              <span className="text-2xl sm:text-3xl">☰</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Beginnings are so exciting!</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">You&apos;ll find all your earnings info here once you complete your first order.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Statement of earnings */}
                <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Statement of earnings</h3>
                      <p className="text-gray-600 dark:text-gray-400">Choose a date range and download a statement summarizing your yearly earnings.</p>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full sm:w-auto">Choose date range</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form W-9 */}
                <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      <FileSignature className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Form W-9</h3>
                      <p className="text-gray-600 dark:text-gray-400">You&apos;ve declared you&apos;re not a U.S. person, so you aren&apos;t required to complete a Form W-9.</p>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full sm:w-auto">Update your declaration</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


