// hooks/useAutoTrackView.ts
import { useEffect } from "react";
import { useTrackView } from "./useTrackView";

export const useAutoTrackView = (professional_id: string) => {
  const { mutate: trackView } = useTrackView();

  useEffect(() => {
    if (!professional_id) return;
    trackView(professional_id);
  }, [professional_id, trackView]);
};
