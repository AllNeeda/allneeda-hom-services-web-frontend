"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface PricingStepProps {
  // eslint-disable-next-line
  onNext: (data: any) => void
  onBack: () => void
  formData: any
}

// Strong typing for pricing state
type FeatureKey =
  | "functionalWebsite"
  | "contentUpload"
  | "designCustomization"
  | "responsiveDesign"
  | "sourceCode"
  | "pluginsInstallation"
  | "ecommerceFunctionality"
  | "numberOfProducts"
  | "paymentIntegration"
  | "optOut"
  | "autoresponderIntegration"
  | "speedOptimization"
  | "hostingSetup"
  | "socialMediaIcons"

type Features = Record<FeatureKey, boolean>

interface Package {
  name: string
  description: string
  price: number
  deliveryTime: string
  revisions: string
  features: Features
}

type PackageKey = "basic" | "standard" | "premium"

interface ExtraService {
  name: string
  description: string
  price: number
  deliveryTime: string
  selected: boolean
}

interface PricingState {
  offerPackages: boolean
  packages: Record<PackageKey, Package>
  extraServices: ExtraService[]
}

export function PricingStep({ onNext }: PricingStepProps) {
  const [pricing, setPricing] = useState<PricingState>({
    offerPackages: true,
    packages: {
      basic: {
        name: "Basic",
        description: "I will create a simple website with basic features",
        price: 50,
        deliveryTime: "3 DAYS DELIVERY",
        revisions: "2 REVISIONS",
        features: {
          functionalWebsite: true,
          contentUpload: false,
          designCustomization: false,
          responsiveDesign: true,
          sourceCode: false,
          pluginsInstallation: false,
          ecommerceFunctionality: false,
          numberOfProducts: false,
          paymentIntegration: false,
          optOut: false,
          autoresponderIntegration: false,
          speedOptimization: false,
          hostingSetup: false,
          socialMediaIcons: false,
        },
      },
      standard: {
        name: "Standard",
        description: "Full Stack Application with advanced features",
        price: 150,
        deliveryTime: "7 DAYS DELIVERY",
        revisions: "5 REVISIONS",
        features: {
          functionalWebsite: true,
          contentUpload: true,
          designCustomization: true,
          responsiveDesign: true,
          sourceCode: true,
          pluginsInstallation: true,
          ecommerceFunctionality: false,
          numberOfProducts: false,
          paymentIntegration: true,
          optOut: false,
          autoresponderIntegration: true,
          speedOptimization: true,
          hostingSetup: false,
          socialMediaIcons: true,
        },
      },
      premium: {
        name: "Premium",
        description: "Complete Solution with premium features",
        price: 300,
        deliveryTime: "14 DAYS DELIVERY",
        revisions: "UNLIMITED REVISIONS",
        features: {
          functionalWebsite: true,
          contentUpload: true,
          designCustomization: true,
          responsiveDesign: true,
          sourceCode: true,
          pluginsInstallation: true,
          ecommerceFunctionality: true,
          numberOfProducts: true,
          paymentIntegration: true,
          optOut: false,
          autoresponderIntegration: true,
          speedOptimization: true,
          hostingSetup: true,
          socialMediaIcons: true,
        },
      },
    },
    extraServices: [
      {
        name: "Extra fast delivery",
        description: "Get your order delivered faster",
        price: 25,
        deliveryTime: "1 DAY",
        selected: false,
      },
      {
        name: "Additional page",
        description: "Add one more page to your website",
        price: 15,
        deliveryTime: "1 DAY",
        selected: false,
      },
      {
        name: "Additional revision",
        description: "Get additional revisions for your project",
        price: 10,
        deliveryTime: "1 DAY",
        selected: false,
      },
      {
        name: "Additional page installation",
        description: "Professional page setup and configuration",
        price: 20,
        deliveryTime: "2 DAYS",
        selected: false,
      },
      {
        name: "E-commerce functionality",
        description: "Add shopping cart and payment processing",
        price: 50,
        deliveryTime: "3 DAYS",
        selected: false,
      },
      {
        name: "Additional product",
        description: "Add more products to your store",
        price: 5,
        deliveryTime: "1 DAY",
        selected: false,
      },
      {
        name: "Payment integration",
        description: "Integrate payment gateways",
        price: 30,
        deliveryTime: "2 DAYS",
        selected: false,
      },
      {
        name: "Autoresponder integration",
        description: "Connect email marketing tools",
        price: 25,
        deliveryTime: "1 DAY",
        selected: false,
      },
      {
        name: "Hosting setup",
        description: "Professional hosting configuration",
        price: 40,
        deliveryTime: "3 DAYS",
        selected: false,
      },
      {
        name: "Additional Social Media",
        description: "Add more social media integrations",
        price: 15,
        deliveryTime: "1 DAY",
        selected: false,
      },
    ],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(pricing)
  }

  const toggleFeature = (packageType: PackageKey, feature: FeatureKey) => {
    setPricing((prev) => {
      const key: PackageKey = packageType
      const currentPackage = prev.packages[key]
      const currentFeatures = currentPackage.features
      const updatedFeatures: Features = {
        ...currentFeatures,
        [feature]: !currentFeatures[feature],
      }
      const updatedPackage: Package = {
        ...currentPackage,
        features: updatedFeatures,
      }
      return {
        ...prev,
        packages: {
          ...prev.packages,
          [key]: updatedPackage,
        },
      }
    })
  }

  const featureLabels: Record<FeatureKey, string> = {
    functionalWebsite: "Functional website",
    contentUpload: "Content upload",
    designCustomization: "Design customization",
    responsiveDesign: "Responsive design",
    sourceCode: "Source code",
    pluginsInstallation: "Plugins/Extensions installation",
    ecommerceFunctionality: "E-commerce functionality",
    numberOfProducts: "Number of products",
    paymentIntegration: "Payment integration",
    optOut: "Opt-out",
    autoresponderIntegration: "Autoresponder integration",
    speedOptimization: "Speed optimization",
    hostingSetup: "Hosting setup",
    socialMediaIcons: "Social media icons",
  }

  const packageOrder: PackageKey[] = ["basic", "standard", "premium"]

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full ">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Scope & Pricing Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Scope & Pricing</h2>
                <div className="flex items-center gap-2">
                  <Label htmlFor="offer-packages">Offer packages</Label>
                  <Switch
                    id="offer-packages"
                    checked={pricing.offerPackages}
                    onCheckedChange={(checked) => setPricing((prev) => ({ ...prev, offerPackages: checked }))}
                  />
                </div>
              </div>

              {/* Packages - Mobile cards (no horizontal scroll) */}
              <div className="space-y-4 sm:hidden">
                {packageOrder.map((key) => (
                  <Card key={key} className="border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="uppercase text-sm">{key}</span>
                        <span className="font-semibold">${pricing.packages[key].price}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={pricing.packages[key].description}
                          onChange={(e) =>
                            setPricing((prev) => ({
                              ...prev,
                              packages: {
                                ...prev.packages,
                                [key]: { ...prev.packages[key], description: e.target.value },
                              },
                            }))
                          }
                          className="min-h-[80px] resize-none"
                          placeholder={`Describe your ${key} package...`}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <Label>Delivery time</Label>
                          <Select value={pricing.packages[key].deliveryTime}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 DAY DELIVERY">1 Day</SelectItem>
                              <SelectItem value="3 DAYS DELIVERY">3 Days</SelectItem>
                              <SelectItem value="7 DAYS DELIVERY">7 Days</SelectItem>
                              <SelectItem value="14 DAYS DELIVERY">14 Days</SelectItem>
                              <SelectItem value="21 DAYS DELIVERY">21 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Revisions</Label>
                          <Select value={pricing.packages[key].revisions}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 REVISION">1</SelectItem>
                              <SelectItem value="2 REVISIONS">2</SelectItem>
                              <SelectItem value="3 REVISIONS">3</SelectItem>
                              <SelectItem value="5 REVISIONS">5</SelectItem>
                              <SelectItem value="UNLIMITED REVISIONS">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {(Object.keys(pricing.packages[key].features) as FeatureKey[]).map((feature) => (
                            <label key={feature} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                checked={pricing.packages[key].features[feature]}
                                onCheckedChange={() => toggleFeature(key, feature)}
                              />
                              <span>{featureLabels[feature]}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Total Price</Label>
                        <div className="flex items-center gap-2">
                          <span>$</span>
                          <Input
                            type="number"
                            value={pricing.packages[key].price}
                            onChange={(e) =>
                              setPricing((prev) => ({
                                ...prev,
                                packages: {
                                  ...prev.packages,
                                  [key]: { ...prev.packages[key], price: Number.parseInt(e.target.value || "0") },
                                },
                              }))
                            }
                            className="w-28 text-center"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Packages Table - Desktop/Tablet (visible from sm and up) */}
              <div className="hidden sm:block">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100">Packages</th>
                        <th className="text-center p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100 min-w-48">
                          <div>
                            <div className="font-bold">BASIC</div>
                            <div className="text-[11px] sm:text-sm font-normal text-gray-600 dark:text-gray-400">Content / Ad Setup</div>
                          </div>
                        </th>
                        <th className="text-center p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100 min-w-48">
                          <div>
                            <div className="font-bold">STANDARD</div>
                            <div className="text-[11px] sm:text-sm font-normal text-gray-600 dark:text-gray-400">
                              Full Stack Application
                            </div>
                          </div>
                        </th>
                        <th className="text-center p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100 min-w-48">
                          <div>
                            <div className="font-bold">PREMIUM</div>
                            <div className="text-[11px] sm:text-sm font-normal text-gray-600 dark:text-gray-400">Complete Solution</div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100">Description</td>
                        <td className="p-2 sm:p-4">
                          <Textarea
                            value={pricing.packages.basic.description}
                            onChange={(e) =>
                              setPricing((prev) => ({
                                ...prev,
                                packages: {
                                  ...prev.packages,
                                  basic: { ...prev.packages.basic, description: e.target.value },
                                },
                              }))
                            }
                            className="min-h-[80px] resize-none"
                            placeholder="Describe your basic package..."
                          />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Textarea
                            value={pricing.packages.standard.description}
                            onChange={(e) =>
                              setPricing((prev) => ({
                                ...prev,
                                packages: {
                                  ...prev.packages,
                                  standard: { ...prev.packages.standard, description: e.target.value },
                                },
                              }))
                            }
                            className="min-h-[80px] resize-none"
                            placeholder="Describe your standard package..."
                          />
                        </td>
                        <td className="p-2 sm:p-4">
                          <Textarea
                            value={pricing.packages.premium.description}
                            onChange={(e) =>
                              setPricing((prev) => ({
                                ...prev,
                                packages: {
                                  ...prev.packages,
                                  premium: { ...prev.packages.premium, description: e.target.value },
                                },
                              }))
                            }
                            className="min-h-[80px] resize-none"
                            placeholder="Describe your premium package..."
                          />
                        </td>
                      </tr>

                      {/* Delivery Time */}
                      <tr>
                        <td className="p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100">Delivery time</td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.basic.deliveryTime}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 DAY DELIVERY">1 Day</SelectItem>
                              <SelectItem value="3 DAYS DELIVERY">3 Days</SelectItem>
                              <SelectItem value="7 DAYS DELIVERY">7 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.standard.deliveryTime}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 DAYS DELIVERY">3 Days</SelectItem>
                              <SelectItem value="7 DAYS DELIVERY">7 Days</SelectItem>
                              <SelectItem value="14 DAYS DELIVERY">14 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.premium.deliveryTime}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7 DAYS DELIVERY">7 Days</SelectItem>
                              <SelectItem value="14 DAYS DELIVERY">14 Days</SelectItem>
                              <SelectItem value="21 DAYS DELIVERY">21 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>

                      {/* Revisions */}
                      <tr>
                        <td className="p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100">Number of revisions</td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.basic.revisions}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 REVISION">1</SelectItem>
                              <SelectItem value="2 REVISIONS">2</SelectItem>
                              <SelectItem value="3 REVISIONS">3</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.standard.revisions}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3 REVISIONS">3</SelectItem>
                              <SelectItem value="5 REVISIONS">5</SelectItem>
                              <SelectItem value="UNLIMITED REVISIONS">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <Select value={pricing.packages.premium.revisions}>
                            <SelectTrigger className="w-full max-w-[160px] mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5 REVISIONS">5</SelectItem>
                              <SelectItem value="UNLIMITED REVISIONS">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>

                      {(Object.keys(pricing.packages.basic.features) as FeatureKey[]).map((feature) => (
                        <tr key={feature}>
                          <td className="p-2 sm:p-4 font-medium text-gray-900 dark:text-gray-100">
                            {featureLabels[feature] || feature}
                          </td>
                          <td className="p-2 sm:p-4 text-center">
                            <Checkbox
                              checked={pricing.packages.basic.features[feature]}
                              onCheckedChange={() => toggleFeature("basic", feature)}
                            />
                          </td>
                          <td className="p-2 sm:p-4 text-center">
                            <Checkbox
                              checked={pricing.packages.standard.features[feature]}
                              onCheckedChange={() => toggleFeature("standard", feature)}
                            />
                          </td>
                          <td className="p-2 sm:p-4 text-center">
                            <Checkbox
                              checked={pricing.packages.premium.features[feature]}
                              onCheckedChange={() => toggleFeature("premium", feature)}
                            />
                          </td>
                        </tr>
                      ))}

                      {/* Total Price */}
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td className="p-2 sm:p-4 font-bold text-gray-900 dark:text-gray-100">Total Price</td>
                        <td className="p-2 sm:p-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">$</span>
                            <Input
                              type="number"
                              value={pricing.packages.basic.price}
                              onChange={(e) =>
                                setPricing((prev) => ({
                                  ...prev,
                                  packages: {
                                    ...prev.packages,
                                    basic: { ...prev.packages.basic, price: Number.parseInt(e.target.value || "0") },
                                  },
                                }))
                              }
                              className="w-24 sm:w-20 text-center"
                            />
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">$</span>
                            <Input
                              type="number"
                              value={pricing.packages.standard.price}
                              onChange={(e) =>
                                setPricing((prev) => ({
                                  ...prev,
                                  packages: {
                                    ...prev.packages,
                                    standard: { ...prev.packages.standard, price: Number.parseInt(e.target.value || "0") },
                                  },
                                }))
                              }
                              className="w-24 sm:w-20 text-center"
                            />
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className="mr-1">$</span>
                            <Input
                              type="number"
                              value={pricing.packages.premium.price}
                              onChange={(e) =>
                                setPricing((prev) => ({
                                  ...prev,
                                  packages: {
                                    ...prev.packages,
                                    premium: { ...prev.packages.premium, price: Number.parseInt(e.target.value || "0") },
                                  },
                                }))
                              }
                              className="w-24 sm:w-20 text-center"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold">Add extra services</h3>
              <div className="space-y-4 dark:bg-gray-800 px-4 py-6 sm:py-10 rounded-lg">
                <div className="space-y-3">
                  {pricing.extraServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={service.selected}
                          onCheckedChange={(checked) => {
                            const newServices = [...pricing.extraServices]
                            newServices[index].selected = !!checked
                            setPricing((prev) => ({ ...prev, extraServices: newServices }))
                          }}
                        />
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span>Go up extra</span>
                        <Input
                          type="number"
                          value={service.price}
                          onChange={(e) => {
                            const newServices = [...pricing.extraServices]
                            newServices[index].price = Number.parseInt(e.target.value || "0")
                            setPricing((prev) => ({ ...prev, extraServices: newServices }))
                          }}
                          className="w-20 text-center"
                        />
                        <span>and additional</span>
                        <Select defaultValue={service.deliveryTime}>
                          <SelectTrigger className="w-28 sm:w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 DAY">1 Day</SelectItem>
                            <SelectItem value="2 DAYS">2 Days</SelectItem>
                            <SelectItem value="3 DAYS">3 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8">
                  Save & Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
