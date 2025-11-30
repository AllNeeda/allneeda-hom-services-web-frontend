"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

export function SearchFilters() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sellerDetails, setSellerDetails] = useState({
    topRated: false,
    levelTwo: false,
    levelOne: false,
    newSeller: false,
    onlineNow: false,
  })
  const [deliveryTime, setDeliveryTime] = useState("anytime")
  const [budgetRange, setBudgetRange] = useState("value")
  const [customBudget, setCustomBudget] = useState("")

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3">

      {/* Category */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[160px]">
            Category
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 px-4">
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            <DropdownMenuRadioItem value="all" className="justify-between">
              All Categories
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="wordpress" className="justify-between">
              WordPress Development
              <span className="ml-auto text-muted-foreground">(14,492)</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="custom-web" className="justify-between">
              Custom Websites Development
              <span className="ml-auto text-muted-foreground">(13,031)</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="website-dev" className="justify-between">
              Website Development
              <span className="ml-auto text-muted-foreground">(35,561)</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="software-dev" className="justify-between">
              Software Development
              <span className="ml-auto text-muted-foreground">(7,247)</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="web-app" className="justify-between">
              Web Application Development
              <span className="ml-auto text-muted-foreground">(6,350)</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <div className="sticky bottom-0 bg-popover border-t mt-2 -mx-1 px-2 py-2 flex items-center justify-between">
            <Button variant="ghost" className="px-2" onClick={() => setSelectedCategory("all")}>Clear all</Button>
            <Button size="sm">Apply</Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

     

      {/* Seller Details */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[150px]">
            Seller Details
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Seller Details</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            className="justify-between"
            checked={sellerDetails.topRated}
            onCheckedChange={(v) =>
              setSellerDetails((prev) => ({ ...prev, topRated: !!v }))
            }
          >
            Top Rated Seller
            <span className="ml-auto text-muted-foreground">(697)</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            className="justify-between"
            checked={sellerDetails.levelTwo}
            onCheckedChange={(v) =>
              setSellerDetails((prev) => ({ ...prev, levelTwo: !!v }))
            }
          >
            Level 2
            <span className="ml-auto text-muted-foreground">(5,499)</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            className="justify-between"
            checked={sellerDetails.levelOne}
            onCheckedChange={(v) =>
              setSellerDetails((prev) => ({ ...prev, levelOne: !!v }))
            }
          >
            Level 1
            <span className="ml-auto text-muted-foreground">(5,395)</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            className="justify-between"
            checked={sellerDetails.newSeller}
            onCheckedChange={(v) =>
              setSellerDetails((prev) => ({ ...prev, newSeller: !!v }))
            }
          >
            New Seller
            <span className="ml-auto text-muted-foreground">(46,582)</span>
          </DropdownMenuCheckboxItem>
          <div className="sticky bottom-0 bg-popover border-t mt-2 -mx-1 px-2 py-2 flex items-center justify-between">
            <Button
              variant="ghost"
              className="px-2"
              onClick={() =>
                setSellerDetails({ topRated: false, levelTwo: false, levelOne: false, newSeller: false, onlineNow: false })
              }
            >
              Clear all
            </Button>
            <Button size="sm">Apply</Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Budget */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[120px]">
            Budget
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuLabel>Budget</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-3 p-2 pt-0">
            <div className="border rounded-md p-3">
              <p className="text-sm font-medium">Hire hourly</p>
              <p className="text-xs text-muted-foreground">Pay on an hourly basis.</p>
            </div>
            <div className="relative text-center">
              <span className="px-2 text-xs text-muted-foreground bg-popover relative z-10">OR</span>
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t" />
            </div>
            <DropdownMenuRadioGroup value={budgetRange} onValueChange={setBudgetRange}>
              <DropdownMenuRadioItem value="value" className="justify-between">
                Value
                <span className="text-muted-foreground">Under $105</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mid" className="justify-between">
                Mid-range
                <span className="text-muted-foreground">$105–$200</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="high" className="justify-between">
                High-end
                <span className="text-muted-foreground">$200 & Above</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="custom">
                Custom
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            {budgetRange === "custom" && (
              <div className="pt-1">
                <label className="text-xs text-muted-foreground">Up to</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="$"
                  className="mt-1 h-9"
                />
              </div>
            )}
          </div>
          <div className="sticky bottom-0 bg-popover border-t mt-2 -mx-1 px-2 py-2 flex items-center justify-between">
            <Button variant="ghost" className="px-2" onClick={() => { setBudgetRange("value"); setCustomBudget("") }}>Clear all</Button>
            <Button size="sm">Apply</Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delivery Time */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[150px]">
            Delivery Time
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Delivery Time</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={deliveryTime} onValueChange={setDeliveryTime}>
            <DropdownMenuRadioItem value="24h">Express 24H</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3d">Up to 3 days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="7d">Up to 7 days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="anytime">Anytime</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <div className="sticky bottom-0 bg-popover border-t mt-2 -mx-1 px-2 py-2 flex items-center justify-between">
            <Button variant="ghost" className="px-2" onClick={() => setDeliveryTime("anytime")}>Clear all</Button>
            <Button size="sm">Apply</Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      <Button variant="outline" className="bg-transparent">
        Clear All Filters
      </Button>
      </div>
    </div>
  )
}
