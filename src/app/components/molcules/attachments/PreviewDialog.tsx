import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useAttachmentsActions } from "@/app/utils/hooks/use-attachments/actions-context";
import { Button } from "../../ui/button";
import { IconCheckbox, IconPencil } from "@tabler/icons-react";
import { Input } from "../../ui/input";
import { IAttachment } from "@/app/utils/types/attachment";

const FileTitle: FC<{ id: number; title: string }> = ({ id, title }) => {
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(title);

  const { update } = useAttachmentsActions();

  const handleSave = async () => {
    await update(id, { file_name: value });
    setAllowEdit(false);
  };

  if (!allowEdit) {
    return (
      <div className="flex gap-2 items-center">
        {title}
        <Button size="icon">
          <IconPencil onClick={() => setAllowEdit(true)} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button size="icon">
        <IconCheckbox onClick={handleSave} />
      </Button>
    </div>
  );
};

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
            <FileTitle id={attachment.id} title={attachment.file_name} />
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
