import { api } from "../axios";
import { LicensePayload } from "@/types/professionalLicenseTypes";


export const postProfessionalLicense = async (licenseData: LicensePayload, token: string) => {
  try {
    console.log(token)
    const response = await api.post(
      "/professionals/licenses",
      licenseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Server Error:", error.response?.data);
    throw new Error(`Failed to post professional license: ${error}`);
  }
};





export const getLicenseTypes = async () => {
    try {
        const response = await api.get("/professionals/license-types");
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch license types: ${error}`);
    }
}

export const getLocations = async () => {
    try {
        const response = await api.get("/location/all");    
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch location states: ${error}`);
    }
}

export const getProfessionalLicenseById = async (professional_id: string, token: string) => {
  try {
      const response = await api.get(`/professionals/licenses/${professional_id}`,{
       
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
        },
      });
      return response.data;

  } catch (error) { 
    throw new Error(`Failed to get the professional license: ${error}`)
  }
}