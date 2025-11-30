// src/components/marketing-hub/utils/marketingPlanner.ts
import { Goal } from "./type";

// Define GOAL_LABELS locally since it's only used in this file
const GOAL_LABELS: Record<Goal, string> = {
  awareness: "Build awareness",
  reach: "Reach new customers",
  leads: "Receiving Leads",
  monetize: "Monetise your content",
};

export const buildKeywordIdeas = (service: string, city: string) => {
  const s = service.toLowerCase();
  const c = city.toLowerCase();
  return [
    `[${s} near me]`,
    `[${c} ${s}]`,
    `"emergency ${s}"`,
    `"same day ${s} ${c}"`,
    `"${s} repair ${c}"`,
    `+${s} +quote +${city}`,
  ];
};

export const buildBannerCopy = (service: string, city: string, leadFocus: boolean) => {
  return {
    headline: `${service} in ${city} — ${leadFocus ? "Free Quote in 60s" : "Trusted Local Pros"}`,
    subhead: `Book vetted ${service.toLowerCase()}s with upfront pricing and 5★ reviews. Same‑day slots available.`,
    cta: leadFocus ? "Get Free Quote" : "Book Now",
  };
};

export const buildPlan = ({
  goal,
  leadFocus,
  service,
  city,
  budget,
  platforms,
}: {
  goal: Goal;
  leadFocus: boolean;
  service: string;
  city: string;
  budget: number;
  platforms: { google: boolean; meta: boolean; youtube: boolean; tiktok: boolean; display: boolean };
}) => {
  const base = {
    service,
    city,
    budget,
    goalLabel: GOAL_LABELS[goal],
  };

  const blocks: Array<{
    id: string;
    title: string;
    platform: string;
    why: string;
    formats: string[];
    setup: string[];
    creative: string[];
    measurement: string[];
    exampleHeadline?: string;
    examplePrimary?: string;
    keywords?: string[];
  } | null> = [];

  // Google Search / Performance Max (high intent)
  if (platforms.google && (goal === "leads" || goal === "reach" || leadFocus)) {
    blocks.push({
      id: "google-search",
      platform: "Google Ads",
      title: leadFocus ? "Search + Lead Form Extensions" : "Search (Exact + Phrase) & PMax",
      why: "Capture high‑intent users searching right now (e.g., 'plumber near me').",
      formats: [
        "Search campaigns (Exact/Phrase)",
        leadFocus ? "Lead Form Extensions" : "Performance Max (for incremental reach)",
        "Call Extensions (mobile)",
      ],
      setup: [
        `Geo target: ${city} + 15mi radius`,
        `Bidding: Maximize ${leadFocus ? "Leads (with tCPA if enough convs)" : "Conversions"}`,
        "Ad groups by service: emergency repair, installation, maintenance",
      ],
      creative: [
        `Include fast response & locality: 'Same‑day ${service.toLowerCase()} in ${city}'`,
        "Use numbers: years in business, 5★ rating, 24/7",
        "Add sitelinks: Pricing, Reviews, Financing, Areas Served",
      ],
      measurement: [
        "Primary: Submitted lead forms, calls (60s+)",
        "Secondary: CTR, QS, conversion rate",
      ],
      exampleHeadline: `${city} ${service} — Same‑Day Service`,
      examplePrimary: `Book trusted ${service.toLowerCase()}s in minutes. Upfront pricing. 5★ rated local pros.`,
      keywords: buildKeywordIdeas(service, city),
    });
  }

  // Meta (Facebook/Instagram) – Reach, Awareness, Conversions
  if (platforms.meta) {
    const metaTitle = goal === "awareness" ? "Video Views / Reach" : goal === "reach" ? "Traffic / Advantage+ Placements" : "Conversions (Leads/Bookings)";
    blocks.push({
      id: "meta",
      platform: "Facebook & Instagram",
      title: metaTitle,
      why: goal === "awareness" ? "Maximize impressions and video completions to build local familiarity." : goal === "reach" ? "Drive qualified visitors to your booking page with broad targeting + Advantage placements." : "Optimize for leads or bookings with on‑site pixel events.",
      formats: goal === "awareness" ? ["15s Reels/Stories", "Before/After carousel", "Testimonial quote graphic"] : ["Single Image/Video", "Carousel (before/after)", "Lead Ads (native form)"],
      setup: [
        `Location: ${city} (+10–25mi)`,
        "Targeting: Advantage+ (broad), custom audience from site visitors (if pixel)",
        leadFocus ? "Objective: Leads (Lead Ads) + Conversion (bookings)" : "Objective: Reach/Traffic",
      ],
      creative: [
        "Hook in 1s: problem → quick resolution",
        "Use UGC/testimonial clips (perform better than polished)",
        "Clear CTA: 'Get Free Quote', 'Book Now'",
      ],
      measurement: [
        leadFocus ? "Primary: Cost per lead / booking" : "Primary: Reach, ThruPlays, CTR",
        "Secondary: Add‑to‑cart/Start‑checkout (if applicable)",
      ],
      exampleHeadline: `${service} in ${city} — Book Today`,
      examplePrimary: `Trusted local ${service.toLowerCase()}s. Same‑day slots. See prices & reviews.`,
    });
  }

  // YouTube – Awareness/Reach
  if (platforms.youtube && (goal === "awareness" || goal === "reach")) {
    blocks.push({
      id: "youtube",
      platform: "YouTube Ads",
      title: "6s Bumper + 15s In‑Stream",
      why: "Build top‑of‑funnel awareness with short explainers and review snippets.",
      formats: ["6s bumper", "15s skippable in‑stream", "In‑feed video"],
      setup: [
        `Location: ${city}`,
        "Custom intent audiences: searchers of '{service} near me'",
        "Budget split: 70% bumper, 30% in‑stream",
      ],
      creative: [
        "Open with the mess → show the fix → show happy customer",
        "Overlay 5★ rating + city tag",
        "End card with logo & 'Book in minutes'",
      ],
      measurement: ["Ad recall lift (if eligible)", "View rate", "Engaged views to site"],
      exampleHeadline: `Need a ${service} in ${city}?`,
      examplePrimary: `Same‑day help. Book trusted pros in minutes.`,
    });
  }

  // Display banners (Landing page banner + remarketing)
  if (platforms.display && (goal === "awareness" || goal === "reach")) {
    blocks.push({
      id: "display",
      platform: "Google Display",
      title: "Responsive Display + Remarketing",
      why: "Cheap reach across local sites; follow up visitors who didn't book.",
      formats: ["Responsive Display Ads", "Static banners 300x250, 728x90, 1080x1080"],
      setup: [
        `Location: ${city}`,
        "Exclude converters; cap frequency to avoid fatigue",
        "Remarketing list: last 30 days site visitors",
      ],
      creative: ["Before/After visuals", "5★ badge + city", "'Free quote in 60s'"],
      measurement: ["View‑through conversions", "CTR (benchmarks ~0.3–0.6%)"],
      exampleHeadline: `${city}’s Trusted ${service}s`,
      examplePrimary: `Upfront pricing. Vetted local pros. Book today.`,
    });
  }

  // TikTok – Monetise content / Reach (optional)
  if (platforms.tiktok && (goal === "monetize" || goal === "reach" || goal === "awareness")) {
    blocks.push({
      id: "tiktok",
      platform: "TikTok",
      title: goal === "monetize" ? "Creator collabs + Spark Ads" : "In‑Feed with UGC",
      why: goal === "monetize" ? "Monetise helpful 'how‑to' content; amplify with paid Spark Ads." : "UGC drives attention for messy home problems & quick fixes.",
      formats: ["9–15s In‑Feed", "Spark Ads (boost organic)", "Topical how‑to series"],
      setup: [
        `Geo: ${city}`,
        "Hashtags: #homeservices #localpro + city tags",
        "CTAs: Get Quote / Book Now",
      ],
      creative: ["Show hands fixing the issue", "Add price overlay", "End with review snippet"],
      measurement: ["Thumb‑stop rate", "Clicks to site", "Leads (if pixel)"]
    });
  }

  // Landing page banner copy (always useful)
  const banner = buildBannerCopy(service, city, leadFocus);

  return { ...base, blocks: blocks.filter(Boolean), banner };
};

export const GOAL_LABELS_TO_SHORT = (label: string) => {
  if (label.startsWith("Build")) return "Awareness";
  if (label.startsWith("Reach")) return "Reach";
  if (label.startsWith("Receiving")) return "leads";
  return "Monetise";
};