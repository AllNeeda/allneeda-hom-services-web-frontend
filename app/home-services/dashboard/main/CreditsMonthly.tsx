"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreVertical } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

import { DropdownItem } from "@/components/ui/dropdownitems";
import { Dropdown } from "@/components/ui/dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";
import { getAccessToken } from "@/app/api/axios";
import GlobalLoader from "@/components/ui/global-loader";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// TypeScript interfaces based on your data structure
interface LeadData {
  service: string;
  year: string;
  spent: number[];
  leads: number[];
}

interface ProfessionalData {
  leadsData?: LeadData[];
  credits?: any[];
}

interface UseProfessionalLeadsReturn {
  data: ProfessionalData | undefined;
  isLoading: boolean;
  error: any;
}

export default function MonthlySpentLeadsChart() {
  const token = getAccessToken();
  const { data, isLoading, error } = useProfessionalLeads(token!) as UseProfessionalLeadsReturn;
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("All Services");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("All Years");

  // Set default month and year based on current date
  useEffect(() => {
    if (data?.leadsData && data.leadsData.length > 0) {
      const currentDate = new Date();
      const currentMonth = MONTHS[currentDate.getMonth()];
      const currentYear = currentDate.getFullYear().toString();

      // Check if current year exists in data, otherwise use available years
      const availableYears = [...new Set(data.leadsData.map(item => item.year))];
      const defaultYear = availableYears.includes(currentYear) ? currentYear : 
                         availableYears.length > 0 ? availableYears[0] : "All Years";

      setSelectedMonth(currentMonth);
      setSelectedYear(defaultYear);
    }
  }, [data?.leadsData]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  
  function closeDropdown() {
    setIsOpen(false);
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    colors: ["#0077B6", "#FFB703"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: MONTHS,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
    },
    yaxis: [
      {
        title: { 
          text: "Money Spent ($)",
          style: {
            color: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
          }
        },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      {
        opposite: true,
        title: { 
          text: "Leads (#)",
          style: {
            color: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
          }
        },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
    ],
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      markers: {
        size: 10,
        shape: "circle",
      },
      labels: {
        colors: '#6B7280',
      },
    },
    grid: { 
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      yaxis: { 
        lines: { 
          show: true 
        } 
      } 
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
      },
      y: {
        formatter: (val: number, opts) => {
          return opts.seriesIndex === 0 ? `$${val}` : `${val} Leads`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: { plotOptions: { bar: { columnWidth: "55%" } } },
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: { bar: { columnWidth: "65%" } },
          legend: { fontSize: "12px" },
        },
      },
      {
        breakpoint: 480,
        options: {
          plotOptions: { bar: { columnWidth: "85%" } },
          legend: { fontSize: "10px", position: "bottom" },
        },
      },
    ],
  };

  // Extract available services and years from dynamic data
  const availableServices = useMemo(() => {
    if (!data?.leadsData) return ["All Services"];
    const services = [...new Set(data.leadsData.map(item => item.service))];
    return ["All Services", ...services];
  }, [data?.leadsData]);

  const availableYears = useMemo(() => {
    if (!data?.leadsData) return ["All Years"];
    const years = [...new Set(data.leadsData.map(item => item.year))];
    return ["All Years", ...years.sort((a, b) => b.localeCompare(a))];
  }, [data?.leadsData]);

  const filteredSeries = useMemo(() => {
    // Use dynamic data if available, otherwise fallback to empty
    const rawData = data?.leadsData || [];

    let filteredData = rawData;

    if (selectedService !== "All Services") {
      filteredData = filteredData.filter(d => d.service === selectedService);
    }

    if (selectedYear !== "All Years") {
      filteredData = filteredData.filter(d => d.year === selectedYear);
    }

    let spent = new Array(12).fill(0);
    let leads = new Array(12).fill(0);

    filteredData.forEach(d => {
      d.spent.forEach((val, idx) => { spent[idx] += val });
      d.leads.forEach((val, idx) => { leads[idx] += val });
    });

    if (selectedMonth !== "All Months") {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      spent = spent.map((v, idx) => (idx === monthIndex ? v : 0));
      leads = leads.map((v, idx) => (idx === monthIndex ? v : 0));
    }

    return [
      { name: "Money Spent ($)", type: "column", data: spent },
      { name: "Leads (#)", type: "line", data: leads },
    ];
  }, [data?.leadsData, selectedService, selectedMonth, selectedYear]);

  const hasData = filteredSeries[0].data.some(val => val > 0) || filteredSeries[1].data.some(val => val > 0);

  if (isLoading) return <GlobalLoader />;

  if (error) {
    return (
      <div className="w-full rounded-sm border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
            Error loading chart data
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-[#0077B6] hover:bg-[#005885] text-white rounded-sm text-[13px] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
          Monthly Spending & Leads
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreVertical className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2 dark:bg-gray-800 dark:border-gray-700">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white text-[13px]"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white text-[13px]"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-full h-9 text-[13px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
            {availableServices.map(service => (
              <SelectItem 
                key={service} 
                value={service}
                className="text-[13px] dark:text-white dark:focus:bg-gray-700"
              >
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full h-9 text-[13px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
            <SelectItem 
              value="All Months"
              className="text-[13px] dark:text-white dark:focus:bg-gray-700"
            >
              All Months
            </SelectItem>
            {MONTHS.map(month => (
              <SelectItem 
                key={month} 
                value={month}
                className="text-[13px] dark:text-white dark:focus:bg-gray-700"
              >
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full h-9 text-[13px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
            {availableYears.map(year => (
              <SelectItem 
                key={year} 
                value={year}
                className="text-[13px] dark:text-white dark:focus:bg-gray-700"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full">
        {hasData ? (
          <ReactApexChart
            options={options}
            series={filteredSeries}
            type="line"
            height={320}
          />
        ) : (
          <div className="h-[320px] flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <p className="text-[13px] font-medium mb-1">No data available</p>
            <p className="text-[12px]">for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
}