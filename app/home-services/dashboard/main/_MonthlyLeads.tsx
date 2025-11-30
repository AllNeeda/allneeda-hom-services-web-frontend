"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessToken } from "@/app/api/axios";
import { useProfessionalLeads } from "@/hooks/useProfessionalLeads";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const months = [
  "All Months", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Type definitions for the lead data
interface ProfessionalLead {
  _id: string;
  createdAt?: string;
  created_at?: string;
  status: string;
  lead_id?: {
    _id: string;
    service_id: string;
    user_id: string;
    title: string;
    answers: unknown[];
  };
  professional_id: string;
  read_by_pro: boolean;
  updatedAt?: string;
  expire_at?: string;
  available?: boolean;
}

interface ProcessedDataItem {
  key: string;
  month: string;
  year: string;
  fullMonth: string;
  leads: number;
  sortKey: number;
}

interface ProfessionalLeadsResponse {
  success: boolean;
  message: string;
  professionalLeads: ProfessionalLead[];
  professional?: unknown;
  professionalServices?: unknown[];
}

export default function MonthlyLeadsChart() {
  const token = getAccessToken();
  const { data } = useProfessionalLeads(token!) as { data: ProfessionalLeadsResponse | undefined };
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("All Months");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    
    setIsDarkMode(mediaQuery.matches);
    setIsMobile(mobileQuery.matches);

    const handleModeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleModeChange);
    mobileQuery.addEventListener('change', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleModeChange);
      mobileQuery.removeEventListener('change', handleResize);
    };
  }, []);

  // Extract unique years from the professionalLeads data
  const availableYears = useMemo(() => {
    if (!data?.professionalLeads || !Array.isArray(data.professionalLeads)) {
      return [new Date().getFullYear().toString()];
    }
    
    const years = new Set<string>();
    data.professionalLeads.forEach((lead: ProfessionalLead) => {
      const dateString = lead.createdAt || lead.created_at;
      if (dateString) {
        const year = new Date(dateString).getFullYear().toString();
        years.add(year);
      }
    });
    
    // If no years from data, include current year
    if (years.size === 0) {
      years.add(new Date().getFullYear().toString());
    }
    
    return [...Array.from(years).sort((a, b) => b.localeCompare(a))];
  }, [data]);

  // Process and aggregate leads data by month and year
  const processedData = useMemo((): ProcessedDataItem[] => {
    if (!data?.professionalLeads || !Array.isArray(data.professionalLeads)) {
      return [];
    }

    const leadsByMonth: Record<string, number> = {};
    data.professionalLeads.forEach((lead: ProfessionalLead) => {
      const dateString = lead.createdAt || lead.created_at;
      if (dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth();
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        leadsByMonth[key] = (leadsByMonth[key] || 0) + 1;
      }
    });

    return Object.entries(leadsByMonth)
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month);
        const monthName = months[monthIndex + 1];
        return {
          key,
          month: monthName,
          year,
          fullMonth: isMobile ? monthName : `${monthName} ${year}`,
          leads: count,
          sortKey: parseInt(year) * 12 + monthIndex
        };
      })
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [data, isMobile]);

  // Filter data based on selected year and month
  const filteredData = useMemo((): ProcessedDataItem[] => {
    if (selectedMonth === "All Months") {
      return processedData.filter((item: ProcessedDataItem) => item.year === selectedYear);
    }
    
    return processedData.filter((item: ProcessedDataItem) => {
      return item.year === selectedYear && item.month === selectedMonth;
    });
  }, [processedData, selectedYear, selectedMonth]);

  // Get available months based on selected year
  const availableMonths = useMemo(() => {
    const monthsInYear = new Set<string>(["All Months"]);
    processedData.forEach((item: ProcessedDataItem) => {
      if (item.year === selectedYear) {
        monthsInYear.add(item.month);
      }
    });
    
    return Array.from(monthsInYear).sort((a, b) => {
      if (a === "All Months") return -1;
      if (b === "All Months") return 1;
      return months.indexOf(a) - months.indexOf(b);
    });
  }, [processedData, selectedYear]);

  // Reset month filter when year changes
  useEffect(() => {
    if (selectedMonth !== "All Months" && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth("All Months");
    }
  }, [availableMonths, selectedMonth]);

  // Chart series and categories
  const series = [{
    name: "Leads",
    data: filteredData.map(d => d.leads),
  }];
  
  const categories = filteredData.map(d => d.fullMonth);

  const baseOptions: ApexOptions = {
    colors: ["#0077B6"],
    chart: {
      fontFamily: "Inter, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
      background: 'transparent',
      zoom: { enabled: false },
      events: {
        // Remove hover tooltips
        dataPointMouseEnter: function() {},
        dataPointMouseLeave: function() {},
        markerClick: function() {},
      }
    },
    states: {
      hover: {
        filter: {
          type: 'none', // Disable hover effects
        }
      },
      active: {
        filter: {
          type: 'none', // Disable active state effects
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isMobile ? "60%" : categories.length > 6 ? "45%" : "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        colors: isDarkMode ? ['#374151'] : ['#6B7280'] // White in dark mode, gray in light mode
      },
      background: {
        enabled: false, // Remove background
      },
      dropShadow: {
        enabled: false // Remove shadow
      },
      offsetY: -22, // Increased offset for 2px+ spacing between value and bar
      formatter: function(val: number) {
        return val.toString(); // Show value on top of each bar
      }
    },
    stroke: { 
      show: true, 
      width: 1, 
      colors: ["transparent"] 
    },
    xaxis: { 
      categories,
      labels: {
        rotate: categories.length > (isMobile ? 4 : 6) ? -45 : 0,
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          colors: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
        hideOverlappingLabels: true,
        trim: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      crosshairs: {
        show: false // Remove crosshairs
      }
    },
    yaxis: { 
      title: { text: undefined },
      min: 0,
      tickAmount: 4,
      labels: {
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          colors: isDarkMode ? '#9CA3AF' : '#6B7280',
        }
      },
    },
    grid: { 
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      strokeDashArray: 3,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: {
        top: 30, // Increased top padding to accommodate data labels with proper spacing
        right: isMobile ? 5 : 0,
        bottom: 0,
        left: isMobile ? 5 : 0
      }
    },
    fill: { 
      opacity: 1,
    },
    tooltip: { 
      enabled: false, // Completely disable tooltips
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: { 
          height: 200,
          events: {
            dataPointMouseEnter: function() {},
            dataPointMouseLeave: function() {},
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none',
            }
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            borderRadius: 3,
            dataLabels: {
              position: 'top',
              style: {
                fontSize: '10px',
              }
            }
          }
        },
        dataLabels: {
          style: {
            fontSize: '10px',
            colors: isDarkMode ? ['#374151'] : ['#6B7280']
          },
          offsetY: -23 // Slightly less offset on mobile but still maintains spacing
        },
        xaxis: {
          labels: {
            rotate: -45,
            style: { fontSize: '10px' }
          }
        },
        yaxis: {
          labels: {
            style: { fontSize: '10px' }
          },
          tickAmount: 3
        },
        grid: {
          padding: {
            top: 25, // Adjusted for mobile
            right: 5,
            bottom: 0,
            left: 5
          }
        },
        tooltip: {
          enabled: false
        }
      }
    }]
  };

  const hasLeads = processedData.length > 0;
  const hasFilteredLeads = filteredData.length > 0;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 p-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-3 mb-4">
        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Monthly Leads Overview
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col xs:flex-row gap-2 w-full">
          <div className="flex-1 min-w-0">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full h-7 text-[12px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600 text-[12px]">
                {availableYears.map(year => (
                  <SelectItem 
                    key={year} 
                    value={year}
                    className="text-[12px] dark:text-white dark:focus:bg-gray-700"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-0">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full h-7 text-[12px] dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600 text-[12px]">
                {availableMonths.map(month => (
                  <SelectItem 
                    key={month} 
                    value={month}
                    className="text-[12px] dark:text-white dark:focus:bg-gray-700"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full">
        <div className="min-w-[280px]">
          {hasLeads ? (
            hasFilteredLeads ? (
              <ReactApexChart 
                options={baseOptions}
                series={series} 
                type="bar" 
                height={200}
              />
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center px-4">
                <p className="text-[13px] font-medium mb-1">No matching leads</p>
                <p className="text-[12px]">Adjust your filters to see results</p>
              </div>
            )
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-900 text-center px-4">
              <p className="text-[13px] font-medium mb-1">No leads data</p>
              <p className="text-[12px]">Leads will appear here when received</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Indicator */}
      {isMobile && hasFilteredLeads && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-[12px] text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 rounded-sm bg-[#0077B6]"></div>
              <span>Monthly leads distribution</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}