"use client";
import React, { FC } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { Attachment } from "@/models/attachment";
import { Button } from "../ui/button";
import { formatSize } from "./AttachmentCard";

interface AttachmentRowProps {
  attachment: Attachment;
  onPreview(): void;
  onDownload(): void;
  onDelete(): void;
}

const AttachmentRow: FC<AttachmentRowProps> = ({
  attachment,
  onPreview,
  onDownload,
  onDelete,
}): JSX.Element => {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-2 last:border-b-0 hover:bg-muted/50">
      <button
        type="button"
        onClick={onPreview}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm font-medium" title={attachment.file_name}>
          {attachment.file_name}
        </span>
      </button>
      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
        {formatSize(attachment.size)}
      </span>
      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDownload}
          aria-label="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AttachmentRow;
