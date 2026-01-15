// src/components/marketing-hub/CustomerRetention.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, TrendingUpIcon, UsersIcon, TargetIcon, BarChart3, PercentIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CustomerRetention: React.FC = () => {
  const [service, setService] = useState("Home Cleaning");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [customerCount, setCustomerCount] = useState<number>(150);
  const [offerType, setOfferType] = useState("discount");
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);

  const serviceOptions = [
    "All Services", "Home Cleaning", "Electrician", "HVAC", "Cleaning", "Landscaping",
    "Painting", "Handyman", "Carpenter", "Appliance Repair"
  ];

  const offerOptions = [
    { value: "discount", label: "Discount Offer", badge: "10-15% OFF" },
  ];

  return (
    
    
    <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900  bg-gray-50 overflow-hidden relative">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-gray-900">
                <TrendingUpIcon className="w-5 h-5 text-[#0077B6] dark:text-blue-400" />
              </div>
              Customer Retention Campaign
            </CardTitle>
            <CardDescription className="mt-2">
              Re-engage past customers with offers and reminders to boost repeat business.
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit bg-blue-100 text-blue-800 dark:bg-gray-900 dark:text-blue-300">
            <TargetIcon className="w-3 h-3 mr-1" />
            Retention Strategy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Service Type
                <InfoIcon className="w-3 h-3 text-muted-foreground" />
              </label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {serviceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                Number of Past Customers
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={customerCount}
                  onChange={(e) => setCustomerCount(Number(e.target.value))}
                  placeholder="e.g., 150"
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Offer Type</label>
              <Select value={offerType} onValueChange={setOfferType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an offer type" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {offerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {option.badge}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {offerType === "discount" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Discount Percentage
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    placeholder="e.g., 15"
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <PercentIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Dates</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("justify-start text-left font-normal w-full", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("justify-start text-left font-normal w-full", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">
                Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Campaign Performance Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-900">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Target Audience</p>
                    <p className="text-xl font-bold">{customerCount}</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-200/50 dark:bg-blue-800/50">
                    <UsersIcon className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Past customers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Reach</p>
                    <p className="text-xl font-bold">{Math.round(customerCount * 0.85)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-200/50 dark:bg-green-800/50">
                    <TargetIcon className="w-4 h-4 text-green-700 dark:text-green-300" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">85% of audience</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Response Rate</p>
                    <p className="text-xl font-bold">12-18%</p>
                  </div>
                  <div className="p-2 rounded-full bg-amber-200/50 dark:bg-amber-800/50">
                    <TrendingUpIcon className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Industry standard</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground">Campaign Cost</p>
                    <p className="text-xl font-bold">${(customerCount * 0.25).toFixed(2)}</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-200/50 dark:bg-purple-800/50">
                    <InfoIcon className="w-4 h-4 text-purple-700 dark:text-purple-300" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">$0.25 per customer</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" className="order-2 sm:order-1">
            Save Draft
          </Button>
          <Button className="bg-[#0077B6] hover:bg-[#016ca6] order-1 sm:order-2 mb-3 sm:mb-0">
            Launch Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerRetention;