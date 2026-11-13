import { attachmentsStore } from "./store";

export const AttachmentsStateContext = attachmentsStore.StateContext;

export const useAttachmentsState = attachmentsStore.useEntityState;
