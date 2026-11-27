import { toBackendDateTime } from "@/utils/date";

import { createCrudStore } from "../use-crud/create-crud-store";
import { ITimeSpace } from "../../types/time-space";
import { now } from "../../date/now";
import { api, CreateTimeSpaceParams } from "./api";

export const timeSpacesStore = createCrudStore<
  ITimeSpace,
  CreateTimeSpaceParams
>({
  entityName: "Time space",
  api,
  // title, kind and params are everything the list draws, so the row reads
  // correctly while the POST is in flight. `user_id` is the server's to fill
  // and nothing renders it, so standing in until the reply lands costs nothing
  toOptimistic: (data, tempId) => ({
    ...data,
    id: tempId,
    user_id: 0,
    created_at: toBackendDateTime(now()),
  }),
});
