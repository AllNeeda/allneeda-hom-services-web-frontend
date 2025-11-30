// src/components/marketing-hub/GetMoreLeads.tsx
import React, { useState } from "react";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TargetIcon,
  MapPin,
  Award,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GetMoreLeads: React.FC = () => {
  const [service, setService] = useState("Home Cleaning");
  const [location, setLocation] = useState("New York");
  const [showSubscriptionModal, setShowSubscriptionModal] =
    useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const serviceOptions = [
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

  const subscriptionPlans = [
    {
      id: "Weekly",
      name: "Weekly",
      price: "9 Credits",
      placement: "Standard",
      features: [
        "Standard placement in search",
        "Basic lead notifications",
        "Email support",
      ],
    },
    {
      id: "Monthly",
      name: "Monthly",
      price: "14 Credits",
      placement: "Priority",
      recommended: true,
      features: [
        "TOP Search Placement",
        "SMS notifications",
        "Performance analytics",
      ],
    },
    {
      id: "Annual",
      name: "Annual",
      price: "29 Credits",
      features: [
        "Maximum Visibility",
        "SMS notifications",
        "Advanced analytics",
      ],
    },
  ];

  const estimatedLeads = 85;
  const estimatedCostPerLead = 23;

  return (
    <>
      <div className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900  bg-gray-50 overflow-hidden relative">
        {/* Header */}
        <CardHeader className="rounded-t-sm">
          <CardTitle className="text-sm md:text-base font-semibold leading-tight flex items-center gap-2">
            <TargetIcon className="w-4 h-4" />
            Lead Generation Campaign
          </CardTitle>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Get featured at the top of search results and receive
            qualified leads directly.
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-4">
              {/* Service */}
              <div className="space-y-2">
                <label className="block font-medium text-sm">
                  Service Type
                </label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0077B6]">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    {serviceOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-sm"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block font-medium text-sm">
                  Target Location
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-[#0077B6] bg-white dark:bg-gray-800">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New York"
                    className="p-0 border-0 focus-visible:ring-0 text-sm bg-transparent text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Search Placement */}
              <div className="bg-gradient-to-r from-[#0077B6]/10 to-[#0096C7]/10 p-4 rounded-md border border-[#0077B6]/20 dark:border-[#0096C7]/30">
                <Button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="w-full bg-[#0077B6] hover:bg-[#0066A1] text-normal text-white text-sm py-2 rounded-md"
                >
                  Select Subscription Plan
                </Button>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Estimated Leads
                  </p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {estimatedLeads}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cost Per Lead
                  </p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    ${estimatedCostPerLead}
                  </p>
                </div>
              </div>

              {/* Visibility */}
              <div className=" p-4">
                <h3 className="text-sm font-medium text-[#0077B6] mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibility Metrics
                </h3>
                <div className="space-y-6">
                  <MetricBar
                    label="Search Impression Share"
                    value="78%"
                    width="78%"
                  />
                  <MetricBar
                    label="Top Placement Rate"
                    value="92%"
                    width="92%"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="border-gray-300 text-normal dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Save Draft
            </Button>
            <Button className="bg-[#0077B6] text-normal hover:bg-[#0066A1] rounded-md text-white text-sm px-4 py-2 shadow-none">
              Launch Campaign
            </Button>
          </div>
        </CardContent>
      </div>

      {/* Subscription Dialog */}
      <Dialog
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      >
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200">
          <div className="bg-[#0077B6] text-white p-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Upgrade Your Search Placement
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm">
                Get more visibility and leads with premium search
                placement options
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-5 pb-5 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {subscriptionPlans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  selectedPlan={selectedPlan}
                  setSelectedPlan={setSelectedPlan}
                />
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowSubscriptionModal(false)}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button className="bg-[#0077B6] rounded-md hover:bg-[#0066A1] text-white text-sm px-4 py-2 shadow-none">
                Confirm Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Reusable Metric Bar
const MetricBar = ({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) => (
  <div>
    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
      <span>{label}</span>
      <span className="font-semibold text-[#0077B6]">{value}</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
      <div
        className="bg-[#0077B6] h-1 rounded-full"
        style={{ width }}
      ></div>
    </div>
  </div>
);

// Subscription Card
const SubscriptionCard = ({
  plan,
  selectedPlan,
  setSelectedPlan,
}: {
  plan: any;
  selectedPlan: string;
  /* eslint-disable no-unused-vars */
  setSelectedPlan: (id: string) => void;
  /* eslint-enable no-unused-vars */

}) => {
  const isSelected = selectedPlan === plan.id;
  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-all cursor-pointer relative bg-white dark:bg-gray-900",
        isSelected
          ? "border-1 border-[#0077B6]"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
      )}
      onClick={() => setSelectedPlan(plan.id)}
    >
      {plan.recommended && (
        <div className="absolute -top-2 left-0 right-0 mx-auto w-fit px-2 py-0.5 bg-[#0077B6] text-white text-[10px] font-medium rounded-full">
          RECOMMENDED
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
          {plan.name}
        </h3>
        {isSelected && (
          <div className="h-4 w-4 rounded-full bg-[#0077B6] flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="mb-3">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {plan.price}
        </span>
        {plan.placement && (
          <div className="mt-2 flex items-center text-[#0077B6] text-sm font-medium">
            <Award className="h-3 w-3 mr-1" />
            {plan.placement} Placement
          </div>
        )}
      </div>
      <ul className="space-y-1.5">
        {plan.features.map((feature: string, idx: number) => (
          <li
            key={idx}
            className="flex items-start text-xs text-gray-600 dark:text-gray-300"
          >
            <Check className="h-3 w-3 text-[#0077B6] mr-1.5 mt-0.5 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className={cn(
          "w-full mt-4 text-sm py-2 rounded-md",
          isSelected
            ? "bg-[#0077B6] hover:bg-[#0066A1] text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
      >
        {isSelected ? "Selected" : "Select Plan"}
      </Button>
    </div>
  );
};

// Check Icon
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default GetMoreLeads;
