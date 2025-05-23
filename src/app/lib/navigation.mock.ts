import { fn } from "@storybook/test";

import * as actual from "./navigation";

export const useRouter = fn(actual.useRouter).mockName("useRouter");
export const useSearchParams = fn(actual.useSearchParams).mockName(
  "useSearchParams"
);
