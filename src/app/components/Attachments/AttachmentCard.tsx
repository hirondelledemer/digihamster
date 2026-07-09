"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import { Attachment } from "@/models/attachment";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface AttachmentCardProps {
  attachment: Attachment;
  ensureUrl(id: number): Promise<string | null>;
  onPreview(): void;
  onDownload(): void;
  onDelete(): void;
}

export const formatSize = (bytes: number): string => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const AttachmentCard: FC<AttachmentCardProps> = ({
  attachment,
  ensureUrl,
  onPreview,
  onDownload,
  onDelete,
}): JSX.Element => {
  const isPdf = attachment.mime_type === "application/pdf";
  const ref = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  // Lazy-load the thumbnail only once the card scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node || url) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          ensureUrl(attachment.id).then((resolved) => {
            if (resolved) setUrl(resolved);
          });
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [attachment.id, ensureUrl, url]);

  return (
    <Card
      ref={ref}
      className="group relative w-full overflow-hidden rounded-md hover:border-primary"
    >
      <button
        type="button"
        onClick={onPreview}
        className="block h-48 w-full cursor-pointer bg-muted"
        aria-label={`Preview ${attachment.file_name}`}
      >
        {isPdf && url ? (
          <object
            data={`${url}#toolbar=0&navpanes=0&view=FitH`}
            type="application/pdf"
            className="pointer-events-none h-full w-full"
          >
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
          </object>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </button>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={attachment.file_name}>
            {attachment.file_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatSize(attachment.size)}
          </p>
        </div>
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
    </Card>
  );
};

export default AttachmentCard;
