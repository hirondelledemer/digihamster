import { fn } from "@storybook/test";

import * as actual from "./date";

export const now = fn(actual.now).mockName("now");
