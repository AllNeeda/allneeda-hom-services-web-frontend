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
  type ReviewMedia = {
    type: "video" | "image";
    name: string;
  };

  type ReviewPayload = {
    professionalId: string;
    rating: number;
    tags?: string[];
    comments?: string;
    media?: ReviewMedia[];
    user_id?: string | undefined;
  };
  return useMutation({
    mutationFn: (data: ReviewPayload | FormData) => {
      return SubmitCustomerReviewAPI(data as ReviewPayload);
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
    },
  });
}

export function useCreateReviewUser() {
  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      phoneNo: string;
      dob: string;
      isAgreeTermsConditions: boolean;
      role_id?: string;
      status?: boolean;
    }) => SubmitCustomerReviewWithUserAPI(data),
    onSuccess: (response: any) => {
      return response;
    },
  });
}
