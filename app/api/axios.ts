// app/api/axios.ts
import axios from "axios";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function redirectToLogin(reason?: string) {
  const params = new URLSearchParams();
  if (reason) {
    params.set("reason", reason);
  }

  redirect(`/auth/login?${params.toString()}`);
}

class AuthTokenManager {
  private readonly ACCESS_TOKEN_KEY = "auth-token";
  private readonly REFRESH_TOKEN_KEY = "refresh-token";
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Set secure cookies with proper attributes
      document.cookie = `${this.ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=1800; secure; samesite=strict`; // 30 minutes
      document.cookie = `${this.REFRESH_TOKEN_KEY}=${refreshToken}; path=/; max-age=2592000; secure; samesite=strict`; // 30 days
    } catch {
      throw new Error("Failed to store authentication tokens");
    }
  }
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
  clearTokens(): void {
      document.cookie = `${this.ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${this.REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp && Date.now() >= payload.exp * 1000;
      return !isExpired;
    } catch {
      return false;
    }
  }
  validateToken(token: string): boolean {
    if (!token) return false;
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) return false;
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const tokenManager = new AuthTokenManager();
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.validateToken(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        tokenManager.clearTokens();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken && tokenManager.validateToken(refreshToken)) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await api.post("/auth/refresh", {
            refreshToken,
          });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data.tokens;
          if (newAccessToken && newRefreshToken) {
            await tokenManager.setTokens(newAccessToken, newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch  {
          tokenManager.clearTokens();
          if (typeof window !== "undefined") {
            redirectToLogin("session_expired");
          }
        }
      } else {
        // No valid refresh token, clear tokens and redirect
        tokenManager.clearTokens();
        if (typeof window !== "undefined") {
          redirectToLogin("authentication_required");
        }
      }
    }
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        redirectToLogin("access_denied");
      }
    }
    if (error.response?.status === 429) {
      console.error("Rate limit exceeded");
    }

    return Promise.reject(error);
  }
);
export const setAccessToken = (token: string) => {
  const refreshToken = tokenManager.getRefreshToken();
  if (refreshToken) {
    tokenManager.setTokens(token, refreshToken);
  }
};
export const clearAccessToken = () => {
  tokenManager.clearTokens();
};
export const getAccessToken = () => tokenManager.getAccessToken();
export { api };

 export const getStaticURL = () => {
  return "http://localhost:4000/uploads/service";
 }

 export const getSubcategoryStaticURL = () => {
  return "http://localhost:4000/uploads/SubCategory";
 }

  export const getCategoryStaticURL = () => {
  return "http://localhost:4000/uploads/category";
 }

 export const getMediacUrl = () => {
  return 'http://localhost:4000';
 }
 export const getPorfessionalsStaticURL = () => {
    return "http://localhost:4000/uploads/professionals";
 }