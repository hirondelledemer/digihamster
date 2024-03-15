import { fireEvent, within } from "@/config/utils/test-utils";

export const getProjectsListTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  clickProject: (projectName: string) => {
    const comp = within(component).getByText(projectName);
    fireEvent.click(comp);
  },
});
