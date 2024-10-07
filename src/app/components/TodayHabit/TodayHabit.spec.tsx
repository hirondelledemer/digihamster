import { render, screen } from "@/config/utils/test-utils";
import TodayHabit, { TodayHabitProps } from "./TodayHabit";
import { getTodayHabitTestkit } from "./TodayHabit.testkit";
import { DAY } from "@/app/utils/consts/dates";

jest.mock("../../utils/date/date");

describe("TodayHabit", () => {
  const defaultProps: TodayHabitProps = {
    habit: {
      _id: "habit1",
      title: "Habit 1",
      deleted: false,
      log: [],
      category: "",
      timesPerMonth: 28,
      updatedAt: "",
    },
    date: new Date(0),
  };
  const renderComponent = (props = defaultProps) =>
    getTodayHabitTestkit(render(<TodayHabit {...props} />).container);

  it("should render TodayHabit", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe("no logs", () => {
    it("shows 'never'", () => {
      renderComponent();
      expect(screen.getByText("never")).toBeInTheDocument();
    });
  });

  it("should shows how many days ago last habit was completed", () => {
    const props: TodayHabitProps = {
      habit: {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        log: [
          {
            at: 0 - DAY,
            completed: true,
          },
        ],
        category: "",
        timesPerMonth: 28,
        updatedAt: "",
      },
      date: new Date(0),
    };
    renderComponent(props);
    expect(screen.getByText("1 day ago")).toBeInTheDocument();
  });

  it("should show how many days ago last habit was completed relative to date", () => {
    const props: TodayHabitProps = {
      habit: {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        log: [
          {
            at: 0 - DAY * 2,
            completed: true,
          },
          {
            at: 0 - DAY,
            completed: false,
          },
          {
            at: 0,
            completed: false,
          },
        ],
        category: "",
        timesPerMonth: 28,
        updatedAt: "",
      },
      date: new Date(0 - DAY),
    };
    renderComponent(props);
    expect(screen.getByText("1 day ago")).toBeInTheDocument();
  });
});
