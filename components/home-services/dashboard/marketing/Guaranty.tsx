// src/components/marketing-hub/Guarantee.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ShieldIcon,
  InfoIcon,
  HeartIcon,
  CalculatorIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ZapIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Guarantee: React.FC = () => {
  const [service, setService] = useState("Home Cleaning");
  const [isGuaranteeActive, setIsGuaranteeActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("30-days");
  const [selectedType, setSelectedType] = useState("satisfaction");
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [credits, setCredits] = useState(15);

  const serviceOptions: string[] = [
    "All Services",
    "Home Cleaning",
    "Electrician",
    "HVAC",
    "Cleaning",
    "Landscaping",
    "Painting",
    "Handyman",
    "Carpenter",
    "Appliance Repair",
  ];

  const guaranteeTypes = useMemo(() => [
    {
      id: "satisfaction",
      name: "Satisfaction Guarantee",
      description: "Full refund if not satisfied with the service",
      icon: <HeartIcon className="w-4 h-4" />,
      creditCost: 15,
      coverage: "8 Credits",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: "workmanship",
      name: "Workmanship Guarantee",
      description: "Free fixes for workmanship issues for 90 days",
      icon: <ShieldIcon className="w-4 h-4" />,
      creditCost: 25,
      coverage: "10 Credits",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: "double-back",
      name: "Double-Back Guarantee",
      description: "We'll send another pro if you're not happy",
      icon: <ZapIcon className="w-4 h-4" />,
      creditCost: 35,
      coverage: "15 Credits",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ], []);

  const durationOptions = useMemo(() => [
    { id: "7-days", name: "7 Days", discount: 0, creditMultiplier: 0.7 },
    { id: "30-days", name: "30 Days", discount: 0, creditMultiplier: 1 },
    { id: "90-days", name: "90 Days", discount: 5, creditMultiplier: 2.5 },
    { id: "1-year", name: "1 Year", discount: 15, creditMultiplier: 8 },
  ], []);

  const creditCost = useMemo(() => {
    const baseCost = guaranteeTypes.find(t => t.id === selectedType)?.creditCost || 0;
    const durationMultiplier = durationOptions.find(d => d.id === selectedDuration)?.creditMultiplier || 1;
    const billingDiscount = isAnnualBilling ? 0.8 : 1;
    return Math.round(baseCost * durationMultiplier * billingDiscount);
  }, [guaranteeTypes, durationOptions, selectedType, selectedDuration, isAnnualBilling]);

  useEffect(() => {
    const durationDiscount = durationOptions.find(d => d.id === selectedDuration)?.discount || 0;
    const annualDiscount = isAnnualBilling ? 10 : 0;
    setSavingsPercentage(durationDiscount + annualDiscount);
  }, [durationOptions, selectedDuration, isAnnualBilling]);

  const handleActivateGuarantee = () => {
    if (credits >= creditCost) {
      setCredits(prev => prev - creditCost);
      setIsGuaranteeActive(true);
    } else {
      alert("Insufficient credits. Please purchase more credits to activate this guarantee.");
    }
  };

  return (
    <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative">
      <CardHeader className="pb-3 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="p-2 rounded-full bg-[#0077B6]/10 dark:bg-[#0077B6]/20">
                <ShieldIcon className="w-5 h-5 text-[#0077B6] dark:text-[#40A4FF]" />
              </span>
              ProShield Guarantee
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              Build trust and win more customers with our comprehensive satisfaction guarantee program.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Service Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Service Type
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon
                    className="w-3 h-3 text-muted-foreground"
                    aria-label="Info about service type"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Select the service this guarantee will apply to. Different services may have different guarantee requirements.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((option) => (
                <SelectItem key={option} value={option} className="text-sm">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guarantee Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Guarantee Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {guaranteeTypes.map((type) => (
              <div
                key={type.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedType === type.id
                    ? "ring-1 ring-[#0077B6] dark:ring-[#40A4FF] bg-blue-50/50 dark:bg-blue-950/20"
                    : "hover:bg-muted/50"
                  }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-full ${type.color}`}>{type.icon}</div>
                  <Badge className={type.color}>{type.creditCost} credits</Badge>
                </div>
                <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                <div className="text-xs font-medium">Coverage: {type.coverage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Duration Selection */}
          <div className="flex-1 space-y-3">
            <label className="text-sm font-medium">Guarantee Duration</label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select guarantee period" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {durationOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="text-sm">
                    <div className="flex justify-between items-center w-full">
                      <span>{option.name}</span>
                      {option.discount > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          Save {option.discount}%
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Billing Selection */}
          <div className="flex-1 space-y-3">
            <label className="text-sm font-medium">Billing Cycle</label>
            <div className="flex items-center justify-between p-3 border rounded-md w-full">
              <span className="text-sm">Annual Billing</span>
              <div className="flex items-center gap-2">
                {isAnnualBilling && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs"
                  >
                    20% off
                  </Badge>
                )}
                <Switch checked={isAnnualBilling} onCheckedChange={setIsAnnualBilling} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Credit Summary */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-normal mb-3 flex items-center gap-2">
            <CalculatorIcon className="w-4 h-4 text-[#0077B6] dark:text-[#40A4FF]" />
            Credit Summary
          </h3>
          <div className=" rounded-lg ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">This guarantee will cost</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0077B6] dark:text-[#40A4FF]">{creditCost} Credits</span>
                  {savingsPercentage > 0 && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Save {savingsPercentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You will have {credits - creditCost} credits remaining
                </p>
              </div>

              <Button
                className="bg-[#0077B6] hover:bg-[#016ca6] dark:bg-[#40A4FF] dark:hover:bg-[#2B90D9] gap-2 w-full sm:w-auto"
                onClick={handleActivateGuarantee}
                disabled={credits < creditCost}
              >
                {isGuaranteeActive ? "Update Guarantee" : "Activate Guarantee"}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Benefits List */}
            <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800 space-y-2">
              {[
                "Includes claim processing and customer support",
                "Marketing materials to promote your guarantee",
                "No hidden fees or setup costs",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Switch id="guarantee-active" checked={isGuaranteeActive} onCheckedChange={setIsGuaranteeActive} />
            <label htmlFor="guarantee-active" className="text-sm font-medium cursor-pointer">
              Enable ProShield Guarantee
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <HeartIcon className="w-4 h-4" />
              Save for Later
            </Button>
            <Button
              className="gap-2 w-full sm:w-auto"
              variant="outline"
              onClick={() => setCredits(prev => prev + 100)}
            >
              <CreditCardIcon className="w-4 h-4" />
              Buy More Credits
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Guarantee;
