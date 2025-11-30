// src/components/marketing-hub/CampaignDetailsForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CampaignDetailsFormProps {
  service: string;
  /* eslint-disable no-unused-vars */
  setService: (service: string) => void;
  city: string;
  setCity: (city: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  budget: number;
  setBudget: (budget: number) => void;
  audienceSize: number;
  setAudienceSize: (size: number) => void;
  conversionRate: number;
  setConversionRate: (rate: number) => void;
  /* eslint-enable no-unused-vars */
}

const CampaignDetailsForm: React.FC<CampaignDetailsFormProps> = ({
  service,
  setService,
  city,
  setCity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  budget,
  setBudget,
  audienceSize,
  setAudienceSize,
  conversionRate,
  setConversionRate
}) => {
  const serviceOptions = [
    "All Services", "Home Cleaning", "Electrician", "HVAC", "Cleaning", "Landscaping",
    "Painting", "Handyman", "Carpenter", "Appliance Repair"
  ];

  return (
    <>
      {/* Left Column - Basic Info */}
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
          <label className="text-sm font-medium">Target Location</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., New York" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Dates</label>
          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Right Column - Budget & Metrics */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center justify-between">
            <span>Monthly Budget (Credits)</span>
            <span className="text-[#0077B6] font-semibold">{budget} credits</span>
          </label>
          <Slider
            value={[budget]}
            onValueChange={([value]) => setBudget(value)}
            max={20000}
            step={500}
            className="py-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>500 credits</span>
            <span>10,000 credits</span>
            <span>20,000 credits</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center justify-between">
            <span>Target Audience Size</span>
            <span className="text-[#0077B6] font-semibold">{audienceSize.toLocaleString()}</span>
          </label>
          <Slider
            value={[audienceSize]}
            onValueChange={([value]) => setAudienceSize(value)}
            max={200000}
            step={5000}
            className="py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center justify-between">
            <span>Expected Conversion Rate</span>
            <span className="text-[#0077B6] font-semibold">{conversionRate}%</span>
          </label>
          <Slider
            value={[conversionRate]}
            onValueChange={([value]) => setConversionRate(value)}
            max={10}
            step={0.1}
            className="py-3"
          />
        </div>
      </div>
    </>
  );
};

export default CampaignDetailsForm;