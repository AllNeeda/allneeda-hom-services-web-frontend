// src/components/marketing-hub/GetMoreLeads.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
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
import {
  Search,
  AlertCircle,
  CheckCircle,
  Zap,
  BadgeCheck,
  Phone,
  Mail,
  Shield,
  Star,
  MapPin,
  CreditCard,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useGetServices } from "@/hooks/useServices";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGetCreditPackage } from "@/hooks/useCredits";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRankingCampaign } from "@/hooks/useMarketing";
import { RankingactiveList } from "./rankingactiveList";

// Interface for credit package
interface CreditPackage {
  _id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  billingType: "monthly" | "annual" | "one_time" | "yearly";
  category: string;
  description?: string;
  discountPrice?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for service location
interface ServiceLocation {
  _id: string;
  type: string;
  professional_id: string;
  service_id: string;
  country: string;
  state: string;
  city: string;
  address_line?: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  serviceRadiusMiles: number;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  _id: string;
  service_name: string;
  location_ids: ServiceLocation[];
  completed_tasks?: number;
  description?: string;
  createdAt: string;
}

// Interface for user credits
interface UserCredits {
  credits: number;
  credit_balance?: number;
}

const GetMoreLeads: React.FC = () => {
  const [service, setService] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const token = getAccessToken() || "";
  const { data: servicesData, isLoading, error } = useGetServices(token);
  const { mutate: activateRankingCampaign, isPending: isActivating } = useRankingCampaign();
  const { data: creditsPackage } = useGetCreditPackage(token);
  const router = useRouter();

  const [availableServices, setAvailableServices] = useState<Service[]>([{
    _id: "",
    service_name: "All Services",
    location_ids: [],
    completed_tasks: 0,
    createdAt: ""
  }]);
  const [location, setLocation] = useState<string>("");
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<"monthly" | "annual">("monthly");
  const [noServicesAvailable, setNoServicesAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState("boost");
  const [rankingPackages, setRankingPackages] = useState<CreditPackage[]>([]);
  const [userCredits, setUserCredits] = useState<UserCredits>({ credits: 0 });
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);


  // Extract user credits from services data
  useEffect(() => {
    if (servicesData?.services?.professional) {
      const professional = servicesData.services.professional;
      setUserCredits({
        credits: professional.credit_balance || 0,
        credit_balance: professional.credit_balance
      });
    }
  }, [servicesData]);

  // Filter ranking packages from credits data
  useEffect(() => {
    if (creditsPackage?.success && creditsPackage?.data?.data) {
      const packages = creditsPackage.data.data as CreditPackage[];
      const rankingPkgs = packages.filter(
        (pkg) => pkg.category === "ranking" && pkg.isActive
      );
      setRankingPackages(rankingPkgs);

      // Set default selected package
      if (rankingPkgs.length > 0) {
        const defaultPkg = rankingPkgs.find(pkg =>
          selectedDuration === "monthly"
            ? (pkg.billingType === "monthly" || pkg.name.toLowerCase().includes("monthly"))
            : (pkg.billingType === "annual" || pkg.billingType === "yearly" || pkg.name.toLowerCase().includes("annual") || pkg.name.toLowerCase().includes("yearly"))
        ) || rankingPkgs[0];
        setSelectedPackage(defaultPkg);
      }
    }
  }, [creditsPackage, selectedDuration]);

  // Load services
  useEffect(() => {
    if (servicesData?.success && servicesData?.services?.services && servicesData.services.services.length > 0) {
      const services: Service[] = servicesData.services.services;
      setAvailableServices([
        {
          _id: "",
          service_name: "All Services",
          location_ids: [],
          completed_tasks: 0,
          createdAt: ""
        },
        ...services
      ]);
      setNoServicesAvailable(false);

      if (!service && services.length > 0) {
        const firstService = services[0];
        setService(firstService.service_name);
        setSelectedServiceId(firstService._id);
      }
    } else if (servicesData?.success && (!servicesData?.services?.services || servicesData.services.services.length === 0)) {
      setAvailableServices([{
        _id: "",
        service_name: "All Services",
        location_ids: [],
        completed_tasks: 0,
        createdAt: ""
      }]);
      setNoServicesAvailable(true);
      setService("");
      setSelectedServiceId("");
    }
  }, [servicesData, service]);

  // Load locations when service changes
  useEffect(() => {
    if (selectedServiceId && servicesData?.success && servicesData?.services?.services) {
      const selectedService = servicesData.services.services.find(
        (s: Service) => s._id === selectedServiceId
      );

      if (selectedService?.location_ids?.length > 0) {
        setLocations(selectedService.location_ids);

        if (!location && selectedService.location_ids.length > 0) {
          const firstLocation = selectedService.location_ids[0];
          setLocation(`${firstLocation.city}  ${firstLocation.state}  ${firstLocation.country}`);
        }
      } else {
        setLocations([]);
        setLocation("No locations specified");
      }
    } else {
      setLocations([]);
      setLocation("Select Location");
    }
  }, [selectedServiceId, servicesData, location]);

  const handleServiceChange = (serviceName: string) => {
    setService(serviceName);

    if (serviceName === "All Services") {
      setSelectedServiceId("");
      setLocations([]);
      setLocation("All Locations");
    } else {
      const selectedService = availableServices.find(s => s.service_name === serviceName);
      if (selectedService) {
        setSelectedServiceId(selectedService._id);
      }
    }
  };

  // Filter ranking packages by billing type (monthly/annual)
  const filteredPackages = useMemo(() => {
    return rankingPackages.filter(pkg => {
      if (selectedDuration === "monthly") {
        return pkg.billingType === "monthly" || pkg.name.toLowerCase().includes("monthly");
      } else {
        return pkg.billingType === "annual" ||
          pkg.billingType === "yearly" ||
          pkg.name.toLowerCase().includes("annual") ||
          pkg.name.toLowerCase().includes("yearly");
      }
    });
  }, [rankingPackages, selectedDuration]);

  // Check if user has enough credits for selected package
  const hasEnoughCredits = useMemo(() => {
    if (!selectedPackage) return false;
    return userCredits.credits >= selectedPackage.credits;
  }, [selectedPackage, userCredits.credits]);

  // Calculate missing credits
  const missingCredits = useMemo(() => {
    if (!selectedPackage) return 0;
    return Math.max(0, selectedPackage.credits - userCredits.credits);
  }, [selectedPackage, userCredits.credits]);

  const durationOptions = useMemo(() => [
    {
      id: "monthly",
      name: "Monthly Plans",
      description: "Flexible monthly boosting options",
    },
    {
      id: "annual",
      name: "Annual Plans",
      description: "Cost-effective yearly packages with better value",
    },
  ], []);

  const qualifiedLeadBenefits = useMemo(() => [
    {
      title: "Phone-Verified Leads",
      description: "Receive 2x higher ranking for customers with verified phone numbers",
      icon: <Phone className="w-4 h-4" />,
      color: "bg-green-100 dark:bg-green-900/30 text-[#0077B6] dark:text-[#0077B6]",
    },
    {
      title: "Email-Verified Leads",
      description: "Get priority placement for customers with confirmed email addresses",
      icon: <Mail className="w-4 h-4" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Double-Verified Priority",
      description: "Highest ranking boost for customers with both phone and email verified",
      icon: <BadgeCheck className="w-4 h-4" />,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Reduced Spam Leads",
      description: "Filter out unverified leads, focusing on high-intent customers",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ], []);

  const handleBoostRanking = () => {
    if (!selectedPackage) {
      toast.error("Please select a package first");
      return;
    }

    if (!hasEnoughCredits) {
      toast.error(`You need ${missingCredits} more credits to activate this package`);
      return;
    }

    if (!service || !selectedServiceId) {
      toast.error("Please select a service first");
      return;
    }

    // Get the professional ID from services data
    const professionalId = servicesData?.services?.professional?._id;
    if (!professionalId) {
      toast.error("Unable to identify professional profile");
      return;
    }

    // Get selected location ID if a specific location is selected
    let locationId = null;
    if (location !== "All Locations" && locations.length > 0) {
      const selectedLoc = locations.find(
        loc => `${loc.city}  ${loc.state}  ${loc.country}` === location
      );
      locationId = selectedLoc?._id || null;
    }

    // Prepare the data according to the backend schema
    const rankingCampaignData = {
      professional_id: professionalId,
      service_id: selectedServiceId,
      location_id: locationId, // Will be null if "All Locations" is selected
      package_id: selectedPackage._id,
      service_name: service,
      duration: selectedDuration, // "monthly" or "annual"
      credits_used: selectedPackage.credits,
      // start_date is automatically set by backend (default: Date.now)
      // end_date will be calculated by backend based on duration
    };

    // Call the API using the mutation hook
    activateRankingCampaign({
      data: rankingCampaignData,
      token: token
    }, {
      onSuccess: (response) => {
        // Success toast is already handled in the hook's onSuccess
        console.log("Ranking campaign activated successfully:", response);

        // You might want to refresh user credits or other data here
        // For example, refetch credits data:
        // queryClient.invalidateQueries(['userCredits']);
      },
      onError: (error) => {
        // Error is handled by the hook, but you can add additional handling here
        console.error("Failed to activate ranking campaign:", error);
      }
    });
  };

  const handlePurchaseCredits = () => {
    router.push("/credits");
  };

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <div className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-red-700 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Failed to load services</p>
          <p className="text-xs text-gray-700 dark:text-gray-700">{error.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:border-gray-600 dark:bg-gray-900 overflow-hidden relative">
      {/* Header */}
      <CardHeader className="rounded-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#0077B6]" />
            <CardTitle className="text-sm md:text-base font-semibold leading-tight">
              Search Visibility & Lead Quality Ranking
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#0077B6]/10 text-[#0077B6] dark:bg-[#0077B6]/20 dark:text-[#40A4FF]">
              <Star className="w-3 h-3 mr-1" />
              Verified Lead Priority
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="py-4 space-y-6">
        <Tabs defaultValue="boost" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="boost" className="flex items-center gap-2 text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Boost Ranking</span>
              <span className="xs:hidden">Boost</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2 text-xs sm:text-sm">
              <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline"> Manage</span>
              <span className="xs:hidden">Manage</span>
            </TabsTrigger>
          </TabsList>

          {/* Boost Ranking Tab */}
          <TabsContent value="boost" className="space-y-6">
            {/* Campaign Setup Section */}
            <div className="py-4 rounded-sm border-[#0077B6]/20 dark:border-[#0096C7]/30">
              <h3 className="text-sm  text-[#0077B6] mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Boost Your Search Ranking
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Configuration */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block  text-sm items-center gap-2">
                      Service to Boost
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Select which service you want to improve search ranking for</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select
                      value={service}
                      onValueChange={handleServiceChange}
                      disabled={noServicesAvailable}
                    >
                      <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue placeholder={noServicesAvailable ? "No services available" : "Select a service"}>
                          {noServicesAvailable ? "No services available" : service || "Select a service"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900">
                        {availableServices.map((serviceItem) => (
                          <SelectItem
                            key={serviceItem._id || "all"}
                            value={serviceItem.service_name}
                            className="text-sm"
                          >
                            {serviceItem.service_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block  text-sm items-center gap-2">
                      Target Location
                    </label>
                    <Select
                      value={location}
                      onValueChange={setLocation}
                      disabled={noServicesAvailable || !selectedServiceId || locations.length === 0}
                    >
                      <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed">
                        <SelectValue placeholder="Select a location">
                          {location || "Select a location"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-900 max-h-60">
                        {locations.length > 0 ? (
                          locations.map((loc) => (
                            <SelectItem
                              key={loc._id}
                              value={`${loc.city}  ${loc.state}  ${loc.country}`}
                              className="text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>{loc.city} {loc.state}  {loc.country}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="No locations available" disabled>
                            No locations available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Plan Duration
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {durationOptions.map((option) => {
                        const isSelected = selectedDuration === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedDuration(option.id as "monthly" | "annual")}
                            className={`
                              relative w-full rounded-sm border px-3 py-2 text-center transition-all
                              ${isSelected
                                ? "border-[#0077B6] bg-blue-50/60 dark:bg-blue-900/15 ring-1 ring-[#0077B6]/25"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                              }
                            `}
                          >
                            {isSelected && (
                              <CheckCircle className="absolute top-1 right-1 h-3 w-3 text-[#0077B6]" />
                            )}
                            <h4 className="text-xs  text-gray-900 dark:text-gray-100">
                              {option.name}
                            </h4>
                            <p className="text-[10px] text-gray-700 dark:text-gray-400 mt-1">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ranking Packages */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      Available Ranking Packages
                    </label>

                    <div className="space-y-2">
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg) => {
                          const isSelected = selectedPackage?._id === pkg._id;
                          const hasEnough = userCredits.credits >= pkg.credits;

                          return (
                            <button
                              key={pkg._id}
                              type="button"
                              onClick={() => setSelectedPackage(pkg)}
                              className={`
                                w-full rounded-sm border px-4 py-3 text-left transition-all
                                ${isSelected
                                  ? "border-[#0077B6] bg-blue-50/60 dark:bg-blue-900/15 ring-1 ring-[#0077B6]/25"
                                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                                }
                                ${!hasEnough ? "opacity-70 cursor-not-allowed" : ""}
                              `}
                              disabled={!hasEnough}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs  text-gray-900 dark:text-gray-100">
                                    {pkg.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    {pkg.billingType === "annual" || pkg.billingType === "yearly" ? (
                                      <Badge className="text-[10px]  bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-1.5 py-0.5">
                                        Best value
                                      </Badge>
                                    ) : null}
                                    {!hasEnough && (
                                      <Badge className="text-[10px]  bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-1.5 py-0.5">
                                        Need {(pkg.credits - userCredits.credits)} more credits
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <p className="text-[11px] leading-tight text-gray-700 dark:text-gray-400">
                                  {pkg.description || "Improve your search ranking with premium placement"}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                  <div>
                                    <p className="text-xs  text-gray-900 dark:text-gray-100">
                                      {pkg.credits} credits
                                    </p>
                                    <p className="text-[11px] text-gray-700 dark:text-gray-400 capitalize">
                                      {pkg.billingType.replace('_', ' ')}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    {pkg.discountPrice ? (
                                      <>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                          ${pkg.discountPrice}
                                        </p>
                                        <p className="text-[11px] line-through text-gray-700 dark:text-gray-400">
                                          ${pkg.price}
                                        </p>
                                      </>
                                    ) : (
                                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        ${pkg.price}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-700 dark:text-gray-400">
                          No ranking packages available for {selectedDuration} plans
                        </div>
                      )}
                    </div>

                    {/* Credit Status - Moved under Available Ranking Packages */}
                    <div className="mt-6 rounded-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-sm bg-[#0077B6]/10 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-[#0077B6]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Credit Overview
                            </p>
                            <p className="text-xs text-gray-700 dark:text-gray-400">
                              Balance & package requirements
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 py-6 space-y-6">

                        {/* Balance Metric */}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-700">
                              Available Credits
                            </p>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-3xl font-semibold text-[#0077B6]">
                                {userCredits.credits}
                              </span>
                              <span className="text-sm text-gray-700">credits</span>
                            </div>
                          </div>

                          {hasEnoughCredits && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              Ready to activate
                            </Badge>
                          )}
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                        {/* Package Info */}
                        {selectedPackage ? (
                          <div className="space-y-3">

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Selected Package</span>
                              <span className=" text-gray-900 dark:text-white">
                                {selectedPackage.name}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Required Credits</span>
                              <span
                                className={` ${hasEnoughCredits ? "text-[#0077B6]" : "text-red-600"
                                  }`}
                              >
                                {selectedPackage.credits}
                              </span>
                            </div>

                            {!hasEnoughCredits && (
                              <div className="rounded-sm  dark:bg-red-900/20 p-4 space-y-3">
                                <p className="text-sm  text-red-700 ">
                                  You are short of {missingCredits} credits
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full border-red-300 text-red-700"
                                  onClick={handlePurchaseCredits}
                                >
                                  <ShoppingCart className="  w-4 h-4 mr-2" />
                                  Purchase Credits
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-sm border border-dashed border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-700">
                            Select a package to view requirements
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column - Benefits & Action */}
                <div className="space-y-4">
                  {/* Verified Lead Benefits */}
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-sm border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm  mb-3 flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-[#0077B6]" />
                      Verified Lead Priority Ranking
                    </h4>
                    <div className="space-y-3">
                      {qualifiedLeadBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${benefit.color}`}>
                            {benefit.icon}
                          </div>
                          <div>
                            <p className=" text-sm text-gray-900 dark:text-white">{benefit.title}</p>
                            <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#0077B6] hover:bg-[#016ca6] dark:bg-[#40A4FF] dark:hover:bg-[#2B90D9] text-white text-sm py-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      onClick={handleBoostRanking}
                      disabled={
                        noServicesAvailable ||
                        !service ||
                        !location ||
                        location.includes("No locations") ||
                        !selectedPackage ||
                        !hasEnoughCredits ||
                        isActivating // Add this
                      }
                    >
                      {isActivating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          {selectedPackage
                            ? `Boost with ${selectedPackage.name}`
                            : 'Boost Search Ranking Now'
                          }
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </TabsContent>

          {/* Lead Quality Tab */}
          <TabsContent value="manage" className="space-y-6">
              <RankingactiveList professionalId={servicesData?.services?.professional?._id || ""} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export default GetMoreLeads;