// app/api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1/",
  timeout: 15000, // Reduced to 15 seconds to fail faster
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Track if refresh is in progress to prevent race conditions
let isRefreshing = false;
let failedQueue: Array<{
  /* eslint-disable */
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  /* eslint-enable */
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

class AuthTokenManager {
  private readonly ACCESS_TOKEN_KEY = "auth-token";
  private readonly REFRESH_TOKEN_KEY = "refresh-token";

  /**
   * Get access token from cookie (read-only, set by server)
   * Note: Cookies should be set as HttpOnly by the backend API
   * This method is for client-side validation only
   */
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === this.ACCESS_TOKEN_KEY) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Get refresh token from cookie (read-only, set by server)
   */
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === this.REFRESH_TOKEN_KEY) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Clear tokens by calling logout endpoint
   * Server will clear HttpOnly cookies
   */
  async clearTokens(): Promise<void> {
    try {
      // Call logout endpoint to clear HttpOnly cookies on server
      await api.post("/auth/logout");
    } catch {
      // Even if logout fails, clear client-side cookies as fallback
      if (typeof window !== "undefined") {
        document.cookie = `${this.ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
        document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
      }
    }
  }

  /**
   * Check if user has a valid token (client-side check only)
   * Server-side validation is authoritative
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return this.validateToken(token);
  }

  /**
   * Validate JWT token structure and expiration
   */
  validateToken(token: string): boolean {
    if (!token || typeof token !== "string") return false;

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));

      // Check expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }

      // Basic structure validation
      if (!payload.iat || !payload.exp) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get token expiration time in milliseconds
   */
  getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expiring soon (within threshold)
   */
  isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;

    const timeUntilExpiry = expiration - Date.now();
    return timeUntilExpiry < thresholdMinutes * 60 * 1000;
  }
}

export const tokenManager = new AuthTokenManager();

/**
 * Request Interceptor
 * Adds Authorization header if valid token exists
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.validateToken(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        // Invalid token, clear it
        if (typeof window !== "undefined") {
          document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh and error responses
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (refreshToken && tokenManager.validateToken(refreshToken)) {
        try {
          // Refresh token endpoint should set new HttpOnly cookies
          const refreshResponse = await api.post("/auth/refresh", {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.data.tokens || {};

          if (accessToken && newRefreshToken) {
            // Update Authorization header with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            // Process queued requests
            processQueue(null, accessToken);
            isRefreshing = false;

            return api(originalRequest);
          } else {
            throw new Error("Invalid token response");
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and process queue
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;

          await tokenManager.clearTokens();

          // Trigger logout in auth context (will be handled by auth context)
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("auth:logout", {
                detail: { reason: "session_expired" },
              })
            );
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No valid refresh token
        isRefreshing = false;
        await tokenManager.clearTokens();

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:logout", {
              detail: { reason: "authentication_required" },
            })
          );
        }

        return Promise.reject(error);
      }
    }

    // Handle 403 Forbidden - Access denied
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "access_denied" },
          })
        );
      }
    }

    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      console.warn(
        `Rate limit exceeded. Retry after: ${retryAfter || "unknown"} seconds`
      );
    }

    return Promise.reject(error);
  }
);

// Legacy exports for backward compatibility
export const clearAccessToken = () => tokenManager.clearTokens();
export const getAccessToken = () => tokenManager.getAccessToken();

export { api };

/**
 * Static URL helpers for media assets
 * TODO: Move these to environment variables for better configuration
 */
export const getStaticURL = () => {
  return (
    process.env.NEXT_PUBLIC_STATIC_URL ||
    "http://localhost:4000/uploads/service"
  );
};

export const getSubcategoryStaticURL = () => {
  return (
    process.env.NEXT_PUBLIC_STATIC_URL ||
    "http://localhost:4000/uploads/SubCategory"
  );
};

export const getCategoryStaticURL = () => {
  return (
    process.env.NEXT_PUBLIC_STATIC_URL ||
    "http://localhost:4000/uploads/category"
  );
};

export const getMediacUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
};

export const getPorfessionalsStaticURL = () => {
  return (
    process.env.NEXT_PUBLIC_STATIC_URL ||
    "http://localhost:4000/uploads/professionals"
  );
};
