import { api } from "@/app/api/axios";
import axios from "axios";
import { handleApiError } from "@/lib/errorHandler";
import { LoginResponse, User } from "@/types/auth/register";

export type { User };

const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof window === "undefined") return;
  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "; secure" : "";
  const sameSite = "; SameSite=Strict";
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; expires=${expires.toUTCString()}${secureFlag}${sameSite}`;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

class AuthService {
  private _currentUser: User | null = null; // in-memory cache

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data;
      const { user, tokens } = data;

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error("Invalid email or password");
      }

      // Save tokens in cookies
      setCookie("auth-token", tokens.accessToken, 0.5); // 30 min
      setCookie("refresh-token", tokens.refreshToken, 30); // 30 days

      this._currentUser = user; // cache user
      return { user, tokens };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ------------------- LOGOUT -------------------
  async logout(): Promise<void> {
    try {
      deleteCookie("auth-token");
      deleteCookie("refresh-token");
      this._currentUser = null;
    } catch {
      deleteCookie("auth-token");
      deleteCookie("refresh-token");
      this._currentUser = null;
    }
  }

  // ------------------- GET CURRENT USER -------------------
  async getCurrentUser(): Promise<User | null> {
    try {
      let token = getCookie("auth-token");
      if (!token || this.isTokenExpiringSoon(token)) {
        const tokens = await this.refreshTokens();
        token = tokens.accessToken;
      }

      if (!token) return null;
      const decoded = this.decodeToken(token);
      const userId = decoded?.sub || decoded?.user_id;
      if (!userId) throw new Error("User ID not found in token");
      if (this._currentUser?._id === userId) return this._currentUser;
      const response =   await axios.get(`https://generaluser-web-latest.onrender.com/api/v2/user/getById/${userId}`);
      const userData = response.data?.data?.user || response.data;
      this._currentUser = userData as User;
      return this._currentUser;
    } catch  {
      return null;
    }
  }

  // ------------------- TOKEN REFRESH -------------------
  async refreshTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const refreshToken = getCookie("refresh-token");
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await api.post("/auth/refresh", { refreshToken });
      const tokens = response.data.tokens;
      if (!tokens?.accessToken || !tokens?.refreshToken)
        throw new Error("Invalid token response");
      setCookie("auth-token", tokens.accessToken, 0.5);
      setCookie("refresh-token", tokens.refreshToken, 30);
      return tokens;
    } catch (error) {
      await this.logout(); // force logout if refresh fails
      throw handleApiError(error);
    }
  }

  // ------------------- OTP -------------------
  async sendOTP(phone: string): Promise<void> {
    try {
      const normalizedPhone = phone.replace(/[^\d+]/g, "");
      await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/sendOtp/",
        { phoneNo: normalizedPhone },
        { timeout: 15000, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    try {
      const normalizedPhone = phone.replace(/[^\d+]/g, "");
      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/verify_otp/",
        { phoneNo: normalizedPhone, otp: otp.trim() },
        { timeout: 15000, headers: { "Content-Type": "application/json" } }
      );

      const data = response.data?.data || response.data;

      if (!data?.accessToken || !data?.refreshToken || !data?.user?._id) {
        throw new Error("Authentication failed. Invalid OTP.");
      }

      // Save tokens in cookies
      setCookie("auth-token", data.accessToken, 0.5);
      setCookie("refresh-token", data.refreshToken, 30);

      this._currentUser = data.user; // cache user
      return {
        user: data.user as User,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!getCookie("auth-token") || !!getCookie("refresh-token");
  }

  isTokenExpiringSoon(token?: string, minutes: number = 5): boolean {
    try {
      token = token || getCookie("auth-token") || "";
      if (!token) return true;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp - now <= minutes * 60;
    } catch {
      return true;
    }
  }
}

export const authAPI = new AuthService();
