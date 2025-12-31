import axios, { AxiosResponse } from "axios";
import { api } from "@/app/api/axios";
import { handleApiError } from "@/lib/errorHandler";
import { LoginResponse, OTPRegisterData, User } from "@/types/auth/register";

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

  async getRoles(): Promise<{ _id: string; name: string }[]> {
    try {
      const res = await axios.get(
        "https://generaluser-web-latest.onrender.com/api/v2/role/getAll/",
        { timeout: 15000 }
      );
      return res.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch roles", error);
      return [];
    }
  }

  private async getRoleIdForBusinessType(
    businessType: string
  ): Promise<string | undefined> {
    const roles = await this.getRoles();
    if (businessType === "home-services") {
      const professionalRole = roles.find(
        (r) => r.name.toLowerCase() === "professional"
      );
      return professionalRole?._id;
    }
    const customerRole = roles.find((r) => r.name.toLowerCase() === "customer");
    return customerRole?._id;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    dob: string;
    businessType: string;
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
        role_id: await this.getRoleIdForBusinessType(data.businessType),
        status: data.status ?? true,
      };
      console.log(" the data of user is", data);
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
      deleteCookie("auth-token");
      deleteCookie("refresh-token");
      deleteCookie("user-data");
      if (data.user_id) {
        try {
          await axios.delete(
            `https://generaluser-web-latest.onrender.com/api/v2/user/delete/${data.user_id}/`,
            { timeout: 15000 }
          );
        } catch (deleteError) {
          console.error(
            "Failed to delete user after registration failure",
            deleteError
          );
        }
      }
      throw handleApiError(error);
    }
  }
}

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};
export const authAPI = new AuthService();
