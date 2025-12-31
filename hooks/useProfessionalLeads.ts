import { professionalDetection } from "@/app/api/homepage/popularService";
import { GetProfessionalLeadsAPI } from "@/app/api/services/professionalLeads";
import { useQuery } from "@tanstack/react-query";

// Get Professional Leads 
export function useProfessionalLeads(token: string | null) {
  return useQuery({
    queryKey: ["professionalLeads"],
    queryFn: () => GetProfessionalLeadsAPI(token!),
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}

// --------detect the logged in user is professional or not-------
export function useProfessionalDetection(token: string | null, phone: string) {
  return useQuery({
    queryKey: ["detectionResult", phone],
    queryFn: () => professionalDetection(token, phone),
    enabled: !!phone,
    staleTime: 5*60*1000,
  });
}