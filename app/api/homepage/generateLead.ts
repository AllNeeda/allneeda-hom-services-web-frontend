  
import { api } from "../axios";

export const getServiceQuestion = async (service_id: string) => {
  const response = await api.get(`/questions/service/${service_id}`);
  return response.data;
};

export const generateLead = async (leadData: {
  serviceId: string;
  responses: Record<string, any>;
  professionalId?: string;
  professionalIds?: string[];
  userInfo: {
    email: string;
    phone: string;
    description?: string;
  };
  userLocation?: {
    city?: string;
    state?: string;
    postcode?: string;
  };
  sendOption: 'top5' | 'selected';
}) => {
  console.log("the lead Data posted: ", leadData);
  const response = await api.post("/lead/generate", leadData);
  console.log("this is the response: ", response);
  return response.data;
};

export const getProfessionalLead = async (professionalId: string) => {
  try {
    const response = await api.get(`/lead/professional-leads/${professionalId}`);
    return response.data; // { success, message, data }
  } catch (error: any) {
    // If backend sent a message, show it
    const message = error.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
};

export const getLeadDetails = async (LeadId: string) => {
  try {
    const response = await api.get(`/lead/${LeadId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch lead details: ${error}`);
  }
}
