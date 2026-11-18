import { render, screen, userEvent } from "@/config/utils/test-utils";
import { EditableColor } from "./EditableColor";

describe("EditableColor", () => {
  const COLOR = "color";

  it("should show the provided color", () => {
    render(<EditableColor color={COLOR} onSave={jest.fn()} />);

    expect(screen.getByText(COLOR)).toBeInTheDocument();
  });

  it("should edit the color", async () => {
    const saveSpy = jest.fn();
    render(<EditableColor color={COLOR} onSave={saveSpy} />);

    await userEvent.click(screen.getByRole("button", { name: /edit color/i }));

    expect(screen.getByRole("combobox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: /#F06595/i }));

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(saveSpy).toHaveBeenCalledWith("#F06595");
  });
});
