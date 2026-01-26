import {  useQuery } from "@tanstack/react-query";
import {
  getAllServices,
  getFeaturedServices,
  getPopularServices,
  getSubcategoriesServices,
  getSubcategoryServicesBySlug,
  getTopProfessionals,
  loadUserLocation,
} from "@/app/api/homepage/popularService";
import { getLeadDetails, getProfessionalLead, getServiceQuestion } from "@/app/api/homepage/generateLead";
import { getCategoryServiceCount, getServices, getSubcategoryServiceCount } from "@/app/api/homepage/postServices";


export const usePopularServices = () => {
    return useQuery({
        queryKey: ["popularServices"],
        queryFn: getPopularServices,
        staleTime:5*60*1000,
    });
}

export const useSubcategoryServices = () => {
    return useQuery({
        queryKey: ["subcategoryServices"],
        queryFn: getSubcategoriesServices,
        staleTime: 5*60*1000,
    });
}

export const useFeaturedServices = () => {
    return useQuery({
        queryKey: ["featuredServices"],
        queryFn: getFeaturedServices,
        staleTime: 5*60*1000,
    });
}

export const useAllServices = () => {
  return useQuery ({
    queryKey: ['allServices'],
    queryFn: getAllServices,
    staleTime: 5*60*1000,
  });
}

// export const useSubcategories = () => {
//   return useQuery({
//     queryKey: ["subcategories"],
//     queryFn: getSubcategoriesServices,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

export const useSubcategoryServicesBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["subcategory", slug],
    queryFn: () => getSubcategoryServicesBySlug(slug),
    enabled: !!slug, // Only fetch when slug is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// user locaiton
export const useUserLocationStorage = () => {
  return useQuery({
    queryKey: ["userLocationData"],
    queryFn: async () => loadUserLocation(),
    // 👇 force query to run each mount (ignore cached data)
    refetchOnMount: true,
    staleTime: 0,
  });
};

// ==================================
//     get top 5 professionals
//===================================

export const useTopProfessionals = (service: string, zipcode: string) => {
  return useQuery({
    queryKey: ['topProfessionals', service, zipcode],
    queryFn: () => getTopProfessionals(service, zipcode),
    
    enabled: !!service && !!zipcode,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache persists)
    refetchOnWindowFocus: false, // ← This is the key fix!
    refetchOnMount: false, // Also prevent refetch on component mount if data exists
  });
};

//=================================================
//         get service questions
//=================================================

export const useServiceQuestions = (service_id:string) => {
  return useQuery({
    queryKey: ['serviceQuestions', service_id],
    queryFn: () => getServiceQuestion(service_id),
    enabled: !!service_id,
    staleTime: 5*60*1000,
  });
}

// =====================================================
//         get categories and its service count
//======================================================

export const useCategoryServiceCount = () => {
  return useQuery({
    queryKey: ['categoryServiceCount'],
    queryFn: () => getCategoryServiceCount(),
    staleTime: 5*60*1000,
  });
}

export const useSubcategoryServiceCount = () => {
  return useQuery({
    queryKey: ['subcategoryServiceCount'],
    queryFn: () => getSubcategoryServiceCount(),
    staleTime: 5*60*1000,
  });
}

export const useProfessionalLead = (professionalId: string,token: string, phoneNumber: string) => {
  return useQuery({
    queryKey: ["professionalLead", professionalId, token, phoneNumber],
    queryFn: () => getProfessionalLead(professionalId, token, phoneNumber),
    enabled: !!professionalId,
    staleTime: 5 * 60 * 1000,
  });
}

export const useLeadDetails = (LeadId: string, token: string) => {
  return useQuery({
    queryKey: ['LeadDetails', LeadId],
    queryFn: () => getLeadDetails(LeadId, token),
    enabled: !!LeadId,
    staleTime: 5*60*1000,
  });
}

export const useServices = () => {
  return useQuery ({
    queryKey: ['services'],
    queryFn: () => getServices(),
    staleTime: 5*60*1000,
  });
}