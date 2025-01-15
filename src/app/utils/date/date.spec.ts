import { getTimestampsFrom } from "./date";

describe("date", () => {
  describe("getTimestampsFrom", () => {
    it("should return timestamps from certain date", () => {
      const startingDate = new Date(2024, 1, 1);
      const startingTimestamp = startingDate.valueOf();

      expect(getTimestampsFrom(startingDate, 1)).toStrictEqual([
        1706659200000,
        startingTimestamp,
      ]);

      expect(getTimestampsFrom(startingDate, 7)).toStrictEqual([
        1706140800000,
        1706227200000,
        1706313600000,
        1706400000000,
        1706486400000,
        1706572800000,
        1706659200000,
        startingTimestamp,
      ]);
    });
  });
});
