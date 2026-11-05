import { render, screen } from "@/config/utils/test-utils";
import { ActiveEventInfo } from "./ActiveEventInfo";
import { generateEvent } from "@/app/utils/mocks/event";
import { EventStatus } from "@/app/utils/types/event";

describe("ActiveEventInfo", () => {
  describe("event is completed", () => {
    it('should not show "complete" button', () => {
      const EVENT = generateEvent(1, { status: EventStatus.Completed });
      render(<ActiveEventInfo event={EVENT} />);

      expect(
        screen.queryByRole("button", { name: /complete/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("event is not completed", () => {
    it('should show "complete" button', () => {
      const EVENT = generateEvent(1, { status: EventStatus.Pending });
      render(<ActiveEventInfo event={EVENT} />);

      expect(
        screen.getByRole("button", { name: /complete/i })
      ).toBeInTheDocument();
    });
  });
});
