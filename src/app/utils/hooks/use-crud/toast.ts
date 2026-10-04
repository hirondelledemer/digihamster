import { useToast } from "@/app/components/ui/use-toast";
import { getApiErrorMessage } from "../../axios";

export type Toast = ReturnType<typeof useToast>["toast"];

export const handleApiError = (error: unknown, toast: Toast) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
    variant: "destructive",
  });
};

export const handleSuccessToast = (toast: Toast, message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};
