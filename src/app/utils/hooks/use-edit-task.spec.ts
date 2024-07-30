import { act } from "react";
import { cleanup, renderHook } from "@testing-library/react";
import useEditTask from "./use-edit-task";
import mockAxios from "jest-mock-axios";

import * as toastHook from "../../components/ui/use-toast";
jest.mock("../../components/ui/use-toast");
const mockUseToast = jest.mocked(toastHook.useToast);

describe("use-edit-task", () => {
  const toastSpy = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: toastSpy } as any);
  });

  afterEach(() => {
    mockAxios.reset();
    cleanup();
  });

  it("should update task", async () => {
    mockAxios.patch.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useEditTask());
    await act(async () => {
      await result.current.editTask("task1", { title: "edited title" });
    });

    expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
      taskId: "task1",
      title: "edited title",
    });

    expect(toastSpy).toHaveBeenCalledWith({
      title: "Success",
      description: "Task has been updated",
    });
  });

  it("should delete task", async () => {
    mockAxios.patch.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useEditTask());
    await act(async () => {
      await result.current.deleteTask("task1");
    });

    expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
      taskId: "task1",
      deleted: true,
    });

    expect(toastSpy).toHaveBeenCalledWith({
      title: "Success",
      description: "Task has been deleted",
    });
  });
});
