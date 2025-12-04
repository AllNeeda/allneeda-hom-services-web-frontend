import { handleApiError } from "@/lib/errorHandler";
import { api } from "../axios"
import { AnswerPayload, LocationPayload } from "@/hooks/useServices";

// Get Professional Services or services of a professional
export const GetProfessionalServicesAPI = async (token: string) => {
  try {
    const response = await api.get(`/services/services-management`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update Service Status API
export const UpdateServiceStatusAPI = async (data: { service_id: string; professional_id: string; service_status: boolean; token: string; }) => {
  const { service_id, professional_id, service_status, token } = data;

  try {
    const response = await api.put(`/services/service_status`,
      {
        service_id: service_id,
        professional_id: professional_id,
        service_status: service_status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const GetServicesAPI = async (token: string) => {
  try {
    const response = await api.get(`/services/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get Services Hook
export const getProfessionalStepsAPI = async (token: string) => {
  try {
    const response = await api.get("/professionals/professional_steps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const AddNewServiceAPI = async (data: { service_name: string; service_id: string, professional_id: string },
  token: string
) => {
  try {
    const response = await api.post(
      `/services/create_service`,
      { service_name: data.service_name, service_id: data.service_id, professional_id: data.professional_id },
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

export const UseServicePricingAPI = async (data: {
  service_id: string; professional_id: string; pricing_type: string; minimum_price: string;
  maximum_price: string;
  completed_tasks: string;
  description: string;
},
  token: string
) => {
  try {
    const response = await api.put(
      `/services/pricing`,
      {
        service_id: data.service_id, professional_id: data.professional_id, pricing_type: data.pricing_type, minimum_price: data.minimum_price,
        maximum_price: data.maximum_price, completed_tasks: data.completed_tasks, description: data.description,
      }, {
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


// Get Services Questions by Service ID
export const UseGetServicesQuestionAPI = async (token: string, serviceId: string) => {
  try {
    const id = serviceId
    const response = await api.get(`/services/service_questions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Submit Service Questions Answers API
export const UseSubmitQuestionAnswerAPI = async (data: AnswerPayload[], token: string) => {
  try {
    const response = await api.put(`/services/answers_submit`, data, {
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


// Adding the Location of Service API
export const SaveServiceLocationAPI = async (payload: LocationPayload, token: string) => {
  try {
    const response = await api.put(
      "/services/service_location",
      {
        professional_id: payload.professional_id, service_id: payload.service_id,
        lat: payload.lat,
        lng: payload.lng,
        city: payload.city,
        state: payload.state,
        zip: payload.zip,
        radius_miles: payload.radiusMiles,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



// deleting the service
export const DeleteServiceAPI = async (service_id: string, professional_id: string, token: string) => {
  try {
    const response = await api.delete("/services/delete_service", {
      data: {
        service_id,
        professional_id
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Edit or Update the service prcing and name....
export const GetServiceByIdAPI = async (
  service_id: string,
  professional_id: string,
  token: string
) => {
  try {
    const response = await api.get("/services/get_service", {
      params: {
        service_id,
        professional_id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Edit or Update the service prcing and name....
export const GetServiceLocationByIdAPI = async (
  service_id: string,
  professional_id: string,
  location_id: string,
  token: string
) => {
  try {
    const response = await api.get("/services/get_servicelocation", {
      params: {
        service_id,
        professional_id,
        location_id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Update Service Location
export const SaveUpdateServiceLocationAPI = async (payload: LocationPayload, token: string) => {
  try {
    const response = await api.put(
      "/services/updateservice_location",
      {
        professional_id: payload.professional_id, location_id: payload.location_id,
        lat: payload.lat,
        lng: payload.lng,
        city: payload.city,
        state: payload.state,
        zip: payload.zip,
        radius_miles: payload.radiusMiles,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



// delete serivce
export const DeleteServiceLocationAPI = async (
  location_id: string,
  token: string
) => {
  try {
    console.log("the location id is", location_id)
    const response = await api.delete("/services/delete_serviceLocation", {
      data: {
        location_id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

