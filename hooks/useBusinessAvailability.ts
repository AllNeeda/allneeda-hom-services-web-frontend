import {
  AvailabilityPayload,
  UseUpdateBusinessAvailabilityAPI,
} from "@/app/api/services/businessAvailability";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBusinessAvailability = (token: string) => {
  return useMutation({
    mutationKey: ["updateBusinessAvailability"],
    mutationFn: (data: AvailabilityPayload) =>
      UseUpdateBusinessAvailabilityAPI(data, token),
    onSuccess: async () => {
      toast.success("Business availability updated successfully");
    },
  });
};
