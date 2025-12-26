// app/api/auth.ts
import { api, tokenManager } from "@/app/api/axios";
import axios from "axios";

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
      if (typeof window !== "undefined") {
        const isProduction = process.env.NODE_ENV === "production";
        const secureFlag = isProduction ? "secure" : "";
        const sameSite = "SameSite=Strict";
        document.cookie = `auth-token=${tokens.accessToken}; path=/; max-age=1800; ${sameSite}; ${secureFlag}`;
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

  /**
   * Send OTP to phone number
   * @param phone - Phone number in international format
   * @returns Promise that resolves when OTP is sent successfully
   */
  async sendOTP(phone: string): Promise<void> {
    try {
      // Normalize phone number (remove spaces, dashes, etc.)
      const normalizedPhone = phone.replace(/[\s\-()]/g, "");
      // Use external OTP API endpoint with direct axios call
      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/sendOtp/",
        { phone: normalizedPhone },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response indicates success
      if (response.status >= 200 && response.status < 300) {
        return;
      }

      throw new Error("Failed to send OTP");
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        let message = "Failed to send OTP. Please try again.";
        
        if (responseData) {
          if (responseData.message) {
            message = responseData.message;
          } else if (responseData.error) {
            message = responseData.error;
          } else if (responseData.detail) {
            message = responseData.detail;
          } else if (typeof responseData === "string") {
            message = responseData;
          }
        }
        
        // Status-specific error messages
        if (message === "Failed to send OTP. Please try again.") {
          switch (status) {
            case 400:
              message = "Invalid phone number format";
              break;
            case 429:
              message = "Too many OTP requests. Please wait before requesting again";
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
          error.message || "An unexpected error occurred while sending OTP."
        );
      }
    }
  }

  /**
   * Verify OTP and complete phone login
   * @param phone - Phone number in international format
   * @param otp - 6-digit OTP code
   * @returns LoginResponse with user data and tokens
   */
  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    try {
      // Normalize phone number
      const normalizedPhone = phone.replace(/[\s\-()]/g, "");
      
      // Verify OTP using external API with direct axios call
      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/verify_otp/",
        { 
          phone: normalizedPhone,
          otp: otp.trim()
        },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      
      // Extract tokens and user data from response
      // The response structure may vary, so we handle multiple formats
      const tokens = responseData.tokens || responseData.data?.tokens || responseData;
      const user = responseData.user || responseData.data?.user || responseData.data;
      
      if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
        throw new Error("Invalid OTP or authentication failed");
      }

      // Set tokens as cookies (same as regular login)
      if (typeof window !== "undefined") {
        const isProduction = process.env.NODE_ENV === "production";
        const secureFlag = isProduction ? "secure" : "";
        const sameSite = "SameSite=Strict";
        
        // Set access token (30 minutes)
        document.cookie = `auth-token=${tokens.accessToken}; path=/; max-age=1800; ${sameSite}; ${secureFlag}`;
        // Set refresh token (30 days)
        document.cookie = `refresh-token=${tokens.refreshToken}; path=/; max-age=2592000; ${sameSite}; ${secureFlag}`;
      }

      // If user data is not in response, fetch it using the token
      let userData = user;
      if (!userData || !userData._id) {
        // Try to get user data from the main API using the new token
        try {
          const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1/";
          const userResponse = await axios.get(`${apiBaseURL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          });
          userData = userResponse.data;
        } catch {
          // If fetching user fails, construct a minimal user object
          userData = {
            _id: responseData.userId || responseData.id || "unknown",
            email: responseData.email || normalizedPhone,
            username: responseData.username || normalizedPhone,
          };
        }
      }

      return {
        user: userData as User,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        let message = "Invalid OTP. Please try again.";
        
        if (responseData) {
          if (responseData.message) {
            message = responseData.message;
          } else if (responseData.error) {
            message = responseData.error;
          } else if (responseData.detail) {
            message = responseData.detail;
          } else if (typeof responseData === "string") {
            message = responseData;
          }
        }
        
        // Status-specific error messages
        if (message === "Invalid OTP. Please try again.") {
          switch (status) {
            case 400:
              message = "Invalid OTP format";
              break;
            case 401:
              message = "Invalid or expired OTP. Please request a new one";
              break;
            case 404:
              message = "Phone number not found";
              break;
            case 429:
              message = "Too many verification attempts. Please wait before trying again";
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
          error.message || "An unexpected error occurred while verifying OTP."
        );
      }
    }
  }
}

export const authAPI = new AuthService();
