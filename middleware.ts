import { NextRequest, NextResponse } from "next/server";
import { getProfessionalStepsAPI } from "./app/api/services/services";
import { resolveProfessionalStep } from "./lib/resolveProfessionalStep";

/* ================= CONFIG ================= */

const AUTH_COOKIE = "auth-token";
const REFRESH_COOKIE = "refresh-token";

const PROFESSIONAL_STEP_REQUIRED_ROUTES = [
  "/home-services/dashboard/main",
  "/home-services/dashboard/marketing",
  "/home-services/dashboard/leads",
];



const ROLE_CONFIG: Record<string, { routes: string[]; dashboard: string }> = {
  admin: {
    routes: ["/admin"],
    dashboard: "/admin",
  },
  professional: {
    routes: ["/home-services/dashboard"],
    dashboard: "/home-services/dashboard",
  },
  customer: {
    routes: ["/home-services/customer"],
    dashboard: "/home-services/customer",
  },
};

// Public routes that don’t require authentication
const PUBLIC_ROUTES = ["/home-services", "/auth"];

/* ================= HELPERS ================= */

function isPublicRoute(path: string) {
  return PUBLIC_ROUTES.includes(path) || path.startsWith("/auth/") || path.startsWith("/home-servies");
}


function isApiRoute(path: string) {
  return path.startsWith("/api/");
}

// Decode base64 URL-safe
function base64UrlDecode(input: string): string {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function decodeJwt(token: string): any | null {
  try {
    const clean = token.replace(/^Bearer\s+/i, "");
    const [, payload] = clean.split(".");
    if (!payload) return null;

    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}
function normalizeRoles(role: string | string[]) {
  if (Array.isArray(role)) return role.map(r => r.toLowerCase());
  if (typeof role === "string") return role.split(",").map(r => r.trim().toLowerCase());
  return [];
}
function isAuthorized(roles: string[], path: string) {
  return roles.some(role =>
    ROLE_CONFIG[role]?.routes.some(route => path === route || path.startsWith(`${route}/`))
  );
}







function dashboardForRoles(roles: string[]) {
  const priority = ["admin", "professional", "customer"];
  for (const role of priority) {
    if (roles.includes(role)) return ROLE_CONFIG[role].dashboard;
  }
  return "/unauthorized";
}

// Add security headers
function addSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}


export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = req.nextUrl.clone();

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    /\.(ico|png|jpg|css|js|svg|woff2?)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    const res = NextResponse.next();
    addSecurityHeaders(res);
    return res;
  }
  const accessToken = req.cookies.get(AUTH_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken) {
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    url.pathname = "/auth/login";
    url.search = `redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Decode access token
  let payload = decodeJwt(accessToken);

  // If access token expired but refresh token exists
  const now = Math.floor(Date.now() / 1000);
  if ((!payload || (payload.exp && payload.exp < now)) && refreshToken) {

    url.pathname = "/auth/login";
    url.search = `redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  if (!payload) {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.set(AUTH_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  const roles = normalizeRoles(payload.roles || payload.role);
  if (!roles.length) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (!isAuthorized(roles, pathname)) {
    url.pathname = dashboardForRoles(roles);
    return NextResponse.redirect(url);
  }


  if (roles.includes("professional")) {
    try {
      const stepData = await getProfessionalStepsAPI(accessToken!);
      const step = resolveProfessionalStep(stepData);

      if (
        step !== "dashboard" &&
        PROFESSIONAL_STEP_REQUIRED_ROUTES.some((route) => pathname.startsWith(route))
      ) {
        url.pathname = `/home-services/dashboard/services/step-${step}`;
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = "/home-services/dashboard";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  addSecurityHeaders(res);
  return res;
}


export const config = {
  matcher: ["/admin/:path*", "/home-services/:path*", "/api/:path*"],
};
