import type { Meta, StoryObj } from "@storybook/react";

import EventTaskFormModal from ".";
import { EventTaskFormModalProps } from "./EventTaskFormModal";
import { now } from "@/app/utils/date/date";
import { addHours } from "date-fns";

const meta: Meta<typeof EventTaskFormModal> = {
  title: "Example/EventTaskFormModal",
  component: EventTaskFormModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EventTaskFormModal>;

const defaultArgs: EventTaskFormModalProps = {
  open: true,
  onClose: () => {},
  onDone: () => {},
  initialValues: {
    startAt: now().valueOf(),
    endAt: addHours(now(), 1).valueOf(),
  },
};

export const Default: Story = {
  args: defaultArgs,
};
