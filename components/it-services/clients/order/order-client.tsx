"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  FileText,
  ChevronDown,
  Package,
  Eye,
  User,
  ChevronRight,
  MessageSquare,
  Globe,
  BadgeQuestionMark,
} from "lucide-react";

import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import OrderMessages from "../../sections/order-detail/order-workspace/order-messages";
import OrderDeliverables from "../../sections/order-detail/order-workspace/order-deliverables";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// eslint-disable-next-line
export default function OrderClient({ params }: { params: { id: string } }) {
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isServiceInfoOpen, setIsServiceInfoOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(true);

  const requirements = [
    {
      id: 1,
      question: "If you're ordering for a business, what's your industry?",
      answer: "Not answered",
      optional: true
    },
    {
      id: 2,
      question: "Is this order part of a bigger project you're working on?",
      answer: "Not answered",
      optional: true
    },
    {
      id: 3,
      question: "Do you have a web hosting provider for this project?",
      answer: "Not answered",
      optional: true
    },
    {
      id: 4,
      question: "If you're ordering for a business, what's your industry?",
      answer: "My industry name is Servicyee",
      optional: false
    },
    {
      id: 5,
      question: "Hi! I need following information to start your work 1.Company Name 2.Tag line 3.Color scheme 4.The thing that you want in design 5.Any concept if you have 6.Detailed information 7.Attachment file I am very thankful to you for your order",
      answer: "1. Servicyee\n2. Servicyee\n3. light blue",
      optional: false
    }
  ];

  const orderDetails = {
    items: [
      {
        name: "make modern creative minimalist business logo design",
        description: "Logo Design",
        features: [
          "2 concepts included",
          "Logo transparency",
          "Vector file",
          "Printable file",
          "Unlimited revisions"
        ],
        quantity: 1,
        duration: "1 day",
        price: "$5"
      }
    ],
    subtotal: "$5",
    serviceFee: "$3.78",
    total: "$8.78"
  };

  const upgrades = [
    { name: "Include 3D mockup", quantity: 1, duration: "1 day", price: "$5" },
    { name: "Include source file", quantity: 1, duration: "-", price: "$5" },
    { name: "Stationery designs", quantity: 1, duration: "1 day", price: "$10" },
    { name: "Include social media kit", quantity: 1, duration: "1 day", price: "$10" },
    { name: "Additional logo", quantity: 1, duration: "1 day", price: "$10" }
  ];
  const orderData1 = {
    id: "#ORD-2024-001",
    title: "Modern Logo Design & Brand Identity Package",
    client: "Sarah Johnson",
    freelancer: "Alex Chen",
    status: "in_progress",
    progress: 65,
    deadline: "Dec 25, 2024",
    timeRemaining: "3 days",
    totalAmount: "$450",
    currentPhase: "Design Review"
  };


  // Service tracker steps
  const serviceSteps = [
    { key: "delivery", label: "Order Delivery" },
    { key: "completed", label: "Order Completed" }
  ];
  const currentStepIndex = orderData1.status === "completed" ? 1 : 0;



  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* services tracker section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {orderData1.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Client: {orderData1.client}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {orderData1.id}
                </span>
                <Badge className={getStatusColor(orderData1.status)}>
                  {orderData1.currentPhase}
                </Badge>
              </div>    
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <ChevronDown className="w-4 h-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="py-4 cursor-pointer"
                    onClick={() => {
                      // Replace with your Resolution Center navigation logic
                      window.location.href = "/resolution-center";
                    }}
                  >
                    <Globe className="w-4 h-4"/>
                    Resolution Center
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="py-4 cursor-pointer"
                    onClick={() => {
                      // Replace with your FAQs navigation logic
                      window.location.href = "/faqs";
                    }}
                  >
                    <BadgeQuestionMark className="w-4 h-4"/>
                    FAQs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Two-step service tracker */}
          <div className="mt-6">
            <div className="flex items-center">
              {serviceSteps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const circleClasses = isCompleted
                  ? "bg-green-600 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
                const lineClasses = index < serviceSteps.length - 1
                  ? isCompleted || isCurrent
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                  : "";
                return (
                  <React.Fragment key={step.key}>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${circleClasses}`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className="ml-2 mr-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {step.label}
                      </div>
                    </div>
                    {index < serviceSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 ${lineClasses}`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        {/* Responsive main content */}
        <div className="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-6">
          {/* Left side content */}
          <div className="w-full lg:col-span-4">
            {showMessages ? <OrderMessages /> : <OrderDeliverables />}
          </div>
          {/* Right Column - Sidebar */}
          <div className="w-full space-y-6 lg:col-span-2">
            <div
              className="py-6 px-6 font-semibold w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-lg cursor-pointer transition-colors"
              onClick={() => setShowMessages((v) => !v)}
            >
              <div>
                {showMessages ? (
                  <div className="flex items-center">
                    <Eye className="w-6 h-6 mr-2 text-gray-700 dark:text-gray-200" />
                    <span className="text-gray-900 dark:text-gray-100">Show Deliveries</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-gray-700 dark:text-gray-200" />
                    <span className="text-gray-900 dark:text-gray-100">Show Messages</span>
                  </div>
                )}
              </div>
              <ChevronRight
                className="w-4 h-4 ml-2 cursor-pointer text-gray-500 dark:text-gray-300"
                onClick={() => setShowMessages((v) => !v)}
              />
            </div>

            {/* Requirements Section */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Collapsible open={isRequirementsOpen} onOpenChange={setIsRequirementsOpen}>
                <CardHeader className="bg-white dark:bg-gray-900">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <FileText className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        Requirements
                      </CardTitle>
                      {isRequirementsOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      {requirements.map((req) => (
                        <div key={req.id} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.question}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{req.answer}</p>
                            </div>
                          </div>
                          {req.id < requirements.length && <Separator className="my-3 dark:bg-gray-700" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            {/* Service details section - redesigned for narrow sidebar */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Collapsible open={isServiceInfoOpen} onOpenChange={setIsServiceInfoOpen}>
                <CardHeader className="pb-3 bg-white dark:bg-gray-900">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <FileText className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                        Order Details
                      </CardTitle>
                      {isServiceInfoOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4 bg-white dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                        <img
                          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                          alt="Order Service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">I will make modern creative minimalist...</p>
                        <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900 mt-1 text-xs">
                          DELIVERED
                        </Badge>
                      </div>
                    </div>

                    <Separator className="dark:bg-gray-700" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ordered from</span>
                        <span className="text-gray-900 dark:text-gray-100">• Danish I</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Delivery date</span>
                        <span className="text-gray-900 dark:text-gray-100">Sep 19, 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total price</span>
                        <span className="text-gray-900 dark:text-gray-100">$8.78</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Order number</span>
                        <span className="text-gray-900 dark:text-gray-100">#FO6286A2E4EC4</span>
                      </div>
                    </div>

                    <Separator className="my-4 dark:bg-gray-700" />

                    {/* Items list - stacked for small width */}
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">{item.description}</div>
                            </div>
                            <div className="text-right text-xs text-gray-700 dark:text-gray-300 space-y-1 min-w-[84px]">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-700 dark:text-gray-300">Qty</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{item.quantity}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-700 dark:text-gray-300">Duration</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{item.duration}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-gray-700 dark:text-gray-300">Price</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.price}</span>
                              </div>
                            </div>
                          </div>
                          <Separator className="my-2 dark:bg-gray-700" />
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {item.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{orderDetails.subtotal}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{orderDetails.serviceFee}</span>
                      </div>
                      <Separator className="my-2 dark:bg-gray-700" />
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-gray-900 dark:text-gray-100">{orderDetails.total}</span>
                      </div>
                    </div>

                    {/* Extras */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Popular extras</h4>
                      <div className="space-y-2">
                        {upgrades.map((u, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                          >
                            <div className="min-w-0">
                              <div className="text-gray-900 dark:text-gray-100 truncate">{u.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Qty {u.quantity} • {u.duration}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-900 dark:text-gray-100">{u.price}</span>
                              <Button size="sm" className="h-8">
                                + Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-3 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>SSL Secure Payment. You will not be charged yet.</span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}