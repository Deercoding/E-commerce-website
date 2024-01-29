import { it, expect, describe } from "vitest";
import { prepareCampaigns } from "../controller/apiCampaign";

describe("/api/campaigns controller", () => {
  it("should return campaign result", async () => {
    const input = [
      {
        campaign_id: 53,
        product_id: 27,
        story: "A story about our campaign ",
        image: "campaign.png_1698138800364.png",
      },
      {
        campaign_id: 54,
        product_id: 40,
        story: "美麗洋裝",
        image: "campaign.png_1698138961274.png_1706517691120.png",
      },
    ];

    const result = await prepareCampaigns(input);

    expect(result).toEqual([
      {
        product_id: 27,
        picture: `${process.env.cloudfronturl}campaign.png_1698138800364.png`,
        story: "A story about our campaign ",
      },
      {
        product_id: 40,
        picture: `${process.env.cloudfronturl}campaign.png_1698138961274.png_1706517691120.png`,
        story: "美麗洋裝",
      },
    ]);
  });
});
