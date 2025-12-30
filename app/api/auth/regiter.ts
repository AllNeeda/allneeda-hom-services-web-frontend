import axios, { AxiosResponse } from "axios";
import { api } from "@/app/api/axios";
import { OTPRegisterData } from "@/hooks/RegisterPro/useUserRegister";
import { handleApiError } from "@/lib/errorHandler";
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
class AuthService {
  async sendOTP(phone: string): Promise<void> {
    try {
      const normalizedPhone = phone.replace(/[^\d+]/g, "");

      await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/authentication/sendOtp/",
        { phoneNo: normalizedPhone },
        {
          timeout: 15000,
          headers: { "Content-Type": "application/json" },
        }
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
        {
          phoneNo: normalizedPhone,
          otp: otp.trim(),
        },
        {
          timeout: 15000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data?.data || response.data;

      if (!data?.accessToken || !data?.refreshToken || !data?.user?._id) {
        throw new Error("Authentication failed. Invalid OTP.");
      }
      setCookie("auth-token", data.accessToken, 0.5); // 30 minutes
      setCookie("refresh-token", data.refreshToken, 30); // 30 days
      setCookie("user-data", JSON.stringify(data.user), 1); // 1 day
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

  async createUser(data: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    dob: string;
    isAgreeTermsConditions: boolean;
    role_id?: string;
    status?: boolean;
  }): Promise<any> {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNo: data.phoneNo,
        dob: data.dob,
        isAgreeTermsConditions: data.isAgreeTermsConditions,
        role_id: data.role_id || "77547a76-5d43-4c31-9c0d-5cda12bfe960",
        status: data.status ?? true,
      };

      const response = await axios.post(
        "https://generaluser-web-latest.onrender.com/api/v2/user/create/",
        payload,
        {
          timeout: 15000,
          headers: { "Content-Type": "application/json" },
        }
      );

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
      const payload = {
        user_id: data.user_id || undefined,
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
        username: data.username,
        website: data.website ?? "",
      };
      const response = await api.post("/professionals/register", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
export const authAPI = new AuthService();
