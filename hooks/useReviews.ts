import { getProfessionalById } from "@/app/api/reviews";
import {
  SubmitCustomerReviewAPI,
  SubmitCustomerReviewWithUserAPI,
} from "@/app/api/services/reviews";

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useReviews(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getProfessionalById(id),
    enabled: !!id,
  });
}

export function useReviewSubmission() {
  return useMutation({
    mutationFn: (data: any) => {
      return SubmitCustomerReviewAPI(data as any);
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
    },
  });
}

export function useCreateReviewUser() {

  return useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      phoneNo: string;
      dob: string;
      isAgreeTermsConditions: boolean;
      role_id?: string;
      status?: boolean;
    }) => {
      const payload = { ...data, role_id: "2" };
      return SubmitCustomerReviewWithUserAPI(payload);
    },
    onSuccess: (response: any) => {
      return response;
    },
  });
}
