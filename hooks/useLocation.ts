import { getLocationByUserId } from "@/app/api/services/location";
import { useQuery } from "@tanstack/react-query";



export const useLocationByUserId = (token:string) => {
  return useQuery({
    queryKey: ["locations", token],
    queryFn: ()=> getLocationByUserId(token),
    refetchOnWindowFocus: false,
  });
};
