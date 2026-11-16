import { api } from "@/app/utils/hooks/use-attachments/api";
import { useAttachmentById } from "@/app/utils/hooks/use-attachments/selectors";
import { FC, useCallback } from "react";
import { useToast } from "../ui/use-toast";
import { getApiErrorMessage } from "@/app/utils/axios";
import AttachmentCard from "../Attachments/AttachmentCard";

export const Attachment: FC<{ id: number }> = ({ id }) => {
  const attachment = useAttachmentById(id);
  const { toast } = useToast();

  const ensureUrl = useCallback(
    async (id: number): Promise<string | null> => {
      try {
        const response = await api.download(id);
        const url = URL.createObjectURL(response.data);
        return url;
      } catch (e: unknown) {
        toast({
          title: "Failed to load a file",
          description: getApiErrorMessage(e),
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  if (!attachment) {
    return null;
  }

  return (
    <AttachmentCard
      attachment={attachment}
      ensureUrl={ensureUrl}
      onDelete={() => {}}
      onDownload={() => {}}
      onPreview={() => {}}
    />
  );
};
