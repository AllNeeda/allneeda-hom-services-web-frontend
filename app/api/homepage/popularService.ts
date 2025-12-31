import { LocationData } from "@/types/location";
import { api } from "../axios";
export const getPopularServices = async () => {
    try {
        const response = await api.get('/popular-services');
        return response.data;
    } catch (error) {
        console.log("Error: ", error);
    }
}

export const getSubcategoriesServices = async () => {
    try {
        const response = await api.get('/subcategory-services');
        return response.data;
    } catch (error) {
        console.log("Error fetching subcategories' services", error);
    }
}

export const getFeaturedServices = async () => {
    try {
        const response = await api.get('/services/featured');
        return response.data;
    }catch(error) {
        console.log("Error getting featured services: ", error);
    }
}

export const getAllServices = async () => {
    try {
        const response = await api.get('/services');
        return response.data;
    } catch (error) {
        console.log("Error getting services: ", error);
    }
}

export const getSubcategoryServicesBySlug = async (slug: string) => {
  // Add validation
  if (!slug || slug.trim() === '') {
    console.error("Invalid slug provided");
    return null;
  }
  
  try {
    const response = await api.get(`/subcategories/${slug}`);
    return response.data;
  } catch(error) {
    console.log("Error getting subcategory services: ", error);
    throw error; // Re-throw to handle in calling function
  }
}

export const createUserLocationById = async (
  userLocationData: LocationData, 
  userId: string, 
  token: string
) => {
  const response = await api.post(`/location/user/${userId}/create`, {
    ...userLocationData,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const getUserLocation = async (userId: string, token: string) => {
  const response = await api.get(`/location/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
// fetch professionals
export const getTopProfessionals = async (service_id: string, zipcode: string) => {
  const response = await api.get(`/providers?service=${service_id}&zipcode=${zipcode}`);
  return response; // ✅ Only return useful data to React Query
};


// ======================================================
//       Handling user location in localStorage
//=======================================================

export const loadUserLocation = async (): Promise<LocationData> => {

  const storedUserLocationRaw = localStorage.getItem("user_location");

  if (storedUserLocationRaw) {
    const userLocation = JSON.parse(storedUserLocationRaw);
    return userLocation;
  }
  const storedDefaultLocationRaw = localStorage.getItem("defaultLocation");
  const defaultLocation = storedDefaultLocationRaw
    ? JSON.parse(storedDefaultLocationRaw)
    : {
        city: "New York",
        state: "NY",
        country: "USA",
        zipcode: "10001",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        type: "default",
      };

  localStorage.setItem("user_location", JSON.stringify(defaultLocation));

  return defaultLocation;
};

// ----------Detect the logged-in user is professional or not--------------
export const professionalDetection = async (token: string | null, phone: string) => {
  const response = await api.get(`lead/${phone}/detection`,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log("The api response: ", response);
  return response;
}