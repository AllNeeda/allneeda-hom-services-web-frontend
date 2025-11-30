import { RegisterFormData, RegisterResponse } from "@/types/auth/register";
import { api } from "../axios";
import { handleApiError } from "@/lib/errorHandler";

export const registerUserAPI = async (
  data: RegisterFormData
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>(
      "/professionals/register",
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const UpdateBusinessName = async (
  data: { businessName: string; id: string },
  token: string
) => {
  try {
    const response = await api.put(
      `/professionals/update-business-name/${data.id}`,
      { business_name: data.businessName },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// API for Creating Account - Professional Business Info - Step 04
export interface BusinessInfoPayload {
  businessType: "company" | "individual" | "sub-contractor";
  employees?: string | number | null;
  founded?: string | number | null;
  about?: string | null;
  profile?: File | null;
  id: string | null;
}

export const saveBusinessInfoAPI = async (
  data: BusinessInfoPayload,
  token: string
) => {
  try {
    const formData = new FormData();
    formData.append("businessType", data.businessType);
    if (data.employees) formData.append("employees", String(data.employees));
    if (data.founded) formData.append("founded", String(data.founded));
    if (data.about) formData.append("about", data.about);
    if (data.profile) formData.append("profile", data.profile);
    if (data.id) formData.append("id", data.id);
    const response = await api.put(
      `/professionals/businessInfo/${data.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// End of API for Creating Account - Professional Business Info - Step 04

// API for Creating Professional Account Step 07
export interface Shift {
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface ScheduleDay {
  dayOfWeek: number;
  day: string;
  shifts: Shift[];
}

export interface BusinessAvailabilityPayload {
  id: string;
  schedule: ScheduleDay[]; // send as array, NOT string
  timezone: string;
}

export const BusinesAvailabilityAPI = async (
  data: BusinessAvailabilityPayload,
  token: string
) => {
  try {
    const response = await api.put(
      `/professionals/availability/${data.id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get Professional Services Question  Step 08
export const getProServicesQuestionsAPI = async (token: string) => {
  try {
    const response = await api.get("/professionals/questionsAnswers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
// End of Get Professional Account Step 08

// Professional Account Registeration Step 08
export interface AnswerPayload {
  question_id: string;
  answer: string | string[];
}
export const submitServiceAnswersAPI = async (
  data: AnswerPayload[],
  token: string
) => {
  try {
    const response = await api.post("/professionals/services-answers", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Create Professional Step 09
export interface LocationData {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  zip?: string;
  radiusMiles: number;
  isLoading: boolean;
  professional_id: string;
  service_id: string;
}
export const saveLocationAPI = async (data: LocationData, token: string) => {
  try {
    const response = await api.post("/professionals/servicesLocation", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Get Professional Only Details For All

// Check the Progress Account of Professional //
export const ProfessionalProgressAPI = async (token: string) => {
  try {
    const response = await api.get("/professionals/progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};