import { IAttachment } from "../types/attachment";

export const generateAttachment: (
  i?: number,
  properties?: Partial<IAttachment>
) => IAttachment = (i = 1, properties) => {
  return {
    id: i,
    user_id: 1,
    entity_type: "",
    entity_id: 0,
    file_name: `Attachment ${i}`,
    mime_type: "application/pdf",
    size: 1024 * (i + 1),
    ...properties,
  };
};

export const generateListOfAttachments: (count: number) => IAttachment[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateAttachment(i));
};

export const generateCustomAttachmentsList: (
  attachmentInfo: Partial<IAttachment>[]
) => IAttachment[] = (attachmentInfo) => {
  return attachmentInfo.map((attachmentProperties, i) => ({
    ...generateAttachment(i, attachmentProperties),
  }));
};
