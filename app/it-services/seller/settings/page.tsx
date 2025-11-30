"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [tab, setTab] = React.useState<string>("general");

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <TabsList className="bg-transparent p-0 h-auto min-w-max">
              {[
                { key: "general", label: "General" },
                { key: "notifications", label: "Notifications" },
                { key: "security", label: "Security" },
                { key: "appearance", label: "Appearance" },
              ].map(({ key, label }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 dark:data-[state=active]:border-emerald-400 whitespace-nowrap"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-6 space-y-6 sm:space-y-8">
            {/* General */}
            <TabsContent value="general">
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
                      <Input 
                        id="username" 
                        placeholder="Your username" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your name" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="e.g. +1 555 123 4567" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">Preferred Language</Label>
                      <select
                        id="language"
                        className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select language
                        </option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="hi">Hindi</option>
                        <option value="ar">Arabic</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="availability" className="text-gray-700 dark:text-gray-300">Availability Hours</Label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Input
                          id="availability-start"
                          type="datetime-local"
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          placeholder="Start time"
                        />
                        <span className="self-center text-gray-500 dark:text-gray-400 text-center sm:text-left">to</span>
                        <Input
                          id="availability-end"
                          type="datetime-local"
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          placeholder="End time"
                        />
                      </div>
                    </div>

                    <Button className="mt-2 w-full sm:w-auto">Save changes</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Email notifications</h3>
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Type</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead className="text-right min-w-[100px]">Enabled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { type: "Order updates", desc: "Status changes and delivery updates" },
                        { type: "Messages", desc: "New messages from clients" },
                        { type: "Gig view", desc: "Get notified when someone views your gig" },
                        { type: "Gig update", desc: "Get notified about changes to your gigs" },
                      ].map((row) => (
                        <TableRow key={row.type}>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">{row.type}</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">{row.desc}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto">Toggle</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Password</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="current" className="text-gray-700 dark:text-gray-300">Current password</Label>
                      <Input 
                        id="current" 
                        type="password" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="new" className="text-gray-700 dark:text-gray-300">New password</Label>
                      <Input 
                        id="new" 
                        type="password" 
                        className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                      />
                    </div>
                    <Button className="mt-1 w-full sm:w-auto">Update password</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Two-factor auth</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Add an extra layer of security to your account.</p>
                  <Button variant="outline" className="w-full sm:w-auto">Enable 2FA</Button>
                </div>
                
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Active sessions</h3>
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Device</TableHead>
                          <TableHead className="min-w-[120px]">Location</TableHead>
                          <TableHead className="text-right min-w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-gray-900 dark:text-gray-100">Windows • Chrome</TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">Quetta, PK</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto">Sign out</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Deactivate Account Section */}
                <div className="rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Deactivate Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Deactivating your account will disable your profile and remove access to your dashboard. You can reactivate your account by logging in again.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-full sm:w-auto">
                      <Label htmlFor="deactivate-reason" className="mb-1 block text-gray-700 dark:text-gray-300">Reason for deactivating</Label>
                      <select
                        id="deactivate-reason"
                        className="block w-full sm:w-56 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a reason
                        </option>
                        <option value="privacy">Privacy concerns</option>
                        <option value="not-using">No longer using the service</option>
                        <option value="issues">Technical issues</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Button variant="destructive" className="mt-2 sm:mt-6 w-full sm:w-auto">
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Theme</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Button variant="outline" className="w-full sm:w-auto">Light</Button>
                  <Button variant="outline" className="w-full sm:w-auto">Dark</Button>
                  <Button className="w-full sm:w-auto">System</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


