import { getProfessionalById } from "@/app/api/reviews";

import { useQuery } from "@tanstack/react-query";

export function useReviews(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getProfessionalById(id),
    enabled: !!id,
  });
}
