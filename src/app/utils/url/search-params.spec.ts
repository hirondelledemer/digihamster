import { useSetSearchParams } from "./search-params";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { act, renderHook } from "@/config/utils/test-utils";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe("search-params", () => {
  describe("useSetSearchParams", () => {
    const mockPush = jest.fn();
    beforeEach(() => {
      jest.clearAllMocks();
      (usePathname as jest.Mock).mockReturnValue("/dashboard");
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    it("should append the new search param", () => {
      const initialParams = new URLSearchParams("tab=overview");
      (useSearchParams as jest.Mock).mockReturnValue(initialParams);

      const { result } = renderHook(() => useSetSearchParams());
      act(() => {
        result.current("page", "2");
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard?tab=overview&page=2");
    });

    it("should remove the search param", () => {
      const initialParams = new URLSearchParams("tab=overview&page=2");
      (useSearchParams as jest.Mock).mockReturnValue(initialParams);

      const { result } = renderHook(() => useSetSearchParams());
      act(() => {
        result.current("page", null);
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard?tab=overview");
    });
  });
});
