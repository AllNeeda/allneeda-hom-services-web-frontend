import { api } from "../axios";

import { handleApiError } from "@/lib/errorHandler";

export type BusinessHour = {
  day: number; // 0-6
  status?: string; // 'open' | 'closed' etc.
  start_time?: string; // ISO time hh:mm or ISO datetime
  end_time?: string;
  is_open?: boolean;
};

export interface UpdateProfessionalPayload {
  business_name?: string;
  introduction?: string;
  founded_year?: string | number;
  employees?: number | string;
  website?: string;
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  business_type?: string;
  business_hours?: BusinessHour[];
  payment_methods?: string[];
  // profile_image should be sent as FormData when uploading files
  [key: string]: unknown;
}

export type Professional = {
  _id?: string;
  business_name?: string;
  introduction?: string;
  profile_image?: string | null;
  founded_year?: string | number;
  employees?: number | string;
  website?: string;
  rating_avg?: number;
  total_review?: number;
  business_hours?: BusinessHour[];
  business_type?: string;
  [key: string]: unknown;
};
export const getProfessionalById = async (token: string) => {
  try {
    const response = await api.get("/professionals/pro", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProfessional = async (
  id: string,
  data: FormData | UpdateProfessionalPayload,
  token: string
): Promise<Professional> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/professionals/update_details/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    });
    return response.data as Professional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface ProMediaPayload {
  uploadedFiles: File[];
  videoLinks: string[];
  projectId?: string | null;
  userId?: string | null;
  source?: string;
}

export const createProMedia = async (
  formDataValues: ProMediaPayload,
  token: string,
  proId: string
) => {
  try {
    const {
      uploadedFiles = [],
      videoLinks = [],
      projectId,
      userId,
      source = "gallery",
    } = formDataValues;

    const formData = new FormData();

    uploadedFiles.forEach((file) => {
      formData.append("images", file);
    });

    videoLinks.forEach((link) => {
      formData.append("youtubeEmbed", link);
    });

    if (projectId) formData.append("projectId", projectId);
    if (userId) formData.append("userId", userId);
    formData.append("source", source);

    const res = await api.post(`/professionals/${proId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to upload media:", error);
    throw error;
  }
};

export const getProMediaById = async (proId: string, token: string) => {
  const response = await api.get(`/professionals/${proId}/media`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
  });
  return response;
};

export const postFeaturedService = async (
  token: string,
  formData: FormData
) => {
  try {
    const response = await api.post(
      `/professionals/featured-projects`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error uploading featured project:", error);
    throw error;
  }
};

export const getProFeaturedProject = async (
  professional_id: string,
  token: string
) => {
  try {
    const response = await api.get(
      `/professionals/featured-project/${professional_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "Application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading featured projects: ", error);
    throw error;
  }
};

export const getAllFAQ = async (professionalId: string, token: string) => {
  const response = await api.get(`/professionals/faq/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { professionalId },
  });

  return response.data;
};

export interface AnswerPayload {
  // Define known fields here; keep index signature for unknown fields
  question_id?: string;
  professional_id: string;
  answer?: string;
}

export const addAnswerService = async (
  answersData: AnswerPayload | AnswerPayload[],
  token: string
) => {
  const response = await api.put(`professionals/faq/answers`, answersData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getProfessionalDetailsById = async (proId: string) => {
  const response = await api.get(`professionals/${proId}`, {
    headers: {
      "Content-Type": "Application/json",
    },
  });
  console.log("The api response: ", response);
  return response;
};
