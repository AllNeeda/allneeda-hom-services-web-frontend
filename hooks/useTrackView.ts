// hooks/useTrackView.ts

import { trackViewAPI } from "@/app/api/homepage/views";
import { useMutation } from "@tanstack/react-query";

export const useTrackView = () => {
  return useMutation({
    mutationKey: ["trackView"],
    mutationFn: (professional_id: string) => trackViewAPI(professional_id),
  });
};
