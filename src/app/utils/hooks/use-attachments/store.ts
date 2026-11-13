import { IAttachment } from "../../types/attachment";
import { createCrudStore } from "../use-crud/create-crud-store";
import { crudApi, CreateAttachmentParams } from "./api";

export const attachmentsStore = createCrudStore<
  IAttachment,
  CreateAttachmentParams
>({
  entityName: "IAttachment",
  api: crudApi,
  // a file knows its own name, type and size, so the row reads correctly while
  // the upload is in flight. `user_id` and the entity columns are the server's
  // to fill - nothing renders them, so standing in until the POST comes back
  // costs nothing
  toOptimistic: ({ file }, tempId) => ({
    id: tempId,
    user_id: 0,
    entity_type: "",
    entity_id: 0,
    file_name: file.name,
    mime_type: file.type,
    size: file.size,
  }),
});
