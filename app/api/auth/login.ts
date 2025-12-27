import { api, tokenManager } from "@/app/api/axios";
import axios from "axios";
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  email?: string;
  username?: string;
  ReferralCode?: string;
  dob?: string;
  isAgreeTermsConditions?: boolean;
  role_id?: string;
  status?: boolean;
  Islogin_permissions?: boolean;
  Permissions_DeviceLocation?: boolean;
  hobby?: any[];
  RegistrationType?: string;
  invitedBy?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
  freeTrialPlan?: boolean;
  language_id?: string | null;
  country_id?: string | null;
  state_id?: string | null;
  city_id?: string | null;
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

// Helper functions for cookies
const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof window === "undefined") return;
  
  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "; secure" : "";
  const sameSite = "; SameSite=Strict";
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}${secureFlag}${sameSite}`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name && cookieValue) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};

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
      
      // Store tokens in cookies
      setCookie('auth-token', tokens.accessToken, 0.5); // 30 minutes
      setCookie('refresh-token', tokens.refreshToken, 30); // 30 days
      
      // Store user data in cookie (serialized)
      setCookie('user-data', JSON.stringify(user), 1); // 1 day

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
        
        let message = "Login failed";
        if (responseData) {
          if (responseData.message) {
            message = responseData.message;
          } else if (responseData.error) {
            message = responseData.error;
          } else if (responseData.detail) {
            message = responseData.detail;
          } else if (responseData.title) {
            message = responseData.title;
          } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
            message = responseData.errors
              .map((err: any) => err.message || err.msg || err.error || String(err))
              .join(", ");
          } else if (typeof responseData === "string") {
            message = responseData;
          }
        }
        
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
      // Clear all cookies
      removeCookie('auth-token');
      removeCookie('refresh-token');
      removeCookie('user-data');
      await tokenManager.clearTokens();
    } catch {
      console.warn("Logout API call failed, clearing cookies anyway");
      removeCookie('auth-token');
      removeCookie('refresh-token');
      removeCookie('user-data');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      // First try to get user from cookie
      const userDataCookie = getCookie('user-data');
      if (userDataCookie) {
      
        const user = JSON.parse(userDataCookie) as User;
          return user;
    
      }
      
      // If no user cookie but authenticated, try to get from token/API
      if (!this.isAuthenticated()) {
        throw new Error("No valid authentication token found");
      }
      
      const token = tokenManager.getAccessToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Decode token to get user ID
      const decoded = this.decodeToken(token);
      const userId = decoded?.sub || decoded?.userId || decoded?.user_id;
      
      if (!userId) {
        throw new Error("User ID not found in token");
      }
      const response = await api.get(`/user/getById/${userId}`);
      
      if (!response.data) {
        throw new Error("No user data returned from server");
      }
      
      const userData = response.data.data?.user || response.data.user || response.data;
      
      if (!userData || !userData._id) {
        throw new Error("Invalid user data received");
      }
      
      // Store the fetched user in cookie for future use
      setCookie('user-data', JSON.stringify(userData), 1);
      
      return userData as User;
      
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch user information.");
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
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

      // Update cookies
      setCookie('auth-token', accessToken, 0.5);
      setCookie('refresh-token', newRefreshToken, 30);

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      await this.logout();
      throw new Error("Token refresh failed. Please log in again.");
    }
  }
  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = tokenManager.getAccessToken();
    if (!token) return true;
    return tokenManager.isTokenExpiringSoon(token, minutes);
  }

  async sendOTP(phone: string): Promise<void> {
    try {
      const normalizedPhone = phone.replace(/[\s\-()]/g, "");
      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/sendOtp/",
        { phoneNo: normalizedPhone },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    try {
      const normalizedPhone = phone.replace(/[\s\-()]/g, "");
      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/verify_otp/",
        { 
          phoneNo: normalizedPhone,
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
      const data = responseData.data || responseData;
      const user = data?.user;
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid OTP or authentication failed - no tokens received");
      }
      if (!user || !user._id) {
        throw new Error("Invalid OTP or authentication failed - no user data received");
      }
      setCookie('auth-token', accessToken, 0.5); // 30 minutes
      setCookie('refresh-token', refreshToken, 30); // 30 days
      setCookie('user-data', JSON.stringify(user), 1); // 1 day
      return {
        user: user as User,
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken,
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