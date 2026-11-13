import { IAttachment } from "../../types/attachment";
import { useAttachmentsState } from "./state-context";

export const useAttachmentById = (
  id: number | null | undefined
): IAttachment | null => {
  const { data } = useAttachmentsState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((att) => att.id === id) ?? null;
};
