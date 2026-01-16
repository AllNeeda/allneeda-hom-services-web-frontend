import { getLicenseTypes, getLocations, getProfessionalLicenseById } from "@/app/api/dashboard/professionalLicense"
import { getAllFAQ, getProFeaturedProject, getProMediaById } from "@/app/api/services/professional";
import { useQuery } from "@tanstack/react-query"

export const useLicenseTypes = () => {
    return useQuery({
        queryKey: ['licenseTypes'],
        queryFn: () => getLicenseTypes(),
        staleTime: 10 * 60 * 1000,
    });
}

export const useLocation = () => {
    return useQuery({
        queryKey: ['LocationData'],
        queryFn: () => getLocations(),
        staleTime: 10 * 60 * 1000,
    })
}

export const useProfessionalLicense = (proId:string, token:string) => {
    return useQuery({
        queryKey: ['professionalLicense', proId, token],
        queryFn: () => getProfessionalLicenseById(proId, token),
    staleTime: 10*60*1000,
    enabled: Boolean(proId && token),
    });
}

export const useProfessionalMedia = (proId:string, token:string) => {
    return useQuery({
        queryKey: ['proMedia', proId, token],
        queryFn: () => getProMediaById(proId, token),
    staleTime: 10*60*1000,
    enabled: Boolean(proId && token),
    });
}

export const useProFeaturedProject = (professioinal_id: string, token: string) => {
    return useQuery ({
        queryKey: ['featuredProject', professioinal_id, token],
        queryFn: () => getProFeaturedProject(professioinal_id, token),
    staleTime: 10*60*1000,
    enabled: Boolean(professioinal_id && token),
    });
}

export const useFAQ = (professionalId: string, token: string) => {
    return useQuery({
        queryKey: ['FAQData', professionalId,token],
        queryFn: () => getAllFAQ(professionalId, token),
    staleTime: 10*60*1000,
    enabled: Boolean(professionalId && token),
    });
}