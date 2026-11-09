import { fn } from "@storybook/test";

import * as actual from "./date";

// @ts-expect-error TODO: look into it
export const now = fn(actual.now).mockName("now");
