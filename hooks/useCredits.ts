import { GetCreditPackageAPI } from "@/app/api/credits";
import {  useQuery } from "@tanstack/react-query";

export const useGetCreditPackage = (token: string) => {
  return useQuery({
    queryKey: ["getCreditPackage"],
    queryFn: async () => await GetCreditPackageAPI(token),
    enabled: !!token,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
