"use client";
import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { ArrowUp, ArrowDown, Users, MessageCircle, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Example data
const rawData = [
  { service: "Plumbing", year: "2025", month: "Jan", newLeads: 5, responded: 3, pending: 2 },
  { service: "Plumbing", year: "2025", month: "Feb", newLeads: 10, responded: 5, pending: 5 },
  { service: "Cleaning", year: "2025", month: "Jan", newLeads: 8, responded: 6, pending: 2 },
  { service: "Cleaning", year: "2025", month: "Feb", newLeads: 7, responded: 4, pending: 3 },
  { service: "Electrician", year: "2025", month: "Jan", newLeads: 2, responded: 1, pending: 1 },
];

// Months for dropdown
const months = ["All Months","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function LeadsSummary() {
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("2025");

  const filteredData = useMemo(() => {
    return rawData.filter(d => 
      (selectedService === "All Services" || d.service === selectedService) &&
      (selectedYear === "All Years" || d.year === selectedYear) &&
      (selectedMonth === "All Months" || d.month === selectedMonth)
    );
  }, [selectedService, selectedMonth, selectedYear]);

  const totalNew = filteredData.reduce((acc, d) => acc + d.newLeads, 0);
  const totalResponded = filteredData.reduce((acc, d) => acc + d.responded, 0);
  const totalPending = filteredData.reduce((acc, d) => acc + d.pending, 0);
  const totalLeads = totalNew + totalResponded + totalPending;

  const sparklineData = filteredData.map(d => ({ x: d.month, y: d.newLeads + d.responded + d.pending }));
  const trend = sparklineData.length > 0 ? sparklineData[sparklineData.length - 1].y - sparklineData[0].y : 0;
  const trendPercentage = sparklineData.length > 0 ? ((trend / sparklineData[0].y) * 100).toFixed(1) : "0";

  return (
    <div className="p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
        <h4 className="text-base font-semibold text-gray-800 mb-1 flex-1 min-w-[150px]">Leads Summary</h4>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Services">All Services</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Electrician">Electrician</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-28">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total leads & sparkline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
          <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            <span>{trend > 0 ? `+${trend}` : trend} leads ({trendPercentage}%)</span>
          </div>
        </div>

        <div className="w-full sm:w-24 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077B6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0077B6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke="#0077B6"
                fill="url(#colorY)"
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Tooltip
                contentStyle={{ 
                  background: "#fff", 
                  borderRadius: 6, 
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px"
                }}
                labelStyle={{ color: "#1F2937", fontWeight: 600 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Users className="w-4 h-4 text-[#0077B6]" />
            <span className="text-xs text-[#0077B6] font-medium">New</span>
          </div>
          <p className="font-bold text-lg text-gray-900">{totalNew}</p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Responded</span>
          </div>
          <p className="font-bold text-lg text-gray-900">{totalResponded}</p>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">Pending</span>
          </div>
          <p className="font-bold text-lg text-gray-900">{totalPending}</p>
        </div>
      </div>

      {/* Conversion rate */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Total leads conversion rate</span>
          <span className="font-medium text-gray-700">
            {totalLeads > 0 ? ((totalResponded / totalLeads) * 100).toFixed(1) + "%" : "0%"}
          </span>
        </div>
      </div>
    </div>
  );
}
