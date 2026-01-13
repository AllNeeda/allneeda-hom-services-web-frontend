import { NextRequest, NextResponse } from "next/server";
import { getProfessionalStepsAPI } from "./app/api/services/services";
import { resolveProfessionalStep } from "./lib/resolveProfessionalStep";

/* ================= CONFIG ================= */

const AUTH_COOKIE = "auth-token";
const REFRESH_COOKIE = "refresh-token";

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

const ROLE_ID_MAP: Record<number, string> = {
  10: "professional",
};

const PUBLIC_ROUTES = ["/home-services", "/auth"];
function isPublicRoute(path: string) {
  if (path === "/auth" || path.startsWith("/auth/")) return true;
  if (path === "/home-services" || path.startsWith("/home-services/")) {
    if (path.startsWith("/home-services/customer") || path.startsWith("/home-services/dashboard")) {
      return false;
    }
    return true;
  }
  return PUBLIC_ROUTES.includes(path);
}

function isApiRoute(path: string) {
  return path.startsWith("/api/");
}

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
function normalizeRoles(role: any) {
  if (Array.isArray(role)) return role.map((r) => String(r).toLowerCase());
  if (typeof role === "number" || (typeof role === "string" && /^\d+$/.test(role))) {
    const id = Number(role);
    const mapped = ROLE_ID_MAP[id];
    return mapped ? [mapped.toLowerCase()] : [];
  }
  if (typeof role === "string") return role.split(",").map((r) => r.trim().toLowerCase());
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
  let payload = decodeJwt(accessToken);
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
  const roles = normalizeRoles(payload.roles || payload.role || payload.role_id);
  if (!roles.length) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (!isAuthorized(roles, pathname)) {
    url.pathname = dashboardForRoles(roles);
    return NextResponse.redirect(url);
  }



  const res = NextResponse.next();
  addSecurityHeaders(res);
  return res;
}


export const config = {
  matcher: ["/admin/:path*", "/home-services/:path*", "/api/:path*"],
};