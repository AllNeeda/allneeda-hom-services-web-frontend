// src/components/marketing-hub/Guarantee.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ShieldIcon,
  InfoIcon,
  HeartIcon,
  CalculatorIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetServices } from "@/hooks/useServices";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import { useActivateGuarantee } from "@/hooks/useMarketing";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuarantyList from "./GuarantyList";

// Types
interface GuaranteeFormData {
  professional_id: string;
  service_id: string;
  guarantee_type: string;
  duration: "monthly" | "annual";
  start_date: string;
  credits: number;
  end_date: string;
  guarantee_name: string;
  guarantee_details: string;
}

interface Service {
  id: string;
  name: string;
  professional_id?: string;
  service_status?: boolean;
}

const Guarantee: React.FC = () => {
  // State
  const [serviceId, setServiceId] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<"monthly" | "annual">("monthly");
  const [selectedType, setSelectedType] = useState("satisfaction");
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [credits, setCredits] = useState(0);
  const [professionalId, setProfessionalId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("activate");
  const token = getAccessToken() || "";

  const {
    data: servicesResponse,
    isLoading: servicesLoading,
    error: servicesError
  } = useGetServices(token || "");

  const services: Service[] = useMemo(() => {
    if (!servicesResponse) return [];
    let servicesArray: any[] = [];

    if (servicesResponse?.services?.services) {
      servicesArray = servicesResponse.services.services;
    } else if (servicesResponse?.services && Array.isArray(servicesResponse.services)) {
      servicesArray = servicesResponse.services;
    } else if (Array.isArray(servicesResponse)) {
      servicesArray = servicesResponse;
    } else if (servicesResponse && typeof servicesResponse === 'object') {
      const keys = Object.keys(servicesResponse);
      for (const key of keys) {
        if (Array.isArray(servicesResponse[key])) {
          servicesArray = servicesResponse[key];
          break;
        }
      }
    }

    const mappedServices = servicesArray.map(item => ({
      id: item.id || item._id || item.service_id || "",
      name: item.name || item.service_name || item.title || "Unnamed Service",
      professional_id: item.professional_id ||
        item.professionalId ||
        item.user_id ||
        item.userId ||
        servicesResponse?.services?.professional?.id ||
        servicesResponse?.services?.professional?._id ||
        "",
      service_status: item.service_status || item.status || false,
    })).filter(service => service.id);

    if (mappedServices.length > 0 && mappedServices[0].professional_id) {
      setProfessionalId(mappedServices[0].professional_id);
    }

    if (!professionalId && servicesResponse?.services?.professional) {
      const profId = servicesResponse.services.professional.id ||
        servicesResponse.services.professional._id ||
        "";
      if (profId) {
        setProfessionalId(profId);
      }
    }

    if (servicesResponse?.services?.professional?.credit_balance) {
      setCredits(servicesResponse.services.professional.credit_balance);
    }

    return mappedServices;
  }, [servicesResponse, professionalId]);

  const { mutate: activateGuarantee, isPending: isActivating } = useActivateGuarantee();

  // Memoized guarantee types
  const guaranteeTypes = useMemo(() => [
    {
      id: "satisfaction",
      name: "Satisfaction Guarantee",
      description: "Full refund if not satisfied with the service",
      icon: <HeartIcon className="w-4 h-4 md:w-5 md:h-5" />,
      monthlyCreditCost: 5,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: "workmanship",
      name: "Workmanship Guarantee",
      description: "Free fixes for workmanship issues for 90 days",
      icon: <ShieldIcon className="w-4 h-4 md:w-5 md:h-5" />,
      monthlyCreditCost: 5,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: "double-back",
      name: "Double-Back Guarantee",
      description: "We'll send another pro if you're not happy",
      icon: <ZapIcon className="w-4 h-4 md:w-5 md:h-5" />,
      monthlyCreditCost: 5,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ], []);

  const durationOptions = useMemo(() => [
    { id: "monthly", name: "Monthly", months: 1, creditMultiplier: 1 },
    { id: "annual", name: "Annual", months: 12, creditMultiplier: 12 }, // 8 instead of 12 for annual discount
  ], []);

  const creditCost = useMemo(() => {
    const selectedGuarantee = guaranteeTypes.find(t => t.id === selectedType);
    const selectedDurationOption = durationOptions.find(d => d.id === selectedDuration);

    if (!selectedGuarantee || !selectedDurationOption) return 0;

    const baseMonthlyCost = selectedGuarantee.monthlyCreditCost || 0;
    let totalCost = baseMonthlyCost * selectedDurationOption.creditMultiplier;
    if (selectedDuration === "annual") {
      totalCost = Math.round(totalCost * 0.9);
    }

    return totalCost;
  }, [guaranteeTypes, durationOptions, selectedType, selectedDuration]);

  const monthlyEquivalentCost = useMemo(() => {
    const selectedDurationOption = durationOptions.find(d => d.id === selectedDuration);
    if (!selectedDurationOption) return creditCost;

    return Math.round((creditCost / selectedDurationOption.months) * 100) / 100;
  }, [creditCost, selectedDuration, durationOptions]);

  useEffect(() => {
    // Calculate savings percentage for display
    const selectedGuarantee = guaranteeTypes.find(t => t.id === selectedType);
    const monthlyCost = selectedGuarantee?.monthlyCreditCost || 0;
    const annualMonths = durationOptions.find(d => d.id === "annual")?.months || 12;

    if (selectedDuration === "annual" && monthlyCost > 0) {
      const fullYearCost = monthlyCost * annualMonths;
      const discountedCost = creditCost;
      const savings = fullYearCost - discountedCost;
      const savingsPercent = Math.round((savings / fullYearCost) * 100);
      setSavingsPercentage(savingsPercent);
    } else {
      setSavingsPercentage(0);
    }
  }, [selectedDuration, selectedType, creditCost, guaranteeTypes, durationOptions]);

  const calculateDates = (): { startDate: string; endDate: string } => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    let endDate = new Date(today);
    const selectedDurationOption = durationOptions.find(d => d.id === selectedDuration);

    if (selectedDurationOption) {
      endDate.setMonth(endDate.getMonth() + selectedDurationOption.months);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    return {
      startDate,
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const handleActivateGuarantee = () => {
    if (credits < creditCost) {
      toast.error("Insufficient credits. Please purchase more credits to activate this guarantee.");
      return;
    }

    if (!serviceId) {
      toast.error("Please select a service first.");
      return;
    }

    if (!professionalId) {
      toast.error("Unable to identify professional account.");
      return;
    }

    const { startDate, endDate } = calculateDates();
    const selectedGuarantee = guaranteeTypes.find(t => t.id === selectedType);

    const data: GuaranteeFormData = {
      professional_id: professionalId,
      service_id: serviceId,
      guarantee_type: selectedType,
      duration: selectedDuration,
      start_date: startDate,
      credits: creditCost,
      end_date: endDate,
      guarantee_name: selectedGuarantee?.name || "",
      guarantee_details: selectedGuarantee?.description || ""
    };

    activateGuarantee({ data, token });
    setCredits(prev => prev - creditCost);
  };

  useEffect(() => {
    if (serviceId) {
      const selectedService = services.find(service => service.id === serviceId);
      if (selectedService?.professional_id) {
        setProfessionalId(selectedService.professional_id);
      }
    }
  }, [serviceId, services]);

  // Loading state
  if (servicesLoading) {
    return <GlobalLoader />;
  }

  // Error state
  if (servicesError) {
    return (
      <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Error loading services: {servicesError.message || "Unknown error"}
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            Please check if you have created any services first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative">
      <CardHeader className="pb-3 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-[#0077B6]/10 dark:bg-[#0077B6]/20">
              <ShieldIcon className="w-5 h-5 md:w-6 md:h-6 text-[#0077B6] dark:text-[#40A4FF]" />
            </div>
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold">
                ProShield Guarantee
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Add trust and confidence to your services
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          >
            <ShieldIcon className="w-3 h-3 md:w-4 md:h-4" />
            {credits} Credits Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="activate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="activate" className="flex items-center gap-2 text-xs sm:text-sm">
              <ShieldIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Activate</span>
              <span className="xs:hidden">Activate</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 text-xs sm:text-sm">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Manage</span>
              <span className="xs:hidden">Manage</span>
            </TabsTrigger>
          </TabsList>

          {/* Activate Guarantee Tab */}
          <TabsContent value="activate" className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Select Service
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon
                        className="w-3 h-3 text-muted-foreground cursor-help"
                        aria-label="Info about service type"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3">
                      <p className="text-xs">
                        Select the service this guarantee will apply to. The guarantee will be attached to this specific service.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select a service to add guarantee" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="text-sm">
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate max-w-[180px] sm:max-w-xs">{service.name}</span>
                          <Badge
                            variant={service.service_status ? "default" : "secondary"}
                            className="ml-2 rounded-sm text-[10px] shrink-0"
                          >
                            {service.service_status ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled className="text-sm">
                      No services available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Guarantee Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Guarantee Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {guaranteeTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`border rounded-sm p-3 sm:p-4 cursor-pointer transition-all text-left ${selectedType === type.id
                      ? "ring-2 ring-[#0077B6] dark:ring-[#40A4FF] bg-blue-50/50 dark:bg-blue-950/20"
                      : "hover:bg-muted/50 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className={`p-2 rounded-sm ${type.color} w-fit`}>
                        {type.icon}
                      </div>
                      <Badge className={`${type.color} text-[10px] sm:text-xs px-2 py-0.5`}>
                        {type.monthlyCreditCost} credits/month
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Guarantee Duration</label>
              <Select
                value={selectedDuration}
                onValueChange={(value: "monthly" | "annual") => setSelectedDuration(value)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select guarantee period" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {durationOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="text-sm">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col">
                          <span>{option.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.months} month{option.months > 1 ? 's' : ''}
                          </span>
                        </div>
                        {option.id === "annual" && (
                          <Badge
                            variant="outline"
                            className="text-[10px] rounded-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            Save 10%
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing & Credit Summary */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <CalculatorIcon className="w-4 h-4 text-[#0077B6] dark:text-[#40A4FF]" />
                Credit Summary
              </h3>
              <div className="rounded-sm bg-muted/30 dark:bg-muted/10 p-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="w-full lg:w-auto">
                    <p className="text-sm text-muted-foreground">Total cost for {selectedDuration === 'annual' ? '12 months' : '1 month'}</p>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-2 mt-1">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-[#0077B6] dark:text-[#40A4FF]">
                          {creditCost} Credits
                        </span>
                        {savingsPercentage > 0 && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                            Save {savingsPercentage}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ({monthlyEquivalentCost} credits/month)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <ShieldIcon className="w-4 h-4 text-blue-500" />
                      <span>Your current balance:</span>
                      <span className="font-semibold">{credits} credits</span>
                    </div>
                    {credits < creditCost && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <InfoIcon className="w-3 h-3" />
                        You need {creditCost - credits} more credits to activate
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                      }}
                    >
                      Purchase Credits
                    </Button>
                    <Button
                      className="bg-[#0077B6] hover:bg-[#016ca6] dark:bg-[#40A4FF] dark:hover:bg-[#2B90D9] gap-2 w-full sm:w-auto"
                      onClick={handleActivateGuarantee}
                      disabled={credits < creditCost || !serviceId || isActivating || !token || !professionalId}
                    >
                      {isActivating ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Activating...
                        </span>
                      ) : (
                        <>
                          Activate Guarantee
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800 space-y-2">
                  <h4 className="text-sm font-medium mb-2">What&apos;s included:</h4>
                  {[
                    "Includes claim processing and customer support",
                    "Marketing materials to promote your guarantee",
                    "No hidden fees or setup costs",
                    "Increases customer trust and conversion rates",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Manage Guarantee Tab */}
          <TabsContent value="manage">
            <GuarantyList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Guarantee;