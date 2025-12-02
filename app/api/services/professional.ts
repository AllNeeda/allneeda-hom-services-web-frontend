import {api} from "../axios";
import { ProfessionalFormData } from "@/schemas/professional/professional";
import { handleApiError } from "@/lib/errorHandler";

export type Professional = {
  id: string;
  introduction: string;
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
  data: ProfessionalFormData,
  token: string
): Promise<Professional> => {
  try {
    const response = await api.put(`/professionals/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

interface ProMediaPayload {
  uploadedFiles: File[];
  videoLinks: string[];
  projectId?: string | null;
  userId?: string | null;
  source?: string;
}


export const createProMedia = async (formDataValues:ProMediaPayload, token:string, proId:string) => {
  try {
    const { uploadedFiles = [], videoLinks = [], projectId, userId, source = "gallery" } = formDataValues;

    const formData = new FormData();

    uploadedFiles.forEach(file => {
      formData.append("images", file); 
    });

    videoLinks.forEach(link => {
      formData.append("youtubeEmbed", link);
    });

  
    if (projectId) formData.append("projectId", projectId);
    if (userId) formData.append("userId", userId);
    formData.append("source", source);

    const res = await api.post(
      `/professionals/${proId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Failed to upload media:", error);
    throw error;
  }
};


export const getProMediaById = async (proId: string, token:string) => {
    const response = await api.get(`/professionals/${proId}/media`,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json",
      },
    });
    return response;
}


export const postFeaturedService = async (token: string, formData: FormData) => {
  try {
    const response = await api.post(`/professionals/featured-projects`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading featured project:", error);
    throw error;
  }
};

export const getProFeaturedProject = async (professional_id: string, token: string) => {
  try {
    const response = await api.get(`/professionals/featured-project/${professional_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading featured projects: ", error);
    throw error;
  }
}

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

export const addAnswerService = async (answersData: AnswerPayload | AnswerPayload[], token: string) => {

    const response = await api.put(`professionals/faq/answers`, answersData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
}