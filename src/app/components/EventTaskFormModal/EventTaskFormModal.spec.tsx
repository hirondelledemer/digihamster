import { render } from "@testing-library/react";
import EventTaskFormModal, {
  EventTaskFormModalProps,
} from "./EventTaskFormModal";
import { getEventTaskFormModalTestkit } from "./EventTaskFormModal.testkit";
import { HOUR } from "@/app/utils/consts/dates";

describe("EventTaskFormModal", () => {
  const defaultProps: EventTaskFormModalProps = {
    open: true,
    onClose: jest.fn(),
    onDone: jest.fn(),
    initialValues: { startAt: 0, endAt: HOUR },
  };
  const renderComponent = (props = defaultProps) =>
    getEventTaskFormModalTestkit(
      render(<EventTaskFormModal {...props} />).container
    );

  it("should render EventTaskFormModal", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
