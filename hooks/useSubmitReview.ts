import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SendReviewAPI } from "@/app/api/services/reviews";

export function useSubmitReview(token?: string) {
  return useMutation({
    mutationKey: ["submitReview"],
    mutationFn: (data: any) => SendReviewAPI(data, token),
    onSuccess: () => {
      toast.success("Review submitted");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit review");
    },
    retry: false,
  });
}
