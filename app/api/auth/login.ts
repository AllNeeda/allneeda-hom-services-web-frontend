import { api } from "@/app/api/axios";
import axios from "axios";
import { handleApiError } from "@/lib/errorHandler";
import { LoginResponse, User } from "@/types/auth/register";

const USE_REFRESH_ENDPOINT =
  process.env.NEXT_PUBLIC_ENABLE_REFRESH_ENDPOINT === "true";
const base_url = process.env.NEXT_PUBLIC_API_BASE_AUTH_SERVICE;

// Validate base_url on module load (only log warning, don't throw to allow graceful degradation)
if (typeof window !== "undefined" && !base_url) {
  console.warn(
    "⚠️ NEXT_PUBLIC_API_BASE_AUTH_SERVICE is not configured. Authentication may not work."
  );
}

const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number = 30 * 24 * 60 * 60
) => {
  if (typeof window === "undefined") return;
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const sameSite = "; SameSite=Strict"; // Use Lax if cross-site GET navigations are needed
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${Math.floor(maxAgeSeconds)}${secureFlag}${sameSite}`;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";
  document.cookie = `${name}=; Path=/; Max-Age=0${secureFlag}${sameSite}`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const cookieName = name;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    if (!c) continue;
    const [k, ...rest] = c.split("=");
    if (k === cookieName) return decodeURIComponent(rest.join("="));
  }
  return null;
};

class AuthService {
  private _currentUser: User | null = null; // in-memory cache

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      if (!base_url) {
        const error = new Error(
          "Authentication service URL is not configured. Please set NEXT_PUBLIC_API_BASE_AUTH_SERVICE environment variable."
        );
        console.error(error.message);
        throw error;
      }

      const loginUrl = `${base_url}/api/v2/authentication/userLogin`;
      const response = await axios.post(loginUrl, credentials, {
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      });

      const resp = response.data?.data || response.data;

      const user = resp.user ?? resp;
      const tokens = resp.tokens ?? {
        accessToken: resp.accessToken,
        refreshToken: resp.refreshToken,
      };

      if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error("Invalid email or password");
      }

      setCookie("auth-token", tokens.accessToken, 30 * 60); // 30 minutes
      setCookie("refresh-token", tokens.refreshToken, 30 * 24 * 60 * 60); // 30 days

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
      if (!base_url) {
        console.warn(
          "⚠️ Authentication service URL not configured, cannot get current user"
        );
        return null;
      }

      let token = getCookie("auth-token");
      if (!token || this.isTokenExpiringSoon(token)) {
        if (!USE_REFRESH_ENDPOINT) {
          // Refresh route not available; return unauthenticated so caller can prompt login
          return null;
        }
        const tokens = await this.refreshTokens();
        token = tokens.accessToken;
      }

      if (!token) return null;
      const decoded = this.decodeToken(token);
      const userId = decoded?._id || decoded?.id;
      if (!userId) throw new Error("User ID not found in token");
      if (this._currentUser?._id === userId) return this._currentUser;

      const response = await axios.get(
        `${base_url}/api/v2/user/getById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
          validateStatus: (status) => status < 500,
        }
      );
      const respData = response.data?.data || response.data;
      let userData: any = null;
      if (respData && typeof respData === "object") {
        if (respData.user) {
          userData = respData.user;
        } else {
          userData = respData;
        }
      }

      this._currentUser = userData as User;
      return this._currentUser;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  // ------------------- TOKEN REFRESH -------------------
  async refreshTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (!USE_REFRESH_ENDPOINT) {
      await this.logout();
      throw new Error("Refresh endpoint disabled by configuration");
    }
    try {
      const refreshToken = getCookie("refresh-token");
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await api.post("/auth/refresh", { refreshToken });
      const tokens = response.data.tokens;
      if (!tokens?.accessToken || !tokens?.refreshToken)
        throw new Error("Invalid token response");
      setCookie("auth-token", tokens.accessToken, 30 * 60);
      setCookie("refresh-token", tokens.refreshToken, 30 * 24 * 60 * 60);
      return tokens;
    } catch (error) {
      await this.logout(); // force logout if refresh fails
      throw handleApiError(error);
    }
  }

  normalizeTo10DigitPhone = (phone: string): string => {
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }
    if (digits.startsWith("0")) {
      throw new Error("Phone number cannot start with zero");
    }
    return digits;
  };

  async sendOTP(phone: string): Promise<void> {
    try {
      if (!base_url) {
        throw new Error("Authentication service URL is not configured");
      }

      const normalizedPhone = this.normalizeTo10DigitPhone(phone);
      await axios.post(
        `${base_url}/api/v2/authentication/userLogin`,
        { phoneNo: normalizedPhone },
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status < 500,
        }
      );
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    try {
      if (!base_url) {
        throw new Error("Authentication service URL is not configured");
      }

      const normalizedPhone = this.normalizeTo10DigitPhone(phone);
      const response = await axios.post(
        `${base_url}/api/v2/authentication/verify_otp`,
        { phoneNo: normalizedPhone, otp: otp.trim() },
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status < 500,
        }
      );

      const data = response.data?.data || response.data;

      if (!data?.accessToken || !data?.refreshToken || !data?.user?._id) {
        throw new Error("Authentication failed. Invalid OTP.");
      }

      setCookie("auth-token", data.accessToken, 30 * 60); // 30 minutes
      setCookie("refresh-token", data.refreshToken, 30 * 24 * 60 * 60); // 30 days
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
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      // atob is available in browsers; in Node use Buffer
      let jsonPayload: string;
      if (
        typeof window !== "undefined" &&
        typeof (window as any).atob === "function"
      ) {
        jsonPayload = decodeURIComponent(
          (window as any)
            .atob(base64)
            .split("")
            .map(
              (c: string) =>
                "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
            )
            .join("")
        );
      } else {
        jsonPayload = Buffer.from(base64, "base64").toString("utf8");
      }
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
      const payload = this.decodeToken(token);
      const exp = payload?.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp - now <= minutes * 60;
    } catch {
      return true;
    }
  }
}

export const authAPI = new AuthService();
