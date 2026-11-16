import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { IAttachment } from "@/app/utils/types/attachment";
import { EditableFileName } from "./EditableFileName";

export const PreviewDialog: FC<{
  onClose(open: boolean): void;
  attachment: IAttachment;
  previewUrl: string;
}> = ({ onClose, attachment, previewUrl }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">
            <EditableFileName id={attachment.id} title={attachment.file_name} />
          </DialogTitle>
        </DialogHeader>
        {attachment && previewUrl ? (
          attachment.mime_type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title={attachment.file_name}
              className="h-[70vh] w-full rounded-md border"
            />
          ) : attachment.mime_type.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={attachment.file_name}
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
  );
};
