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
import { Badge } from "@/components/ui/badge";
import {
  ShieldIcon,
  InfoIcon,
  HeartIcon,
  CalculatorIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
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
import { useActivateGuarantee } from "@/hooks/useGuarantee";
import toast from "react-hot-toast";

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
  description?: string;
  price?: number;
  service_category?: string;
  // Add other service properties as needed
}

const Guarantee: React.FC = () => {
  // State
  const [serviceId, setServiceId] = useState<string>("");
  const [isGuaranteeActive, setIsGuaranteeActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<"monthly" | "annual">("monthly");
  const [selectedType, setSelectedType] = useState("satisfaction");
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [credits, setCredits] = useState(0);
  const [professionalId, setProfessionalId] = useState<string>("");
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
    }
    else if (servicesResponse?.services && Array.isArray(servicesResponse.services)) {
      servicesArray = servicesResponse.services;
    }
    else if (Array.isArray(servicesResponse)) {
      servicesArray = servicesResponse;
    }
    else if (servicesResponse && typeof servicesResponse === 'object') {
      const keys = Object.keys(servicesResponse);
      for (const key of keys) {
        if (Array.isArray(servicesResponse[key])) {
          servicesArray = servicesResponse[key];
          break;
        }
      }
    }
    const mappedServices = servicesArray.map(item => {
      const serviceId = item.id || item._id || item.service_id || "";
      const serviceName = item.name || item.service_name || item.title || "Unnamed Service";
      const professionalId = item.professional_id ||
        item.professionalId ||
        item.user_id ||
        item.userId ||
        servicesResponse?.services?.professional?.id ||
        servicesResponse?.services?.professional?._id ||
        "";
      return {
        id: serviceId,
        name: serviceName,
        professional_id: professionalId,
        service_status: item.service_status || item.status || false,
        description: item.description || "",
        price: item.price || item.cost || item.rate || 0,
        service_category: item.service_category || item.category || "",
        ...item
      };
    }).filter(service => service.id); // Filter out services without IDs

    // Extract professional_id if not already set from services
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

    // Get credits from professional data
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
      icon: <HeartIcon className="w-4 h-4" />,
      creditCost: 5,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: "workmanship",
      name: "Workmanship Guarantee",
      description: "Free fixes for workmanship issues for 90 days",
      icon: <ShieldIcon className="w-4 h-4" />,
      creditCost: 5,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: "double-back",
      name: "Double-Back Guarantee",
      description: "We'll send another pro if you're not happy",
      icon: <ZapIcon className="w-4 h-4" />,
      creditCost: 5,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ], []);

  // Duration options - only monthly and annual (no discount on monthly)
  const durationOptions = useMemo(() => [
    { id: "monthly", name: "Monthly", creditMultiplier: 1 },
    { id: "annual", name: "Annual", creditMultiplier: 8 }, // 8 months worth for annual
  ], []);

  // Calculate credit cost
  const creditCost = useMemo(() => {
    const baseCost = guaranteeTypes.find(t => t.id === selectedType)?.creditCost || 0;
    const durationMultiplier = durationOptions.find(d => d.id === selectedDuration)?.creditMultiplier || 1;
    
    // Apply 10% discount only for annual billing
    let finalCost = baseCost * durationMultiplier;
    
    if (selectedDuration === "annual") {
      // Apply 10% discount for annual billing
      finalCost = finalCost * 0.9; // 10% discount
    }
    
    return Math.round(finalCost);
  }, [guaranteeTypes, durationOptions, selectedType, selectedDuration]);

  // Sync selectedDuration with isAnnualBilling
  useEffect(() => {
    if (isAnnualBilling) {
      setSelectedDuration("annual");
    } else {
      setSelectedDuration("monthly");
    }
  }, [isAnnualBilling]);

  // Calculate savings percentage - only 10% for annual
  useEffect(() => {
    const annualDiscount = selectedDuration === "annual" ? 10 : 0;
    setSavingsPercentage(annualDiscount);
  }, [selectedDuration]);

  // Calculate start and end dates
  const calculateDates = (): { startDate: string; endDate: string } => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];

    let endDate = new Date(today);
    if (selectedDuration === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // For monthly, guarantee expires at end of day
      endDate.setDate(endDate.getDate() + 1);
    }

    return {
      startDate,
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Handle guarantee activation
  const handleActivateGuarantee = () => {
    if (!serviceId) {
      toast.error("Please select a service first.");
      return;
    }

    if (credits < creditCost) {
      toast.error("Insufficient credits. Please purchase more credits to activate this guarantee.");
      return;
    }

    if (!professionalId) {
      toast.error("Unable to identify your professional account. Please try again.");
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
      credits: creditCost, // Pass the calculated credit cost
      end_date: endDate,
      guarantee_name: selectedGuarantee?.name || "",
      guarantee_details: selectedGuarantee?.description || ""
    };
    
    activateGuarantee({ data, token });
    setCredits(prev => prev - creditCost);
    setIsGuaranteeActive(true);
  };

  // Update professionalId when service is selected
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

  // If no services available
  if (services.length === 0) {
    return (
      <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <ShieldIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Services Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You need to create services first before adding guarantees.
            </p>
            <Button
              asChild
              className="bg-[#0077B6] hover:bg-[#016ca6] dark:bg-[#40A4FF] dark:hover:bg-[#2B90D9]"
            >
              <a href="/home-services/dashboard/services/addServices">
                Create Your First Service
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative">
      <CardHeader className="pb-3 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="p-2 rounded-sm bg-[#0077B6]/10 dark:bg-[#0077B6]/20">
                <ShieldIcon className="w-5 h-5 text-[#0077B6] dark:text-[#40A4FF]" />
              </span>
              ProShield Guarantee
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              Build trust and win more customers with our comprehensive satisfaction guarantee program.
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                ({services.length} services available)
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Service Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Select Service
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
                    Select the service this guarantee will apply to. The guarantee will be attached to this specific service.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service to add guarantee" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id} className="text-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service.name}</span>
                      <Badge
                        variant={service.service_status ? "default" : "secondary"}
                        className="ml-1 rounded-[4px] text-[10px]"
                      >
                        {service.service_status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
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
                className={`border rounded-sm p-4 cursor-pointer transition-all ${selectedType === type.id
                    ? "ring-1 ring-[#0077B6] dark:ring-[#40A4FF] bg-blue-50/50 dark:bg-blue-950/20"
                    : "hover:bg-muted/50"
                  }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-sm ${type.color}`}>
                    {type.icon}
                  </div>
                  <Badge className={type.color}>
                    {type.creditCost} credits/month
                  </Badge>
                </div>
                <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Duration Selection */}
          <div className="flex-1 space-y-3">
            <label className="text-sm font-medium">Guarantee Duration</label>
            <Select
              value={selectedDuration}
              onValueChange={(value: "monthly" | "annual") => {
                setSelectedDuration(value);
                setIsAnnualBilling(value === "annual");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select guarantee period" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {durationOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="text-sm ">
                    <div className="flex justify-between items-center w-full">
                      <span>{option.name}</span>
                      {option.id === "annual" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] mx-2 rounded-[4px] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
        </div>

        {/* Pricing & Credit Summary */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-normal mb-3 flex items-center gap-2">
            <CalculatorIcon className="w-4 h-4 text-[#0077B6] dark:text-[#40A4FF]" />
            Credit Summary
          </h3>
          <div className="rounded-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">This guarantee will cost</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0077B6] dark:text-[#40A4FF]">
                    {creditCost} Credits
                  </span>
                  {savingsPercentage > 0 && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Save {savingsPercentage}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your current balance: {credits} credits
                </p>
              </div>

              <Button
                className="bg-[#0077B6] hover:bg-[#016ca6] dark:bg-[#40A4FF] dark:hover:bg-[#2B90D9] gap-2 w-full sm:w-auto"
                onClick={handleActivateGuarantee}
                disabled={credits < creditCost || !serviceId || isActivating || !token || !professionalId}
              >
                {isActivating ? (
                  "Activating..."
                ) : isGuaranteeActive ? (
                  "Update Guarantee"
                ) : (
                  <>
                    Activate Guarantee
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Benefits List */}
            <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-800 space-y-2">
              {[
                "Includes claim processing and customer support",
                "Marketing materials to promote your guarantee",
                "No hidden fees or setup costs",
                "Increases customer trust and conversion rates",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Guarantee;