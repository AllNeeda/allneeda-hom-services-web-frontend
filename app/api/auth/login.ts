// app/api/auth.ts
import { api, tokenManager } from "@/app/api/axios";

export interface User {
  _id: string;
  email: string;
  username: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  code?: string;
}

class AuthService {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const tokens = response.data.tokens;
      
      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        throw new Error("Invalid email or password");
      }
      
      const { user } = response.data;

      // Tokens should be set as HttpOnly cookies by the backend
      // If backend doesn't set cookies, we need to set them client-side as fallback
      // Note: For maximum security, backend should set HttpOnly cookies
      if (typeof window !== "undefined") {
        const isProduction = process.env.NODE_ENV === "production";
        const secureFlag = isProduction ? "secure" : "";
        const sameSite = "SameSite=Strict";
        
        // Set access token (30 minutes)
        document.cookie = `auth-token=${tokens.accessToken}; path=/; max-age=1800; ${sameSite}; ${secureFlag}`;
        // Set refresh token (30 days)
        document.cookie = `refresh-token=${tokens.refreshToken}; path=/; max-age=2592000; ${sameSite}; ${secureFlag}`;
      }

      return {
        user,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        if (status === 422 && responseData?.errors) {
          throw {
            message: "Validation failed",
            fieldErrors: responseData.errors,
          };
        }
        
        // Extract backend error message from various possible formats
        let message = "Login failed";
        if (responseData) {
          // Try different error message fields
          if (responseData.message) {
            message = responseData.message;
          } else if (responseData.error) {
            message = responseData.error;
          } else if (responseData.detail) {
            message = responseData.detail;
          } else if (responseData.title) {
            message = responseData.title;
          } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
            // Handle array of errors
            message = responseData.errors
              .map((err: any) => err.message || err.msg || err.error || String(err))
              .join(", ");
          } else if (typeof responseData === "string") {
            message = responseData;
          }
        }
        
        // Override with status-specific messages only if no backend message was found
        if (message === "Login failed") {
          switch (status) {
            case 400:
              message = "Invalid request format";
              break;
            case 401:
              message = "Invalid email or password";
              break;
            case 403:
              message = "Account suspended or access restricted";
              break;
            case 404:
              message = "Account not found";
              break;
            case 429:
              message = "Too many login attempts. Please try again later";
              break;
            case 500:
              message = "Server error. Please try again later";
              break;
          }
        }
        
        throw new Error(message);
      } else if (error.request) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      } else {
        throw new Error(
          error.message || "An unexpected error occurred during login."
        );
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await tokenManager.clearTokens();
    } catch {
      // Even if logout API fails, clear local tokens
      console.warn("Logout API call failed, clearing local tokens");
      if (typeof window !== "undefined") {
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
        document.cookie = "refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
      }
    }
  }
  async getCurrentUser(): Promise<User> {
    try {
      if (!tokenManager.isAuthenticated()) {
        throw new Error("No valid authentication token found");
      }
      const response = await api.get("/auth/me");
      if (!response.data) {
        throw new Error("No user data returned from server");
      }
      return response.data as User;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await this.logout();
        throw new Error("Session expired. Please log in again.");
      }
      if (error.response?.status === 403) {
        throw new Error("Access denied. Insufficient permissions.");
      }
      throw new Error(error.message || "Failed to fetch user information.");
    }
  }

  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  async refreshTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } =
        response.data.tokens || {};

      if (!accessToken || !newRefreshToken) {
        throw new Error("Invalid token response from server");
      }

      // Update cookies if backend doesn't set them automatically
      if (typeof window !== "undefined") {
        const isProduction = process.env.NODE_ENV === "production";
        const secureFlag = isProduction ? "secure" : "";
        const sameSite = "SameSite=Strict";
        
        document.cookie = `auth-token=${accessToken}; path=/; max-age=1800; ${sameSite}; ${secureFlag}`;
        document.cookie = `refresh-token=${newRefreshToken}; path=/; max-age=2592000; ${sameSite}; ${secureFlag}`;
      }

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      await this.logout();
      throw new Error("Token refresh failed. Please log in again.");
    }
  }

  // Check if token is about to expire (for proactive refresh)
  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = tokenManager.getAccessToken();
    if (!token) return true;
    return tokenManager.isTokenExpiringSoon(token, minutes);
  }
}

export const authAPI = new AuthService();
