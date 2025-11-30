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
