import axios, { AxiosResponse } from "axios";
import { api } from "@/app/api/axios";
import { handleApiError } from "@/lib/errorHandler";
import { LoginResponse, OTPRegisterData, User } from "@/types/auth/register";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_AUTH_SERVICE;

// Timeout configuration - longer for serverless environments (Vercel cold starts)
const AUTH_TIMEOUT = process.env.NEXT_PUBLIC_AUTH_TIMEOUT
  ? parseInt(process.env.NEXT_PUBLIC_AUTH_TIMEOUT, 10)
  : process.env.NODE_ENV === 'production' ? 30000 : 15000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: AUTH_TIMEOUT, // 30s for production (Vercel cold starts), 15s for dev
  headers: { "Content-Type": "application/json" },
});
const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  if (typeof window === "undefined") return;
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}${secureFlag}${sameSite}`;
};

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};
export class AuthService {
  private _currentUser: User | null = null;
  private _normalizePhone(phone: string): string {
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      digits = digits.slice(1);
    }
    if (digits.startsWith("0")) {
      throw new Error("Phone number cannot start with zero");
    }
    return digits;
  }

  private _setCookies(accessToken: string, refreshToken: string) {
    setCookie("auth-token", accessToken, 30 * 60); // 30 min
    setCookie("refresh-token", refreshToken, 30 * 24 * 60 * 60); // 30 days
  }

  async sendOTP(phone: string): Promise<void> {
    try {
      const response = await axiosInstance.post(
        "/api/v2/authentication/userLogin",
        {
          phoneNo: this._normalizePhone(phone),
        }
      );
      const otp = response.data?.data?.otp;
      if (!otp) throw new Error("OTP not generated");
      await this.sendOTPviaTwilio(this._normalizePhone(phone), otp);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  private async sendOTPviaTwilio(phone: string, otp: string) {
    try {
      const normalizedPhone = this._normalizePhone(phone);
      await api.post(`sms/send_otp`, {
        to: normalizedPhone,
        body: `Your Allneeda verification code is ${otp}.`,
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyOTP(phone: string, otp: string): Promise<LoginResponse> {
    try {
      const normalizedPhone = this._normalizePhone(phone);

      const response = await axiosInstance.post(
        "/api/v2/authentication/verify_otp",
        {
          phoneNo: normalizedPhone,
          otp: otp.trim(),
        }
      );

      const data = response.data?.data || response.data;

      if (!data?.accessToken || !data?.refreshToken || !data?.user?._id) {
        throw new Error("Authentication failed. Invalid OTP.");
      }

      this._currentUser = data.user as User;
      this._setCookies(data.accessToken, data.refreshToken);

      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
  getCurrentUserId(): string {
    if (!this._currentUser?._id) throw new Error("User not authenticated");
    return this._currentUser._id;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    dob: string;
    businessType: string;
    isAgreeTermsConditions: boolean;
    status?: boolean;
  }): Promise<any> {
    try {
      const ROLE_ID = 10;

      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNo: data.phoneNo,
        dob: data.dob,
        isAgreeTermsConditions: data.isAgreeTermsConditions,
        role_id: ROLE_ID,
        status: data.status ?? true,
      };

      const response = await axiosInstance.post("/api/v2/user/create", payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async completeRegistration(
    data: OTPRegisterData,
    token: string
  ): Promise<AxiosResponse<unknown>> {
    try {
      const payload: any = {
        user_id: this.getCurrentUserId(),
        businessName: data.businessName,
        businessType: data.businessType,
        categories: data.categories,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        region: data.region,
        services_id: data.services_id || [],
        streetAddress: data.streetAddress,
        subCategories: data.subCategories || [],
        terms: data.terms,
        website: data.website ?? "",
      };

      return await api.post("/professionals/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      deleteCookie("auth-token");
      deleteCookie("refresh-token");
      throw handleApiError(error);
    }
  }
  decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload: string;

      if (typeof window !== "undefined" && typeof window.atob === "function") {
        jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
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
}

export const authAPI = new AuthService();
