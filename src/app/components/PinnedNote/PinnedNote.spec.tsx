import { render } from "@testing-library/react";
import PinnedNote, { PinnedNoteProps } from "./PinnedNote";
import { getPinnedNoteTestkit } from "./PinnedNote.testkit";

describe("PinnedNote", () => {
  const defaultProps: PinnedNoteProps = {
    note: {
      _id: "note1",
      title: "",
      note: "note",
      isActive: false,
      deleted: false,
      userId: "",
      tags: [],
      updatedAt: "",
      createdAt: "",
    },
  };
  const renderComponent = (props = defaultProps) =>
    getPinnedNoteTestkit(render(<PinnedNote {...props} />).container);

  it("should render PinnedNote", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
