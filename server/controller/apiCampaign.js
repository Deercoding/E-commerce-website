import "dotenv/config";

export async function prepareCampaigns(campaignTable) {
  const campaigns = [];
  campaignTable.forEach(async (cam) => {
    let camPath = null;
    if (cam.image) {
      camPath = process.env.cloudfronturl + cam.image;
    }
    const OneCampaign = {
      product_id: cam.product_id,
      picture: camPath,
      story: cam.story,
    };
    campaigns.push(OneCampaign);
  });
  return campaigns;
}
