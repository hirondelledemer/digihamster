import HabitItem, { HabitItemProps } from "./HabitItem";
import { subDays } from "date-fns";
import { now } from "../../utils/date/date";
import { userEvent, render, screen, waitFor } from "@/config/utils/test-utils";
import { wrapWithHabitsProvider } from "@/app/utils/tests/wraps";
import { generateListOfLifeAspects } from "@/app/utils/mocks/lifeAspect";
import mockAxios from "jest-mock-axios";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";

jest.mock("../../utils/date/date");

describe("HabitItem", () => {
  const lifeAspects = generateListOfLifeAspects(2);

  const defaultProps: HabitItemProps = {
    habit: {
      _id: "habit1",
      title: "Habit 1",
      deleted: false,
      log: [
        { at: subDays(now(), 1).valueOf(), completed: true },
        { at: subDays(now(), 4).valueOf(), completed: true },
      ],
      category: lifeAspects[0]._id,
      timesPerMonth: 4,
      updatedAt: "",
    },
  };

  afterEach(() => {
    mockAxios.reset();
  });

  it("should render habit info", async () => {
    mockAxios.get.mockResolvedValue({ data: lifeAspects });

    render(
      <LifeAspectsContextProvider>
        <HabitItem {...defaultProps} />
      </LifeAspectsContextProvider>
    );

    expect(screen.getByText(defaultProps.habit.title)).toBeInTheDocument();

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();

    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(screen.queryAllByRole("checkbox").length).toBe(7);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("should edit a habit", async () => {
    const updateHabitSpy = jest.fn();

    mockAxios.get.mockResolvedValue({ data: lifeAspects });

    render(
      wrapWithHabitsProvider(
        <LifeAspectsContextProvider>
          <HabitItem {...defaultProps} />
        </LifeAspectsContextProvider>,
        {
          updateHabit: updateHabitSpy,
        }
      )
    );

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    await expect(screen.findByRole("dialog")).resolves.toBeInTheDocument();

    const categoryInput = screen.getByRole("combobox", { name: /category/i });
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const timesInput = screen.getByRole("combobox", {
      name: /times per month/i,
    });

    expect(categoryInput).toHaveTextContent(lifeAspects[0].title);

    expect(titleInput).toHaveValue(defaultProps.habit.title);
    expect(timesInput).toHaveTextContent("Once a week");

    await userEvent.click(categoryInput);
    screen.logTestingPlaygroundURL();
    await userEvent.click(
      screen.getByRole("option", { name: lifeAspects[0].title })
    );

    await userEvent.type(titleInput, "edited");

    await userEvent.click(timesInput);

    await userEvent.click(
      screen.getByRole("option", { name: /twice a month/i })
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(updateHabitSpy).toHaveBeenCalledWith("habit1", {
        title: "Habit 1edited",
        category: lifeAspects[0]._id,
        timesPerMonth: 2,
      });
    });
  });
});
