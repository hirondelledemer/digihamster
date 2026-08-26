import { ReactNode } from "react";
import { renderHook } from "@/config/utils/test-utils";
import { ProjectsStateContext } from "./state-context";
import {
  useProjectById,
  useTaskProject,
  useTaskProjectColor,
} from "./selectors";
import { generateProject } from "@/app/utils/mocks/project";
import { generateTask } from "@/app/utils/mocks/task";
import { IProject } from "../../types/project";

describe("use-projects selectors", () => {
  const work = generateProject(1, { color: "#ff0000" });
  const home = generateProject(2, { color: "#00ff00" });

  const wrapper = (data: IProject[], isLoading = false) => {
    const ProjectsState = ({ children }: { children: ReactNode }) => (
      <ProjectsStateContext.Provider
        value={{ data, defaultProject: null, isLoading }}
      >
        {children}
      </ProjectsStateContext.Provider>
    );
    return ProjectsState;
  };

  describe("useProjectById", () => {
    it("should return the project with that id", () => {
      const { result } = renderHook(() => useProjectById(home.id), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toEqual(home);
    });

    it("should return nothing when no project has that id", () => {
      const { result } = renderHook(() => useProjectById(404), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toBeNull();
    });

    it("should return nothing when there is no id", () => {
      const { result } = renderHook(() => useProjectById(null), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toBeNull();
    });

    it("should return nothing while the projects are still loading", () => {
      const { result } = renderHook(() => useProjectById(home.id), {
        wrapper: wrapper([], true),
      });

      expect(result.current).toBeNull();
    });
  });

  describe("useTaskProject", () => {
    it("should return the project the task belongs to", () => {
      const task = generateTask(1, { project_id: home.id });

      const { result } = renderHook(() => useTaskProject(task), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toEqual(home);
    });

    it("should return nothing when the task belongs to no project", () => {
      const task = generateTask(1, { project_id: null });

      const { result } = renderHook(() => useTaskProject(task), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toBeNull();
    });

    it("should return nothing when there is no task", () => {
      const { result } = renderHook(() => useTaskProject(null), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toBeNull();
    });
  });

  describe("useTaskProjectColor", () => {
    it("should return the color of the project the task belongs to", () => {
      const task = generateTask(1, { project_id: work.id });

      const { result } = renderHook(() => useTaskProjectColor(task), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toStrictEqual({
        dimmed: "color-mix(in srgb, #ff0000 10%, transparent)",
        main: "#ff0000",
      });
    });

    it("should return nothing when the task belongs to no project", () => {
      const task = generateTask(1, { project_id: null });

      const { result } = renderHook(() => useTaskProjectColor(task), {
        wrapper: wrapper([work, home]),
      });

      expect(result.current).toBeUndefined();
    });
  });
});
