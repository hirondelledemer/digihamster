import { createRestApi } from "../use-crud/api";
import {
  IDateRangeTimeSpace,
  ITimeSpace,
  IYearlyMonthTimeSpace,
} from "../../types/time-space";

/** Columns the server owns - you never send these when creating. */
type ServerOwned = "id" | "user_id" | "created_at";

/**
 * `Omit` is applied to each member of the union separately on purpose.
 * `Omit<ITimeSpace, ServerOwned>` would NOT do the same thing: `Omit` is built
 * on `keyof`, and `keyof` over a union is only the keys the members share, so
 * it would collapse the two variants into one loose object and lose the link
 * between `kind` and `params`.
 */
export type CreateTimeSpaceParams =
  | Omit<IDateRangeTimeSpace, ServerOwned>
  | Omit<IYearlyMonthTimeSpace, ServerOwned>;

export const TIME_SPACES_PATH = "/time-spaces";

export const api = createRestApi<ITimeSpace, CreateTimeSpaceParams>(
  TIME_SPACES_PATH
);
