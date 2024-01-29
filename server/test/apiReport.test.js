import { it, expect, describe } from "vitest";
import { groupById } from "../controller/apiReport.js";

describe("/api/report controller", () => {
  it("should return groupby sum", () => {
    const input = [
      { user_id: 1, total: 561 },
      { user_id: 1, total: 459 },
      { user_id: 2, total: 996 },
    ];

    const result = groupById(input);

    expect(result).toEqual({
      1: 1020,
      2: 996,
    });
  });
});
