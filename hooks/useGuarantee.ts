// src/hooks/useGuarantee.ts
import {
  ActivateGuaranteeAPI,
  ActiveGuaranteeStatusAPI,
  DeleteActivateGuarantee,
} from "@/app/api/guarantee";
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
    mutationFn: async ({
      data,
      token,
    }: {
      data: GuaranteeFormData;
      token: string;
    }) => {
      return ActivateGuaranteeAPI(data, token);
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Guarantee activated successfully");
    },
  });
}

export function useGuaranteeStatus() {
  return useMutation({
    mutationKey: ["update-status"],
    mutationFn: (data: {
      guarantee_id: string;
      status: string;
      token: string;
    }) => ActiveGuaranteeStatusAPI(data),
  });
}

export const useDeleteActivateGuarantee = () => {
  return useMutation({
    mutationKey: ["deleteGuarantee"],
    mutationFn: ({
      guarantee_id,
      token,
    }: {
      guarantee_id: string;
      token: string;
    }) => DeleteActivateGuarantee(guarantee_id, token),
  });
};
