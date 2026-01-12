import axios, { AxiosResponse } from "axios";
import { api } from "@/app/api/axios";
import { handleApiError } from "@/lib/errorHandler";
import { LoginResponse, OTPRegisterData, User } from "@/types/auth/register";

class AuthService {
  private _currentUser: User | null = null;
  async sendOTP(phone: string): Promise<void> {
    try {
      const normalizedPhone = phone.replace(/[^\d+]/g, "");
      await axios.post(
        "https://vercel-mr-amani-backend.vercel.app/api/v2/authentication/userLogin",
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
        "https://vercel-mr-amani-backend.vercel.app/api/v2/authentication/verify_otp",
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
  const user_id = data.user?._id || data.user?.id;
  console.log("OTP User Id is response data:", user_id);

      if (!data?.accessToken || !data?.refreshToken || !data?.user?._id) {
        throw new Error("Authentication failed. Invalid OTP.");
      }
      if (typeof window !== "undefined") {
        const secureFlag =
          process.env.NODE_ENV === "production" ? "; Secure" : "";
        const sameSite = "; SameSite=Strict";
        document.cookie = `auth-token=${encodeURIComponent(
          data.accessToken
        )}; Path=/; Max-Age=${30 * 60}${secureFlag}${sameSite}`;
        document.cookie = `refresh-token=${encodeURIComponent(
          data.refreshToken
        )}; Path=/; Max-Age=${30 * 24 * 60 * 60}${secureFlag}${sameSite}`;
      }

      this._currentUser = data.user as User;

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


  getCurrentUserId(): string {
  if (!this._currentUser || !this._currentUser._id ) {
    throw new Error("User not authenticated");
  }
  return this._currentUser._id;
}


  async getRoles(): Promise<any[]> {
    try {
      const res = await axios.get(
        "https://vercel-mr-amani-backend.vercel.app/api/v2/role/getAll",
        { timeout: 15000 }
      );
      return res.data?.data || [];
    } catch {
      return [];
    }
  }

  private async getRoleIdForBusinessType(
    businessType: string
  ): Promise<number | undefined> {
    const roles = await this.getRoles();
    if (businessType === "home-services") {
      const professionalRole = roles.find(
        (r: any) => String(r.name).toLowerCase() === "professional"
      );
      if (!professionalRole) return undefined;
      const candidate = professionalRole.role_id ?? professionalRole.id ?? professionalRole.roleId;
      if (candidate == null) return undefined;
      const num = Number(candidate);
      return Number.isFinite(num) ? num : undefined;
    }
    return undefined;
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    dob: string;
    businessType: string;
    isAgreeTermsConditions: boolean;
    role_id?: string | number;
    status?: boolean;
  }): Promise<any> {
    try {
      let roleIdToUse: string | number | undefined;
      const incomingRoleObj: any = (data.role_id && typeof data.role_id === "object")
        ? data.role_id
        : (data as any).role && typeof (data as any).role === "object"
        ? (data as any).role
        : undefined;

      if (incomingRoleObj) {
        if (incomingRoleObj.role_id != null) {
          const num = Number(incomingRoleObj.role_id);
          roleIdToUse = Number.isFinite(num) ? num : undefined;
        } else if (incomingRoleObj._id) {
          try {
            const roles = await this.getRoles();
            const match = roles.find((r: any) => String(r._id) === String(incomingRoleObj._id));
            if (match && match.role_id != null) {
              roleIdToUse = Number(match.role_id);
            }
          } catch {
            roleIdToUse = undefined;
          }
        }
      } else {
        roleIdToUse = data.role_id as string | number | undefined;
      }

      if (!roleIdToUse) {
        const inferred = await this.getRoleIdForBusinessType(data.businessType);
        roleIdToUse = inferred;
      }
      if (
        roleIdToUse &&
        typeof roleIdToUse === "string" &&
        !/^\d+$/.test(roleIdToUse)
      ) {
        const roleString = roleIdToUse as string;
        try {
          const roles = await this.getRoles();
          const byId = roles.find((r: any) => String(r._id) === roleString);
          if (byId && byId.role_id != null) {
            roleIdToUse = Number(byId.role_id);
          } else {
            const byName = roles.find(
              (r: any) => String(r.name).toLowerCase() === roleString.toLowerCase()
            );
            if (byName && byName.role_id != null) {
              roleIdToUse = Number(byName.role_id);
            } else {
              const coerced = Number(roleString);
              roleIdToUse = Number.isFinite(coerced) ? coerced : undefined;
            }
          }
        } catch {
          roleIdToUse = undefined;
        }
      }

      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNo: data.phoneNo,
        dob: data.dob,
        isAgreeTermsConditions: data.isAgreeTermsConditions,
        status: data.status ?? true,
      };
      const resolvedRoleNumeric =
        typeof roleIdToUse === "number"
          ? roleIdToUse
          : typeof roleIdToUse === "string" && /^\d+$/.test(roleIdToUse)
          ? Number(roleIdToUse)
          : undefined;

      if (resolvedRoleNumeric != null && Number.isFinite(resolvedRoleNumeric)) {
        payload.role_id = Number(resolvedRoleNumeric);
        payload.role = { role_id: Number(resolvedRoleNumeric) };
      }
      const response = await axios.post(
        "https://vercel-mr-amani-backend.vercel.app/api/v2/user/create",
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
       const payload: any = {
        user_id:  this.getCurrentUserId(),
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
      const response = await api.post("/professionals/register", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      deleteCookie("auth-token");
      deleteCookie("refresh-token");
      throw handleApiError(error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      let jsonPayload: string;
      if (typeof window !== "undefined" && typeof (window as any).atob === "function") {
        jsonPayload = decodeURIComponent(
          (window as any).atob(base64)
            .split("")
            .map((c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
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

const deleteCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};
export const authAPI = new AuthService();
