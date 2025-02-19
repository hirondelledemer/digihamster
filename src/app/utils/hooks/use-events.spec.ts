import { renderHook } from "@testing-library/react";
import { useEvents } from "./use-events";
import mockAxios from "jest-mock-axios";

describe("use-events", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should load events", () => {
    // mockAxios.get.mockReturnValue({
    //   // data: {
    //   _id: "newTag1",
    //   color: "#F06595",
    //   title: "new",
    //   // },
    // });

    mockAxios.post.mockRejectedValueOnce({
      response: { data: { error: "server error" } },
    });
    const { result } = renderHook(() => useEvents());
    const { data, isLoading, errorMessage } = result.current;

    expect(errorMessage).toStrictEqual({});
    expect(data).toStrictEqual({});
    expect(isLoading).toStrictEqual({});
    // expect(errorMessage).toStrictEqual({});
  });
});
