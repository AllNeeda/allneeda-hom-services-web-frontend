// src/components/marketing-hub/ProfileVisibility.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  UsersIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ClockIcon,
  X,
  CrownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileVisibility: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [subscriptionPlan, setSubscriptionPlan] = useState("starter");
  const [billingCycle, setBillingCycle] = useState("weekly");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [visibilitySettings, setVisibilitySettings] = useState({
    totalHire: { enabled: true, baseCost: 5 },
    lastHire: { enabled: true, baseCost: 3 },
    lastSeen: { enabled: false, baseCost: 1 },
    lastActive: { enabled: false, baseCost: 2 },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate costs based on billing cycle
  const calculateCost = (baseCost: number) => {
    switch (billingCycle) {
      case "monthly":
        return Math.round(baseCost * 0.9); // 10% discount
      case "yearly":
        return Math.round(baseCost * 0.8); // 20% discount
      default:
        return baseCost; // weekly (no discount)
    }
  };

  const handleToggle = (setting: keyof typeof visibilitySettings) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [setting]: { ...prev[setting], enabled: !prev[setting].enabled }
    }));
  };

  const applyToAll = (value: boolean) => {
    const updatedSettings = { ...visibilitySettings };
    Object.keys(updatedSettings).forEach(key => {
      updatedSettings[key as keyof typeof visibilitySettings].enabled = value;
    });
    setVisibilitySettings(updatedSettings);
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    return Object.values(visibilitySettings)
      .filter(setting => setting.enabled)
      .reduce((total, setting) => total + calculateCost(setting.baseCost), 0);
  };

  const totalCost = calculateTotalCost();

  const subscriptionPlans = [
    {
      id: "Weekly",
      name: "Weekly",
      basePrice: 4,
      features: ["Basic profile visibility", "Up to 2 options shown", "Standard placement"]
    },
    {
      id: "Monthly",
      name: "Monthly",
      basePrice: 14,
      recommended: true,
      features: ["Enhanced profile visibility", "All options shown", "Priority placement", "Performance analytics"]
    },
    {
      id: "Annual",
      name: "Annual",
      basePrice: 29,
      features: ["Maximum profile visibility", "All features unlocked", "Top placement", "Advanced analytics", "Priority support"]
    }
  ];

  // Calculate plan price based on billing cycle
  const calculatePlanPrice = (basePrice: number) => {
    switch (billingCycle) {
      case "monthly":
        return Math.round(basePrice * 0.9); // 10% discount
      case "yearly":
        return Math.round(basePrice * 0.8); // 20% discount
      default:
        return basePrice; // weekly (no discount)
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
        <Card className="shadow-none border-none rounded-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 bg-gray-50 overflow-hidden relative">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2 ">
              <EyeIcon className="w-6 h-6 text-[#0077B6]" />
              Profile Visibility
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Control what information is visible to potential clients
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 bg-gray-100 dark:bg-gray-900 p-1">
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Visibility Settings
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
              >
                Profile Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="space-y-1">
                  <h3 className="font-medium dark:text-white">Visibility Controls</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Customize what others see when they visit your profile
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => applyToAll(true)} className="dark:border-gray-700 dark:text-gray-300">
                    Show All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyToAll(false)} className="dark:border-gray-700 dark:text-gray-300">
                    Hide All
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {Object.entries(visibilitySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-900 dark:bg-gray-900/50 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-full ${value.enabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {value.enabled ? (
                          <EyeIcon className={`h-4 w-4 ${value.enabled ? 'text-[#0077B6] dark:text-blue-400' : 'text-gray-500'}`} />
                        ) : (
                          <EyeOffIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={key} className="capitalize flex items-center gap-2 dark:text-gray-300">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                          <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {calculateCost(value.baseCost)} credits
                            {billingCycle !== "weekly" && (
                              <span className="ml-1 line-through text-gray-400 dark:text-gray-500">{value.baseCost}</span>
                            )}
                          </Badge>
                        </Label>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {key === 'totalHire' && 'Show your total number of hires'}
                          {key === 'lastHire' && 'Display information about your most recent hire'}
                          {key === 'lastSeen' && 'Show when you were last seen online'}
                          {key === 'lastActive' && 'Display when you were last active on the platform'}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value.enabled}
                        onCheckedChange={() => handleToggle(key as keyof typeof visibilitySettings)}
                        className="dark:data-[state=checked]:bg-[#0077B6]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0077B6]/5 dark:bg-blue-900/20 p-4 rounded-lg border border-[#0077B6]/10 dark:border-bg-[#0077B6][#0077B6]/30">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                  <h3 className="text-sm font-medium text-[#0077B6] dark:text-blue-400 flex items-center gap-2">
                    <CrownIcon className="h-4 w-4" />
                    Subscription Plan
                  </h3>

                </div>
                <p className="text-xs text-muted-foreground dark:text-blue-300/80 mb-3">
                  {billingCycle === "monthly" && "10% discount applied to Monthly billing"}
                  {billingCycle === "yearly" && "20% discount applied to Yearly billing"}
                  {billingCycle === "weekly" && "Standard Weekly Pricing"}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={cn(
                        "flex-1 min-w-[120px] border rounded-md p-3 cursor-pointer transition-all",
                        subscriptionPlan === plan.id
                          ? "border-[#0077B6] dark:border-[#0077B6] bg-[#0077B6]/5 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      onClick={() => setSubscriptionPlan(plan.id)}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium dark:text-gray-300">{plan.name}</span>
                        {subscriptionPlan === plan.id && (
                          <CheckCircleIcon className="h-4 w-4 text-[#0077B6] dark:text-[#0077B6]" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                        {calculatePlanPrice(plan.basePrice)} credits/{billingCycle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </TabsContent>

            <TabsContent value="preview">
              <Card className="dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center relative">
                      <UsersIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                      {visibilitySettings.lastSeen.enabled && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">John Profile</h3>
                    <p className="text-muted-foreground dark:text-gray-400">Professional Service Provider</p>

                    {visibilitySettings.lastActive.enabled && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-500">
                        <ClockIcon className="w-3 h-3" /> Active today
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {visibilitySettings.totalHire.enabled && (
                      <div className="space-y-2">
                        <h4 className="font-medium dark:text-gray-300">Total Hires</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">24 successful hires</p>
                      </div>
                    )}

                    {visibilitySettings.lastHire.enabled && (
                      <div className="space-y-2">
                        <h4 className="font-medium dark:text-gray-300">Last Hire</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">2 weeks ago</p>
                      </div>
                    )}

                    {!visibilitySettings.totalHire.enabled &&
                      !visibilitySettings.lastHire.enabled &&
                      !visibilitySettings.lastSeen.enabled &&
                      !visibilitySettings.lastActive.enabled && (
                        <div className="text-center py-8 text-muted-foreground dark:text-gray-500">
                          <EyeOffIcon className="w-12 h-12 mx-auto mb-2" />
                          <p>Your profile information is currently hidden from viewers</p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4 border-t dark:border-gray-900">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Selected: {subscriptionPlans.find(p => p.id === subscriptionPlan)?.name} Plan</p>
              <p className="font-medium dark:text-white">
                {calculatePlanPrice(subscriptionPlans.find(p => p.id === subscriptionPlan)?.basePrice || 0)} credits
                <span className="text-sm font-normal dark:text-gray-400">/{billingCycle}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full lg:w-auto">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Total Cost: <span className="font-medium text-[#0077B6] dark:text-blue-400">{totalCost} credits/{billingCycle}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="dark:border-gray-700 rounded-sm dark:text-gray-300">Cancel</Button>
                <Button 
                  className="bg-[#0077B6] hover:bg-[#0066A1] rounded-sm dark:bg-[#0077B6] dark:hover:bg-[#0077B6][#0077B6]"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" /> Save & Subscribe
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <div className="bg-[#0077B6] dark:bg-blue-900 text-white p-4">
            <DialogHeader>
              <DialogTitle className="text-white text-lg font-semibold">Choose a Subscription Plan</DialogTitle>
              <DialogDescription className="text-blue-100 dark:text-blue-200 text-sm">
                Select the plan that best fits your business needs. You can change or cancel anytime.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-200 dark:text-blue-300 text-sm">Billing Cycle:</span>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger className="w-[100px] h-7 text-xs bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Billing" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                  <SelectItem value="weekly" className="dark:focus:bg-gray-700 dark:text-gray-300">Weekly</SelectItem>
                  <SelectItem value="monthly" className="dark:focus:bg-gray-700 dark:text-gray-300">Monthly</SelectItem>
                  <SelectItem value="yearly" className="dark:focus:bg-gray-700 dark:text-gray-300">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-300 focus:outline-none rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-5 pb-5 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {subscriptionPlans.map((plan) => {
                const planPrice = calculatePlanPrice(plan.basePrice);
                const originalPrice = plan.basePrice;

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "rounded-lg border p-4 transition-all cursor-pointer relative dark:border-gray-700",
                      subscriptionPlan === plan.id
                        ? "border-2 border-[#0077B6] dark:border-[#0077B6] bg-[#0077B6]/5 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    onClick={() => setSubscriptionPlan(plan.id)}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-2 left-0 right-0 mx-auto w-fit px-2 py-0.5 bg-[#0077B6] dark:bg-[#0077B6] text-white text-xs font-medium rounded-full">
                        RECOMMENDED
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base">{plan.name}</h3>
                      {subscriptionPlan === plan.id && (
                        <div className="h-4 w-4 rounded-full bg-[#0077B6] dark:bg-[#0077B6] flex items-center justify-center">
                          <CheckIcon className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{planPrice} credits</span>
                        <span className="text-sm text-muted-foreground dark:text-gray-400 ml-1">/{billingCycle}</span>
                      </div>
                      {billingCycle !== "weekly" && (
                        <div className="text-xs text-muted-foreground dark:text-gray-500 line-through">
                          {originalPrice} credits
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckIcon className="h-4 w-4 text-[#0077B6] dark:text-[#0077B6] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "w-full mt-4 text-sm py-2",
                        subscriptionPlan === plan.id
                          ? "bg-[#0077B6] hover:bg-[#0066A1] dark:bg-[#0077B6] dark:hover:bg-[#0077B6][#0077B6]"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      {subscriptionPlan === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubscriptionModal(false)}
                className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#0077B6] hover:bg-[#0066A1] dark:bg-[#0077B6] dark:hover:bg-[#0077B6] text-white text-sm px-4 py-2 shadow-none order-1 sm:order-2"
                onClick={() => setShowSubscriptionModal(false)}
              >
                Confirm Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default ProfileVisibility;