import express from "express";

import {
  countKeyword,
  getProductbyId,
  getCampaign,
  getOrderTotal,
} from "../model/database.js";
import { groupById } from "../controller/apiReport.js";
import {
  cleanProductArray,
  cleanOneProduct,
  getProdustSearchDatas,
  getProdustDetailDatas,
  getProdustCategoryDatas,
  checkEnoughPageCategory,
} from "../controller/apiProduct.js";
import { redisClient } from "../model/redis.js";
import { ratelimiter } from "../middleware/rateLimiter.js";
import { prepareCampaigns } from "../controller/apiCampaign.js";

const router = express.Router();
router.use(ratelimiter);

router.get("/2.0/report/payments", async (req, res) => {
  try {
    if (redisClient.isReady) {
      const orderTotal = await getOrderTotal();
      await redisClient.lPush("orderTotal", JSON.stringify(orderTotal));
      res.status(200).json("Your payment report is preparing.");
    } else {
      res.redirect("/api/1.0/report/payments");
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

router.get("/1.0/report/payments", async (req, res) => {
  try {
    const orderTotal = await getOrderTotal();
    const totalGroupbyId = groupById(orderTotal);
    const userIds = 6;
    const result = {};
    result.data = [];
    for (let i = 1; i < userIds; i += 1) {
      const total = totalGroupbyId[i];
      result.data.push({ user_id: i, total });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

router.get("/1.0/marketing/campaigns", async (req, res) => {
  try {
    if (redisClient.isReady) {
      const redisDefualtExpriation = 3600;
      const redisCampaigns = await redisClient.get("campaigns");

      if (redisCampaigns != null) {
        return res.status(200).json(JSON.parse(redisCampaigns));
      }

      const campaignTable = await getCampaign();
      const campaigns = await prepareCampaigns(campaignTable);

      redisClient.setEx(
        "campaigns",
        redisDefualtExpriation,
        JSON.stringify(campaigns)
      );
      return res.status(200).json(campaigns);
    }
    const campaignTable = await getCampaign();
    const campaigns = await prepareCampaigns(campaignTable);
    await redisClient.connect();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

router.get("/1.0/products/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    const keywordParam = `%${keyword}%`;
    const paging = Number(req.query.paging) || 0;
    const firstItem = paging * 6;

    const countRows = await countKeyword(keywordParam);
    if (countRows[0].countID === 0) {
      return res.status(400).send({
        message: "Error: cannot find keyword.",
      });
    }
    const totalRows = countRows[0].countID;
    if (firstItem >= totalRows) {
      return res.status(400).send({
        message: "Error: Not enough pages to display.",
      });
    }

    const { productTable, productIds, variantTable, colorTable, imageTable } =
      await getProdustSearchDatas(keywordParam, firstItem);

    const returnProducts = await cleanProductArray(
      productIds,
      productTable,
      imageTable,
      variantTable,
      colorTable
    );

    if (firstItem + 7 < totalRows) {
      returnProducts.next_paging = paging + 1;
      res.status(200).json(returnProducts);
    } else {
      res.status(200).json(returnProducts);
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

router.get("/1.0/products/details", async (req, res) => {
  try {
    const { id } = req.query;

    let productTable = null;
    if (Number(id)) {
      productTable = await getProductbyId(id);
      if (productTable.length === 0) {
        return res.status(400).send({
          message: "Error: Please enter valid ID.",
        });
      }
    }

    const { productId, variantTable, colorTable, imageTable } =
      await getProdustDetailDatas(productTable);

    const oneProduct = await cleanOneProduct(
      productId,
      productTable,
      imageTable,
      variantTable,
      colorTable
    );

    res.status(200).json(oneProduct);
  } catch (error) {
    res.status(500).send(`Server Error`);
    console.error(error);
  }
});

router.get("/1.0/products/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const paging = Number(req.query.paging) || 0;
    const firstItem = paging * 6;
    const result = await checkEnoughPageCategory(firstItem, category);

    if (result.status == 400) {
      return res.status(400).json(result.message);
    }

    const { productIds, productTable, imageTable, variantTable, colorTable } =
      await getProdustCategoryDatas(category, firstItem);

    const returnProducts = await cleanProductArray(
      productIds,
      productTable,
      imageTable,
      variantTable,
      colorTable
    );

    if (firstItem + 7 < result.totalRows) {
      returnProducts.next_paging = paging + 1;
      res.status(200).json(returnProducts);
    } else {
      res.status(200).json(returnProducts);
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

export default router;
