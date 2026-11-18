import { api } from "@/app/utils/hooks/use-attachments/api";
import { useAttachmentById } from "@/app/utils/hooks/use-attachments/selectors";
import { FC, useCallback, useState } from "react";
import { useToast } from "../../ui/use-toast";
import { getApiErrorMessage } from "@/app/utils/axios";
import AttachmentCard from "./AttachmentCard";
import { IAttachment } from "@/app/utils/types/attachment";
import { PreviewDialog } from "./PreviewDialog";
import { useAttachmentsActions } from "@/app/utils/hooks/use-attachments/actions-context";

export const Attachment: FC<{ id: number }> = ({ id }) => {
  const attachment = useAttachmentById(id);
  const { delete: deleteAttachment } = useAttachmentsActions();
  const { toast } = useToast();
  const [preview, setPreview] = useState<IAttachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const openPreview = useCallback(
    async (attachment: IAttachment) => {
      setPreview(attachment);
      setPreviewUrl(null);
      const url = await ensureUrl(attachment.id);
      setPreviewUrl(url);
    },
    [ensureUrl]
  );

  const handleDownload = useCallback(
    async (attachment: IAttachment) => {
      const url = await ensureUrl(attachment.id);
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    [ensureUrl]
  );

  if (!attachment) {
    return null;
  }

  return (
    <>
      {!!preview && !!previewUrl && (
        <PreviewDialog
          onClose={(open) => {
            if (!open) {
              setPreview(null);
              setPreviewUrl(null);
            }
          }}
          attachment={preview}
          previewUrl={previewUrl}
        />
      )}

      <AttachmentCard
        attachment={attachment}
        ensureUrl={ensureUrl}
        onDelete={() => deleteAttachment(attachment.id)}
        onDownload={() => handleDownload(attachment)}
        onPreview={() => openPreview(attachment)}
      />
    </>
  );
};
