"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { getAccessToken } from "@/app/api/axios";
import { useProfesssionalProgress } from "@/hooks/RegisterPro/useRegister";
import { useProfessionalLead } from "@/hooks/useHomeServices";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { useAuth } from "@/components/providers/context/auth-context";

const ACCENT = "#0066B7";

interface Request {
  id: string;
  title: string;
  customerName: string;
  leadResponse: string;
  timeAgo: string;
  location: string;
  dateRange: string;
  openDates: boolean;
  discount?: string;
  tags: string[];
  createdAt: string;
  avatarUrl?: string;
  service: string;
  status: string;
  note?: string;
  userEmail: string;
  userPhone: string;
}

// Fallback dummy data in case of error
const fallbackRequests: Request[] = [
  {
    id: "1",
    title: "Request for Wall mount",
    customerName: "Alexia Ghiran",
    leadResponse: "1st to respond (83)",
    timeAgo: "about 15 hours ago",
    location: "Arlington, VA 22201",
    dateRange: "Aug 5–7",
    openDates: true,
    tags: [
      "Wall mount",
      "Need pro to determine",
      "TV ≤ 60 inches",
      "Outlet nearby",
      "No cable concealment",
      "Have mount/stand",
      "Flat wall (fixed)",
      "Not sure",
      "None",
      "22201",
    ],
    createdAt: "2025-08-12T19:00:00Z",
    service: "Furniture Assembly",
    status: "sent",
    userEmail: "example@email.com",
    userPhone: "000-000-0000",
  },
];

const RESPONSE_OPTIONS = [
  "All Leads",
  "1st to respond (83)",
  "2nd to respond (53)",
  "3rd to respond (24)",
  "4th to respond (56)",
  "5th to respond (98)",
] as const;

type SortKey = "relevant" | "newest" | "oldest";

