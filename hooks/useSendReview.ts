// hooks/useSendReview.ts
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SendReviewAPI } from "@/app/api/services/reviews";

export function useSendReview(token?: string) {
  return useMutation({
    mutationKey: ["sendReview"],
    mutationFn: (data: {
      recipientEmail: string;
      businessName: string;
      reviewLink: string;
    }) => {
      return SendReviewAPI(data, token);
    },
    onSuccess: () => {
      toast.success("Review request sent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send review request.");
    },
    retry: false,
  });
}
