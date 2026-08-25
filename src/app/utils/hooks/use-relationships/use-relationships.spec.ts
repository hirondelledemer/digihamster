import { act } from "react";
import { renderHook } from "@testing-library/react";
import mockAxios from "jest-mock-axios";

import { useRelationships } from "./use-relationships";
import { FieldsRequired, RELATIONSHIPS_PATH } from "./api";
import { RelationshipEntityType } from "../../types/relationship";

import * as toastHook from "../../../components/ui/use-toast";
jest.mock("../../../components/ui/use-toast");
const mockUseToast = jest.mocked(toastHook.useToast);

describe("use-relationships", () => {
  const toastSpy = jest.fn();

  const relationship: FieldsRequired = {
    source_type: RelationshipEntityType.Journal,
    source_id: 1,
    target_type: RelationshipEntityType.Task,
    target_id: 2,
  };

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: toastSpy } as any);
  });

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("should create a relationship and return it", async () => {
    const created = { id: 10, relationship_type: "related", ...relationship };
    mockAxios.post.mockResolvedValueOnce({ data: created });

    const { result } = renderHook(() => useRelationships());

    let returned;
    await act(async () => {
      returned = await result.current.create(relationship);
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      RELATIONSHIPS_PATH,
      relationship,
    );
    expect(returned).toEqual(created);
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it("should toast and return null when creating fails", async () => {
    mockAxios.post.mockRejectedValueOnce(new Error("Internal Server Error"));

    const { result } = renderHook(() => useRelationships());

    let returned;
    await act(async () => {
      returned = await result.current.create(relationship);
    });

    expect(returned).toBeNull();
    expect(toastSpy).toHaveBeenCalledWith({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  });
});
