import { render, screen, fireEvent } from "@/config/utils/test-utils";
import { EventHabit } from "./EventHabit";
import { generateHabit } from "@/app/utils/mocks/habit";
import {
  HabitsNewActionsContext,
  HabitsNewActionsContextValue,
} from "@/app/utils/hooks/use-habits-new/actions-context";
import { getHabitLogDate } from "@/app/utils/habits/habit-log";

const TEST_DATE = new Date("2024-03-15T10:00:00");

const renderComponent = (
  habit = generateHabit(),
  date = TEST_DATE,
  actions: Partial<HabitsNewActionsContextValue> = {},
) => {
  const addLog = jest.fn();
  const contextValue: HabitsNewActionsContextValue = {
    createHabit: jest.fn(),
    updateHabit: jest.fn(),
    deleteHabit: jest.fn(),
    addLog,
    ...actions,
  };

  render(
    <HabitsNewActionsContext.Provider value={contextValue}>
      <EventHabit habit={habit} onCompletedChange={jest.fn()} date={date} />
    </HabitsNewActionsContext.Provider>,
  );

  return { addLog };
};

describe("EventHabit", () => {
  it("should render the habit title", () => {
    const habit = generateHabit(1);
    renderComponent(habit);
    expect(screen.getByText(habit.title)).toBeInTheDocument();
  });

  describe("checkbox checked state", () => {
    it("should render checkbox as unchecked when no log exists for the day", () => {
      const habit = generateHabit(1, { logs: [] });
      renderComponent(habit);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("should render checkbox as checked when a completed log exists for the day", () => {
      const habit = generateHabit(1, {
        logs: [
          {
            id: 1,
            habit_id: 1,
            log_date: "2024-03-15T00:00:00",
            completed: true,
            created_at: "2024-03-15T00:00:00",
          },
        ],
      });
      renderComponent(habit);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("should render checkbox as unchecked when log exists for the day but is not completed", () => {
      const habit = generateHabit(1, {
        logs: [
          {
            id: 1,
            habit_id: 1,
            log_date: "2024-03-15T00:00:00",
            completed: false,
            created_at: "2024-03-15T00:00:00",
          },
        ],
      });
      renderComponent(habit);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("should render checkbox as unchecked when log exists for a different day", () => {
      const habit = generateHabit(1, {
        logs: [
          {
            id: 1,
            habit_id: 1,
            log_date: "2024-03-14T00:00:00",
            completed: true,
            created_at: "2024-03-14T00:00:00",
          },
        ],
      });
      renderComponent(habit);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });
  });

  describe("completing a habit", () => {
    it("should call addLog with completed=true when checkbox is clicked and habit is not completed", () => {
      const habit = generateHabit(1, { logs: [] });
      const { addLog } = renderComponent(habit);

      fireEvent.click(screen.getByRole("checkbox"));

      expect(addLog).toHaveBeenCalledWith(habit.id, {
        completed: true,
        at: getHabitLogDate(TEST_DATE),
      });
    });

    it("should call addLog with completed=false when checkbox is clicked and habit is completed", () => {
      const habit = generateHabit(1, {
        logs: [
          {
            id: 1,
            habit_id: 1,
            log_date: "2024-03-15T00:00:00",
            completed: true,
            created_at: "2024-03-15T00:00:00",
          },
        ],
      });
      const { addLog } = renderComponent(habit);

      fireEvent.click(screen.getByRole("checkbox"));

      expect(addLog).toHaveBeenCalledWith(habit.id, {
        completed: false,
        at: getHabitLogDate(TEST_DATE),
      });
    });
  });

  describe("event propagation", () => {
    it("should stop propagation on checkbox click", () => {
      renderComponent();
      const checkbox = screen.getByRole("checkbox");
      const clickEvent = new MouseEvent("click", { bubbles: true });
      const stopPropagation = jest.spyOn(clickEvent, "stopPropagation");

      checkbox.dispatchEvent(clickEvent);

      expect(stopPropagation).toHaveBeenCalled();
    });

    it("should stop propagation on mousedown capture", () => {
      renderComponent();
      const checkbox = screen.getByRole("checkbox");
      const mouseDownEvent = new MouseEvent("mousedown", { bubbles: true });
      const stopPropagation = jest.spyOn(mouseDownEvent, "stopPropagation");

      checkbox.dispatchEvent(mouseDownEvent);

      expect(stopPropagation).toHaveBeenCalled();
    });
  });
});
