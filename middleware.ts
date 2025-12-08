// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_CONFIG = {
  AUTH_TOKEN_NAME: "auth-token",
  REFRESH_TOKEN_NAME: "refresh-token",
  SESSION_TIMEOUT: 30 * 60 * 1000,
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000,
  RATE_LIMITING: {
    MAX_REQUESTS_PER_MINUTE: 100,
    MAX_LOGIN_ATTEMPTS: 3,
    WINDOW_MS: 60 * 1000,
    BLOCK_DURATION: 10,
  },
};

const ROUTE_CONFIG = {
  PUBLIC: ["/", "/auth/login", "/auth/register"],
  PROTECTED_PREFIXES: [
    "/home-services/dashboard"
  ],
};

// In-memory rate limit store
const rateLimitStore = new Map<
  string,
  { count: number; lastReset: number; blockedUntil?: number }
>();

// Validate JWT token
function validateToken(token: string): {
  isValid: boolean;
  payload?: any;
  timeUntilExpiry?: number;
  error?: string;
} {
  if (!token || typeof token !== "string") {
    return { isValid: false, error: "No token provided" };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { isValid: false, error: "Invalid token format" };
    }

    // Decode base64 payload
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    // Validate required fields
    if (!payload.exp || !payload.iat) {
      return { isValid: false, error: "Missing required token fields" };
    }

    // Check expiration
    const now = Date.now();
    const expiry = payload.exp * 1000;

    if (now >= expiry) {
      return { isValid: false, error: "Token expired" };
    }

    // Check if issued at time is in the future (clock skew protection)
    const issuedAt = payload.iat * 1000;
    if (issuedAt > now + 60000) {
      // Allow 1 minute clock skew
      return { isValid: false, error: "Token issued in the future" };
    }

    return { isValid: true, payload, timeUntilExpiry: expiry - now };
  } catch{
    return { isValid: false, error: "Token parse failed" };
  }
}

// Rate limiting
function checkRateLimit(ip: string, pathname: string) {
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMITING.WINDOW_MS;

  let data = rateLimitStore.get(ip);

  if (data?.blockedUntil && now < data.blockedUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((data.blockedUntil - now) / 1000),
    };
  }

  if (!data || data.lastReset < windowStart) {
    data = { count: 0, lastReset: now };
  }

  const maxRequests = pathname.startsWith("/auth/")
    ? SECURITY_CONFIG.RATE_LIMITING.MAX_LOGIN_ATTEMPTS
    : SECURITY_CONFIG.RATE_LIMITING.MAX_REQUESTS_PER_MINUTE;

  if (data.count >= maxRequests) {
    data.blockedUntil = now + SECURITY_CONFIG.RATE_LIMITING.BLOCK_DURATION;
    rateLimitStore.set(ip, data);

    return {
      allowed: false,
      retryAfter: SECURITY_CONFIG.RATE_LIMITING.BLOCK_DURATION / 1000,
    };
  }

  data.count++;
  rateLimitStore.set(ip, data);
  return { allowed: true };
}

// Helpers
function isPublicRoute(path: string) {
  return ROUTE_CONFIG.PUBLIC.some(
    (route) => path === route || path.startsWith(route + "/")
  );
}

function isProtectedRoute(path: string) {
  if (isPublicRoute(path)) return false;

  return ROUTE_CONFIG.PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/")
  );
}

function isAuthRoute(path: string) {
  return path.startsWith("/auth/");
}

function isApiRoute(path: string) {
  return path.startsWith("/api/");
}

function isDashboardRoute(path: string) {
  return path.startsWith("/home-services/dashboard");
}

function getClientIP(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Middleware start
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const clientIP = getClientIP(request);

  const response = NextResponse.next();

  // Allow static files
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return response;
  }

  // ---------- RATE LIMIT ----------
  const rateLimit = checkRateLimit(clientIP, pathname);
  if (!rateLimit.allowed) {
    // API → return JSON 429
    if (isApiRoute(pathname)) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          retryAfter: rateLimit.retryAfter,
        }),
        { status: 429 }
      );
    }

    // Prevent redirect loop on /auth/*
    if (isAuthRoute(pathname)) {
      return NextResponse.next();
    }

    const url = new URL("/auth/login", request.url);
    url.searchParams.set("code", "429");
    return NextResponse.redirect(url);
  }

  // ---------- PROTECTED ROUTES ----------
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get(SECURITY_CONFIG.AUTH_TOKEN_NAME)?.value;
    const tokenValidation = token
      ? validateToken(token)
      : { isValid: false, error: "No token" };

    if (!tokenValidation.isValid) {
      // Prevent redirect loop if already on auth routes
      if (isAuthRoute(pathname)) return NextResponse.next();

      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      
      // Set appropriate reason based on error
      let reason = "authentication_required";
      if (token) {
        if (tokenValidation.error?.includes("expired")) {
          reason = "session_expired";
        } else {
          reason = "invalid_token";
        }
      }
      url.searchParams.set("reason", reason);
      
      return NextResponse.redirect(url);
    }

    // Add security headers for protected routes
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Mark dashboard access
    if (isDashboardRoute(pathname)) {
      response.headers.set("X-Dashboard-Access", "true");
    }
  }

  // ---------- AUTH ROUTES (Redirect if already authenticated) ----------
  if (isAuthRoute(pathname)) {
    const token = request.cookies.get(SECURITY_CONFIG.AUTH_TOKEN_NAME)?.value;
    const tokenValidation = token
      ? validateToken(token)
      : { isValid: false };

    if (tokenValidation.isValid) {
      // Get redirect URL from query params or default
      let redirectTo = searchParams.get("redirect") || "/home-services/dashboard";
      
      // Validate redirect URL to prevent open redirects
      if (!redirectTo.startsWith("/")) {
        redirectTo = "/home-services/dashboard";
      }

      // Prevent redirect loop
      if (redirectTo === pathname || redirectTo.startsWith("/auth/")) {
        redirectTo = "/home-services/dashboard";
      }

      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return response;
}

// Matcher
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$).*)",
  ],
};
