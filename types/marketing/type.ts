// src/components/marketing-hub/types.ts
export type Goal = "awareness" | "reach" | "leads" | "monetize";

export type Review = {
  id: number;
  name: string;
  role: string;
  service: string;
  city: string;
  content: string;
  rating: number;
};

export type Platform = "google" | "meta" | "youtube" | "tiktok" | "display";

export type PlatformsState = Record<Platform, boolean>;

export const GOAL_LABELS: Record<Goal, string> = {
  awareness: "Build awareness",
  reach: "Reach new customers",
  leads: "Receiving leads",
  monetize: "Monetise your content",
};

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Amira Hussaini",
    role: "Homeowner",
    service: "Plumbing",
    city: "San Jose",
    content: "Water heater fixed same day. Booking and updates were super clear—saved me a weekend of stress!",
    rating: 5,
  },
  {
    id: 2,
    name: "Miguel Santos",
    role: "Property Manager",
    service: "HVAC",
    city: "Phoenix",
    content: "Technician arrived on time, showed before/after photos, and our tenants were thrilled.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "New Parent",
    service: "House Cleaning",
    city: "Austin",
    content: "Booked a deep clean before our baby came home. The team was professional and fast—5 stars!",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Small Business Owner",
    service: "Electrician",
    city: "Seattle",
    content: "They rewired our shop and installed LED lighting—cut our bill and looks amazing.",
    rating: 4,
  },
];

// Utility: clamp index for carousels
export const wrapIndex = (idx: number, len: number) => (idx + len) % len;