function getInitials(name: string) {
  const clean = name.trim();
  if (!clean) return "?";
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return clean.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Function to calculate time ago from createdAt
function getTimeAgo(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

// Function to extract tags from answers and service info
function extractTags(lead: any): string[] {
  const tags: string[] = [];

  // Add service name
  if (lead.lead?.service?.name) {
    tags.push(lead.lead.service.name);
  }

  // Add answers as tags
  if (lead.lead?.answers && Array.isArray(lead.lead.answers)) {
    lead.lead.answers.forEach((answer: any) => {
      if (answer.answer && typeof answer.answer === "string") {
        tags.push(answer.answer);
      }
    });
  }

  // Add location info
  if (lead.lead?.user_location) {
    const loc = lead.lead.user_location;
    if (loc.city) tags.push(loc.city);
    if (loc.postcode) tags.push(loc.postcode);
    if (loc.state) tags.push(loc.state);
  }

  return tags.slice(0, 10); // Limit to 10 tags
}

// Function to transform API data to Request format
function transformLeadData(apiData: any): Request[] {
  if (!apiData || !apiData.data || !Array.isArray(apiData.data)) return [];

  return apiData.data.map((lead: any, index: number) => {
    const innerLead = lead.lead || {};
    const userEmail = innerLead.user?.email || "No email provided";
    const userName = userEmail.split("@")[0] || "Customer";
    const location = innerLead.user_location
      ? `${innerLead.user_location.city || ""}, ${
          innerLead.user_location.state || ""
        } ${innerLead.user_location.postcode || ""}`.trim()
      : "Location not specified";

    const responseOptions = [
      "1st to respond (83)",
      "2nd to respond (53)",
      "3rd to respond (24)",
    ];
    const leadResponse =
      responseOptions[index % responseOptions.length] || "1st to respond (83)";

    return {
      id: innerLead._id || `lead-${index}`, // ✅ Use the actual Lead ID
      customerName: userName.charAt(0).toUpperCase() + userName.slice(1),
      leadResponse,
      timeAgo: getTimeAgo(
        lead.created_at || innerLead.created_at || new Date().toISOString()
      ),
      location,
      dateRange: "Flexible dates",
      openDates: true,
      tags: extractTags(lead),
      createdAt:
        lead.created_at || innerLead.created_at || new Date().toISOString(),
      service: innerLead.service?.name || "General Service",
      status: lead.status || "sent",
      note: innerLead.note || "No additional note provided",
      title: innerLead.title || "Untitled Lead", // ✅ Add lead title
      userEmail,
      userPhone: innerLead.user?.phone || "Phone not provided",
    };
  });
}

export default function CustomerRequests() {
  const [responseFilter, setResponseFilter] =
    useState<(typeof RESPONSE_OPTIONS)[number]>("All Leads");
  const [sortBy, setSortBy] = useState<SortKey>("relevant");
  const {user} = useAuth();

  const token = getAccessToken() || "";
  const { data: professionalData } = useProfesssionalProgress(token);

  // Store ID locally after fetching once
  const proId = useMemo(() => {
    if (!professionalData) return null;
    const id = Array.isArray(professionalData)
      ? professionalData?.[0]?._id
      : professionalData?._id;
    if (id) localStorage.setItem("proId", id);
    return id;
  }, [professionalData]);

  // Try using cached ID immediately
  const cachedProId =
    proId || (typeof window !== "undefined" && localStorage.getItem("proId"));
  const phoneNumber = user?.phoneNo;

  const {
    data: professionalLead,
    isLoading,
    isError,
  } = useProfessionalLead(cachedProId || "", token,phoneNumber|| '');
  
  // Transform API data to Request format
  const requests = useMemo(() => {
    if (professionalLead) {
      const transformed = transformLeadData(professionalLead);
      return transformed.length > 0 ? transformed : fallbackRequests;
    }
    return fallbackRequests;
  }, [professionalLead]);

  const visibleRequests = useMemo(() => {
    let data = [...requests];

    // filter by lead response rank
    if (responseFilter !== "All Leads") {
      data = data.filter((r) => r.leadResponse === responseFilter);
    }

    // sort
    if (sortBy === "newest") {
      data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      data.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    }
    // "relevant" keeps predefined order
    return data;
  }, [responseFilter, sortBy, requests]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto sm:p-4 md:p-6 transition-colors duration-300 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066B7] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading professional leads...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <ErrorDisplay
        errorType="leadNotFound"
        fullScreen={false}
        onRetry={() => window.location.reload()}
      />
    );
  }
  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto sm:p-4 md:p-6 transition-colors duration-300 dark:bg-gray-900 min-h-screen">
        {/* Header Stats */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Total Leads:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {requests.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Available:</span>
              <span className="text-green-600 dark:text-green-400">
                {requests.filter((r) => r.status === "sent").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Service:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {requests[0]?.service || "Various Services"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Response Filter */}
            <Select
              value={responseFilter}
              onValueChange={(val) =>
                setResponseFilter(val as (typeof RESPONSE_OPTIONS)[number])
              }
            >
              <SelectTrigger
                className="w-full sm:w-[240px] rounded-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-[var(--accent)]"
                style={{ ["--accent" as any]: ACCENT }}
              >
                <SelectValue placeholder="All Leads" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortKey)}
            >
              <SelectTrigger
                className="w-full sm:w-[200px] rounded-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-[var(--accent)]"
                style={{ ["--accent" as any]: ACCENT }}
              >
                <SelectValue placeholder="Most Relevant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Pills */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="#"
              className="text-xs sm:text-sm font-medium py-2 px-4 rounded-sm bg-[rgba(0,102,183,0.12)] text-[color:var(--accent)] hover:bg-[rgba(0,102,183,0.18)] transition"
              style={{ ["--accent" as any]: ACCENT }}
            >
              Free Leads ({requests.filter((r) => !r.discount).length})
            </Link>
            <Link
              href="#"
              className="text-xs sm:text-sm font-medium py-2 px-4 rounded-sm bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              Urgent ({requests.filter((r) => r.status === "sent").length})
            </Link>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 md:space-y-5">
          {visibleRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Leads Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {professionalLead
                    ? "No leads match your current filters."
                    : "No professional leads found at the moment."}
                </p>
              </div>
            </div>
          ) : (
            visibleRequests.map((req) => (
              <div
                key={req.id}
                className="group bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 rounded-sm shadow-sm hover:shadow-lg transition-all duration-200 p-5 md:p-6"
              >
                {/* Top: Profile + Meta */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-semibold text-white shadow-sm"
                      style={{
                        background: ACCENT,
                      }}
                      aria-label={`Customer ${req.customerName}`}
                    >
                      {getInitials(req.customerName)}
                    </div>

                    {/* Name + Time */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {req.customerName}
                        </span>
                        {/* Lead Response Badge */}
                        <span
                          className="inline-flex items-center text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(0,102,183,0.10)] text-[color:var(--accent)] ring-1 ring-[rgba(0,102,183,0.20)]"
                          style={{ ["--accent" as any]: ACCENT }}
                          title="Lead response position"
                        >
                          {req.leadResponse}
                        </span>
                        {/* Service Badge */}
                        <span className="inline-flex items-center text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 ring-1 ring-purple-200">
                          {req.service}
                        </span>
                      </div>

                      <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {req.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`shrink-0 inline-flex items-center text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full ${
                      req.status === "sent"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                    }`}
                    title="Lead status"
                  >
                    {req.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {req.title}
                </h3>

                {/* Customer Note */}
                {req.note && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      &quot;{req.note}&quot;
                    </p>
                  </div>
                )}

                {/* Details: Location + Dates */}
                <div className="mt-4 md:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: ACCENT }} />
                    <span className="truncate">{req.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: ACCENT }} />
                    <span>
                      {req.dateRange}{" "}
                      {req.openDates && (
                        <span className="text-gray-500 dark:text-gray-400">
                          (Open to other dates)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                {req.status === "accpted" ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="truncate">
                      <span className="font-medium">Email:</span>{" "}
                      {req.userEmail}
                    </div>
                    <div className="truncate">
                      <span className="font-medium">Phone:</span>{" "}
                      {req.userPhone}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="truncate">
                      <span className="font-medium">Email:</span>{" "}
                      {(() => {
                        const email = req.userEmail || "";
                        const [local, domain] = email.split("@");
                        if (!local || !domain) return email;

                        const firstTwo = local.slice(0, 2);
                        const lastTwo = local.slice(-2);
                        const domainParts = domain.split(".");
                        const tld =
                          domainParts[domainParts.length - 1] || "com";

                        return `${firstTwo}***${lastTwo}@****.${tld}`;
                      })()}
                    </div>

                    <div className="truncate">
                      <span className="font-medium">Phone:</span>{" "}
                      {(() => {
                        const phone = req.userPhone || "";
                        const digits = phone.replace(/\D/g, ""); // only digits
                        if (digits.length < 4) return phone.replace(/\d/g, "*");

                        const firstTwo = digits.slice(0, 2);
                        const lastTwo = digits.slice(-2);

                        return `${firstTwo}******${lastTwo}`;
                      })()}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {req.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {req.tags.slice(0, 8).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs md:text-[13px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200/60 dark:ring-gray-600 hover:bg-[rgba(0,102,183,0.10)] hover:text-[color:var(--accent)] hover:ring-[rgba(0,102,183,0.25)] transition"
                        style={{ ["--accent" as any]: ACCENT }}
                        title={tag}
                      >
                        {tag}
                      </span>
                    ))}
                    {req.tags.length > 8 && (
                      <span className="px-3 py-1 rounded-full text-xs md:text-[13px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        +{req.tags.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-col sm:flex-row sm:justify-end gap-2">
                  <Link
                    href={`/home-services/dashboard/leads/${req.id}`}
                    className="inline-flex justify-center items-center rounded-sm text-sm font-normal px-4 py-2.5 bg-[color:var(--accent)] text-white hover:opacity-95 active:opacity-90 transition w-full sm:w-auto"
                    style={{ ["--accent" as any]: ACCENT }}
                  >
                    View Details & Respond
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="px-6">
        <Link
          href="/home-services/dashboard/opportunities"
          className="text-[#0077B6] font-medium px-4 py-2 rounded-lg hover:bg-[#E0F2FF] transition-colors duration-200"
        >
          Opportunities
        </Link>
      </div>
    </div>
  );
}
