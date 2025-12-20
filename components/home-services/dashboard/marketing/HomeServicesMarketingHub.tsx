// src/components/marketing-hub/HomeServicesMarketingHub.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import ReviewMarketingSection from "./ReviewMarketingSection";
import GetMoreLeads from "./GetMoreLeads";
import ProfileVisibility from "./ProfileVisibility";
import Guarantee from "./Guaranty";
import CustomerRetention from "./CustomerRetention";

const HomeServicesMarketingHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "reviews" | "leads" | "visibility" | "retention" | "guarantee" | "allneeds" | "Ai Agent"
  >("reviews");

  return (
    <div className=" lg:px-4 py-10">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="rounded-full text-xs py-1 px-3 flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" /> Beta
        </Badge>
      </header>

      {/* Section Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-8 flex-wrap">
        <Button
          className="w-full sm:w-auto "
          variant={activeSection === "reviews" ? "default" : "outline"}
          onClick={() => setActiveSection("reviews")}
        >
          Review‑Based
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant={activeSection === "guarantee" ? "default" : "outline"}
          onClick={() => setActiveSection("guarantee")}
        >
          Guarantee
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant={activeSection === "leads" ? "default" : "outline"}
          onClick={() => setActiveSection("leads")}
        >
          Lead Growth
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant={activeSection === "visibility" ? "default" : "outline"}
          onClick={() => setActiveSection("visibility")}
        >
          Visibility
        </Button>
        <Button
          className="w-full sm:w-auto"
          variant={activeSection === "retention" ? "default" : "outline"}
          onClick={() => setActiveSection("retention")}
        >
          Customer Retention
        </Button>
        <Button
          className="w-full sm:w-auto "
          variant={activeSection === "allneeds" ? "default" : "outline"}
          onClick={() => setActiveSection("allneeds")}
        >
          Allneeda Ads
        </Button>
        <Button
          className="w-full sm:w-auto "
          variant={activeSection === "Ai Agent" ? "default" : "outline"}
          onClick={() => setActiveSection("Ai Agent")}
        >
          AI Agent
        </Button>

      </div>

      {/* Active Section */}
      <div className="w-full">
        {activeSection === "reviews" && <ReviewMarketingSection />}
        {activeSection === "guarantee" && <Guarantee />}
        {activeSection === "leads" && <GetMoreLeads />}
        {activeSection === "visibility" && <ProfileVisibility />}
        {activeSection === "retention" && <CustomerRetention />}
      </div>
    </div>
  );
};

export default HomeServicesMarketingHub;