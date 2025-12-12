// src/hooks/useGuarantee.ts
import { ActivateGuaranteeAPI } from "@/app/api/guarantee";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface GuaranteeFormData {
  professional_id: string;
  service_id: string;
  guarantee_type: string;
  duration: "monthly" | "annual";
  start_date: string;
  credits: number;
  end_date: string;
  guarantee_name: string;
  guarantee_details: string;
}

export function useActivateGuarantee() {
  return useMutation({
    mutationKey: ["activateGuarantee"],
    mutationFn: async ({ data, token }: { data: GuaranteeFormData; token: string }) => {
      return ActivateGuaranteeAPI(data, token);
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Guarantee activated successfully");
    },
  });
}