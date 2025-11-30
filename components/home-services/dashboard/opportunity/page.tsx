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
import Image from "next/image";

const ACCENT = "#0066B7";

interface Request {
  id: number;
  customerName: string;        // ✅ real customer name
  leadResponse: string;        // ✅ e.g., "1st to respond (83)"
  timeAgo: string;
  location: string;
  dateRange: string;
  openDates: boolean;
  discount?: string;
  tags: string[];
  createdAt: string;           // ISO for sorting
  avatarUrl?: string;          // optional
  distanceMiles?: number;      // added distance for miles filter
}

const requests: Request[] = [
  {
    id: 1,
    customerName: "Alexia Ghiran",
    leadResponse: "1st to respond (83)",
    timeAgo: "about 15 hours ago",
    location: "Arlington, VA 22201",
    dateRange: "Aug 5–7",
    openDates: true,
    distanceMiles: 50,
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
  },
  {
    id: 2,
    customerName: "Ghiran ",
    leadResponse: "1st to respond (83)",
    timeAgo: "about 20 hours ago",
    location: "Alexandria, VA 22310",
    dateRange: "Aug 5–11",
    openDates: true,
    distanceMiles: 100,
    tags: ["Fixture/outlet issue", "Lights", "10–14 ft ceiling", "House", "22310"],
    createdAt: "2025-08-12T14:00:00Z",
  },
  {
    id: 3,
    customerName: "McKenzie ",
    leadResponse: "1st to respond (83)",
    timeAgo: "about 15 hours ago",
    location: "Arlington, VA 22201",
    dateRange: "Aug 5–7",
    openDates: true,
    distanceMiles: 50,
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
  },
  {
    id: 4,
    customerName: "Morgan ",
    leadResponse: "1st to respond (83)",
    timeAgo: "about 20 hours ago",
    location: "Alexandria, VA 22310",
    dateRange: "Aug 5–11",
    openDates: true,
    distanceMiles: 100,
    tags: ["Fixture/outlet issue", "Lights", "10–14 ft ceiling", "House", "22310"],
    createdAt: "2025-08-12T14:00:00Z",
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

const MILES_OPTIONS = ["All", "50", "100", "150", "200", "250", "300"] as const;

type SortKey = "relevant" | "newest" | "oldest";

function getInitials(name: string) {
  const clean = name.trim();
  if (!clean) return "?";
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return clean.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function CustomerRequests() {
  const [responseFilter, setResponseFilter] =
    useState<(typeof RESPONSE_OPTIONS)[number]>("All Leads");
  const [sortBy, setSortBy] = useState<SortKey>("relevant");
  const [milesFilter, setMilesFilter] = useState<(typeof MILES_OPTIONS)[number]>("All");

  const visibleRequests = useMemo(() => {
    let data = [...requests];

    // Filter by lead response rank
    if (responseFilter !== "All Leads") {
      data = data.filter((r) => r.leadResponse === responseFilter);
    }

    // Filter by miles
    if (milesFilter !== "All") {
      const milesNum = parseInt(milesFilter);
      data = data.filter((r) => r.distanceMiles && r.distanceMiles <= milesNum);
    }

    // Sort
    if (sortBy === "newest") {
      data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      data.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    }
    return data;
  }, [responseFilter, sortBy, milesFilter]);

  return (
    <div className="w-full">
      <div className="w-full max-w-6xl mx-auto sm:p-4 md:p-6 transition-colors duration-300 dark:bg-gray-900 min-h-screen">

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
              <SelectTrigger className="w-full sm:w-[240px] rounded-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-[var(--accent)]"
                style={{ ["--accent" as any]: ACCENT }}>
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

            {/* Miles Filter */}
            <Select
              value={milesFilter}
              onValueChange={(val) =>
                setMilesFilter(val as (typeof MILES_OPTIONS)[number])
              }
            >
              <SelectTrigger className="w-full sm:w-[150px] rounded-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-[var(--accent)]"
                style={{ ["--accent" as any]: ACCENT }}>
                <SelectValue placeholder="Miles" />
              </SelectTrigger>
              <SelectContent>
                {MILES_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt === "All" ? "Select Miles" : `${opt} miles`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger className="w-full sm:w-[200px] rounded-sm border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-[var(--accent)]"
                style={{ ["--accent" as any]: ACCENT }}>
                <SelectValue placeholder="Most Relevant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4 md:space-y-5">
          {visibleRequests.map((req) => (
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
                    style={{ background: ACCENT }}
                    aria-label={`Customer ${req.customerName}`}
                  >
                    {req.avatarUrl ? (
                      <Image
                        src={req.avatarUrl}
                        alt={req.customerName}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    ) : (
                      getInitials(req.customerName)
                    )}
                  </div>

                  {/* Name + Time */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {req.customerName}
                      </span>
                      <span
                        className="inline-flex items-center text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(0,102,183,0.10)] text-[color:var(--accent)] ring-1 ring-[rgba(0,102,183,0.20)]"
                        style={{ ["--accent" as any]: ACCENT }}
                        title="Lead response position"
                      >
                        {req.leadResponse}
                      </span>
                    </div>

                    <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {req.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Optional discount */}
                {req.discount && (
                  <span
                    className="shrink-0 inline-flex items-center text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 ring-1 ring-green-200"
                    title="Discount"
                  >
                    {req.discount}
                  </span>
                )}
              </div>

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

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {req.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs md:text-[13px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200/60 dark:ring-gray-600 hover:bg-[rgba(0,102,183,0.10)] hover:text-[color:var(--accent)] hover:ring-[rgba(0,102,183,0.25)] transition"
                    style={{ ["--accent" as any]: ACCENT }}
                    title={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col sm:flex-row sm:justify-end gap-2">
                <Link
                  href={`/home-services/dashboard/leads/${req.id}`}
                  className="inline-flex justify-center items-center rounded-sm text-sm font-normal px-4 py-2.5 bg-[color:var(--accent)] text-white hover:opacity-95 active:opacity-90 transition w-full sm:w-auto"
                  style={{ ["--accent" as any]: ACCENT }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
