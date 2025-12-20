// hooks/use-confirmation.ts
import { showConfirmation, confirmDelete, confirmWarning, confirmSuccess, ConfirmationOptions } from "@/components/ui/sonner-confirmation";

export const useConfirmation = () => {
  return {
    show: showConfirmation,
    delete: confirmDelete,
    warning: confirmWarning,
    success: confirmSuccess,
  };
};