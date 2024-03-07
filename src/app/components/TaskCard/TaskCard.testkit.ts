import { within } from "@/config/utils/test-utils";
import { titleTestId } from "./TaskCard";

export const getTaskCardTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTitle: () => within(component).getByTestId(titleTestId).textContent,
});
