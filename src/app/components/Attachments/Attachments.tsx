"use client";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { LayoutGrid, List, Upload } from "lucide-react";
import { Attachment } from "@/models/attachment";
import { api } from "@/app/utils/hooks/use-attachments/api";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AttachmentCard from "./AttachmentCard";
import AttachmentRow from "./AttachmentRow";

type ViewMode = "list" | "grid";

const Attachments: FC = (): JSX.Element => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<Record<number, string>>({});

  const [entityType, setEntityType] = useState<string>("");
  const [entityId, setEntityId] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<Attachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleError = useCallback(
    (error: any, fallback: string) => {
      const message = error?.response?.data?.message || fallback;
      toast({ title: "Error", description: message, variant: "destructive" });
    },
    [toast],
  );

  // Fetch + cache an object URL for a file, downloading lazily and only once.
  const ensureUrl = useCallback(
    async (id: number): Promise<string | null> => {
      if (urlsRef.current[id]) return urlsRef.current[id];
      try {
        const response = await api.download(id);
        const url = URL.createObjectURL(response.data);
        urlsRef.current[id] = url;
        return url;
      } catch (error) {
        handleError(error, "Failed to load file");
        return null;
      }
    },
    [handleError],
  );

  const revokeAll = useCallback(() => {
    Object.values(urlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = {};
  }, []);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (entityType) params.entity_type = entityType;
      if (entityId) params.entity_id = entityId;
      const response = await api.list(params);
      revokeAll();
      setAttachments(response.data ?? []);
    } catch (error) {
      handleError(error, "Failed to load attachments");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, revokeAll, handleError]);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      // if (!entityType || !entityId) {
      //   toast({
      //     title: "Missing info",
      //     description: "Enter an entity type and id to attach the file to.",
      //     variant: "destructive",
      //   });
      //   return;
      // }
      try {
        setIsUploading(true);
        for (const file of Array.from(files)) {
          await api.upload(file, entityType, entityId);
        }
        toast({ title: "Success", description: "File(s) uploaded" });
        await load();
      } catch (error) {
        handleError(error, "Upload failed");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [entityType, entityId, load, handleError, toast],
  );

  const handleDownload = useCallback(
    async (attachment: Attachment) => {
      const url = await ensureUrl(attachment.id);
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    [ensureUrl],
  );

  const handleDelete = useCallback(
    async (attachment: Attachment) => {
      if (!window.confirm(`Delete "${attachment.file_name}"?`)) return;
      try {
        await api.remove(attachment.id);
        setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
        const url = urlsRef.current[attachment.id];
        if (url) {
          URL.revokeObjectURL(url);
          delete urlsRef.current[attachment.id];
        }
        toast({ title: "Deleted", description: "Attachment removed" });
      } catch (error) {
        handleError(error, "Delete failed");
      }
    },
    [handleError, toast],
  );

  const openPreview = useCallback(
    async (attachment: Attachment) => {
      setPreview(attachment);
      setPreviewUrl(null);
      const url = await ensureUrl(attachment.id);
      setPreviewUrl(url);
    },
    [ensureUrl],
  );

  // Initial load (whole list, no filters) + cleanup on unmount.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => revokeAll, [revokeAll]);

  return (
    <div className="h-full w-full space-y-6 p-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label htmlFor="entity-type">Entity type</Label>
          <Input
            id="entity-type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            placeholder="all"
            className="w-40"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="entity-id">Entity id</Label>
          <Input
            id="entity-id"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="all"
            className="w-56"
          />
        </div>
        <Button onClick={load} disabled={isLoading} variant="secondary">
          {isLoading ? "Loading..." : "Load"}
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf,image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>

      {attachments.length === 0 ? (
        <div className="rounded-md border border-dashed p-12 text-center text-muted-foreground">
          No attachments yet.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {attachments.map((attachment) => (
            <AttachmentCard
              key={attachment.id}
              attachment={attachment}
              ensureUrl={ensureUrl}
              onPreview={() => openPreview(attachment)}
              onDownload={() => handleDownload(attachment)}
              onDelete={() => handleDelete(attachment)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          {attachments.map((attachment) => (
            <AttachmentRow
              key={attachment.id}
              attachment={attachment}
              onPreview={() => openPreview(attachment)}
              onDownload={() => handleDownload(attachment)}
              onDelete={() => handleDelete(attachment)}
            />
          ))}
        </div>
      )}

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
          {preview && (
            <div className="flex justify-end">
              <Button onClick={() => handleDownload(preview)}>Download</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attachments;
