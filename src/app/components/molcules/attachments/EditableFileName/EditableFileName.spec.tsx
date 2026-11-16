import { fireEvent, render, screen } from "@/config/utils/test-utils";
import { EditableFileName } from "./EditableFileName";
import { attachmentActions, providers } from "@/app/utils/tests/wrappers";

describe("EditableFileName", () => {
  const ATTACHMENT_ID = 1;
  const ATTACHMENT_TITLE = "attachment";

  it("should show the title", () => {
    render(<EditableFileName id={ATTACHMENT_ID} title={ATTACHMENT_TITLE} />);

    expect(screen.getByText(ATTACHMENT_TITLE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit file name/i }));
  });

  it("should edit the title", async () => {
    const updateSpy = jest.fn();

    render(<EditableFileName id={ATTACHMENT_ID} title={ATTACHMENT_TITLE} />, {
      wrapper: providers(attachmentActions({ update: updateSpy })),
    });

    fireEvent.click(screen.getByRole("button", { name: /edit file name/i }));

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "updated" },
    });
    fireEvent.blur(screen.getByRole("textbox"));

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(updateSpy).toHaveBeenCalledWith(1, { file_name: "updated" });
  });
});
