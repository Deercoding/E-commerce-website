import { it, expect, describe, vi, beforeAll } from "vitest";
import { getProdustSearchDatas } from "../controller/apiProduct.js";
import * as databaseModule from "../model/database.js";

vi.mock("../model/database.js", () => ({
  getProductbyKeyword: vi.fn(() => Promise.resolve([{ id: 1 }, { id: 2 }])),
  getVariantbyId: vi.fn(),
  getcolorbyVariant: vi.fn(),
  getImagesbyId: vi.fn(),
}));

describe("/api/product controller", () => {
  it("should return Produst Datas when searching", async () => {
    const keywordParam = "洋裝";
    const firstItem = 0;

    const result = await getProdustSearchDatas(keywordParam, firstItem);

    expect(databaseModule.getProductbyKeyword).toBeCalled();
    expect(databaseModule.getVariantbyId).toBeCalled();
    expect(databaseModule.getcolorbyVariant).toBeCalled();
    expect(databaseModule.getImagesbyId).toBeCalled();

    expect(result).toHaveProperty("productTable");
    expect(result).toHaveProperty("productIds");
    expect(result).toHaveProperty("variantTable");
    expect(result).toHaveProperty("colorTable");
    expect(result).toHaveProperty("imageTable");
  });
});
