import { api } from "@/app/utils/hooks/use-attachments/api";
import { useAttachmentById } from "@/app/utils/hooks/use-attachments/selectors";
import { FC, useCallback, useState } from "react";
import { useToast } from "../../ui/use-toast";
import { getApiErrorMessage } from "@/app/utils/axios";
import AttachmentCard from "../../Attachments/AttachmentCard";
import { IAttachment } from "@/app/utils/types/attachment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export const Attachment: FC<{ id: number }> = ({ id }) => {
  const attachment = useAttachmentById(id);
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

  if (!attachment) {
    return null;
  }

  return (
    <>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) {
            setPreview(null);
            setPreviewUrl(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">
              {preview?.file_name}
            </DialogTitle>
          </DialogHeader>
          {preview && previewUrl ? (
            preview.mime_type === "application/pdf" ? (
              <iframe
                src={previewUrl}
                title={preview.file_name}
                className="h-[70vh] w-full rounded-md border"
              />
            ) : preview.mime_type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={preview.file_name}
                className="max-h-[70vh] w-full rounded-md object-contain"
              />
            ) : (
              <p className="text-muted-foreground">
                Preview not available for this file type.
              </p>
            )
          ) : (
            <p className="text-muted-foreground">Loading preview…</p>
          )}
        </DialogContent>
      </Dialog>
      <AttachmentCard
        attachment={attachment}
        ensureUrl={ensureUrl}
        onDelete={() => {}}
        onDownload={() => {}}
        onPreview={() => openPreview(attachment)}
      />
    </>
  );
};
