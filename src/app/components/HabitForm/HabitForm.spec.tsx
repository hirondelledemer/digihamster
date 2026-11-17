import { render, screen, userEvent } from "@/config/utils/test-utils";
import HabitForm from "./HabitForm";
import { generateHabit } from "@/app/utils/mocks/habit";
import {
  habitActions,
  lifeAspectsState,
  providers,
} from "@/app/utils/tests/wrappers";
import { generateLifeAspect } from "@/app/utils/mocks/lifeAspect";

describe("HabitForm", () => {
  describe("edit mode", () => {
    const LIFE_ASPECT = generateLifeAspect();
    const LIFE_ASPECT_UPDATED = generateLifeAspect(2, { title: "new aspect" });
    const HABIT = generateHabit(1, { life_aspect_id: LIFE_ASPECT.id });

    it("should render all the fields", () => {
      render(<HabitForm editMode onDone={jest.fn()} habit={HABIT} />, {
        wrapper: providers(
          lifeAspectsState({ data: [LIFE_ASPECT, LIFE_ASPECT_UPDATED] })
        ),
      });

      expect(
        screen.getByRole("textbox", { name: /title/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("textbox", { name: /description/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("textbox", { name: /encouragement/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("combobox", { name: /times per month/i })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("combobox", { name: /life aspect/i })
      ).toBeInTheDocument();
    });

    it("should edit all the fields", async () => {
      const updateHabitSpy = jest.fn();

      render(<HabitForm editMode onDone={jest.fn()} habit={HABIT} />, {
        wrapper: providers(
          lifeAspectsState({ data: [LIFE_ASPECT, LIFE_ASPECT_UPDATED] }),
          habitActions({ updateHabit: updateHabitSpy })
        ),
      });

      // await userEvent.click(screen.getByRole("button", { name: /save/i }));

      await userEvent.type(
        screen.getByRole("textbox", { name: /title/i }),
        " updated"
      );

      await userEvent.type(
        screen.getByRole("textbox", { name: /description/i }),
        " updated"
      );

      await userEvent.type(
        screen.getByRole("textbox", { name: /encouragement/i }),
        " updated"
      );

      await userEvent.click(
        screen.getByRole("combobox", { name: /times per month/i })
      );

      await userEvent.click(
        screen.getByRole("option", { name: /Twice a month/i })
      );

      await userEvent.click(
        screen.getByRole("combobox", { name: /life aspect/i })
      );

      await userEvent.click(
        screen.getByRole("option", { name: /new aspect/i })
      );

      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      expect(updateHabitSpy).toHaveBeenCalledWith(HABIT.id, {
        description: "Habit desc 1 updated",
        encouragement: " updated",
        life_aspect_id: 2,
        times_per_month: 2,
        title: "Habit 1 updated",
      });
    });
  });
});
