import express from "express";
const router = express.Router();
import path from "path";
import url from "url";
import cookieParser from "cookie-parser";

import { imageUpload } from "../middleware/multer.js";
import { redisClient } from "../model/redis.js";
import { uploadObject } from "../utils/awsS3.js";
import {
  createProduct,
  createProductVariant,
  createColorCode,
  createImage,
  createMainImage,
  createCamImage,
  createCamInfo,
} from "../model/database.js";
import {
  campaignValidation,
  productUpdateValidation,
} from "../utils/dbValidation.js";

import { isAdmin } from "../middleware/authorization.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cookieParser("signbyAdmin"));
router.use(isAdmin);

router.get("/product", (req, res) => {
  res.render("product.ejs");
});
router.get("/campaigns", (req, res) => {
  res.render("campaign.ejs");
});
router.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});

router.post(
  "/campaigns",
  imageUpload.array("picture", 12),
  async (req, res, next) => {
    try {
      const { error } = campaignValidation(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      if (req.files.length == 0) {
        return res.status(400).send("Error : Please input campaign picture.");
      }
      const { product_id, story } = req.body;
      if (story.trim().length == 0) {
        return res.status(400).send("Error : Please do not send empty story.");
      }

      let toFolder = __dirname;
      uploadObject("stylishdeercode", req.files, "ap-southeast-1", toFolder);
      let result = await createCamInfo(product_id, story);
      let campaignResult = JSON.parse(JSON.stringify(result[0]));
      let campaignId = campaignResult.insertId;
      await createCamImage(req.files[0].filename, campaignId);

      if (redisClient.isReady) {
        redisClient.del("campaigns");
      }
      res.status(200).json("Success create campaign.");
    } catch (error) {
      res.status(500).send("Server Error");
      console.error(error);
    }
  }
);

router.post(
  "/product",
  imageUpload.array("file", 12),
  async function (req, res, next) {
    const { error } = productUpdateValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    if (req.files.length == 1) {
      return res.status(400).send("Please Input images.");
    }

    try {
      let {
        title,
        category,
        description,
        price,
        texture,
        wash,
        place,
        note,
        story,
        main_image,
      } = req.body;
      let ProductResult = await createProduct(
        title,
        category,
        description,
        price,
        texture,
        wash,
        place,
        note,
        story,
        main_image
      );
      let productResult = JSON.parse(JSON.stringify(ProductResult[0]));
      let product_id = productResult.insertId;
      let {
        color_code,
        color_name,
        size,
        stock,
        color_code2,
        color_name2,
        size2,
        stock2,
        color_code3,
        color_name3,
        size3,
        stock3,
      } = req.body;

      const productVariants = [
        { color_code, size, stock, color_name },
        {
          color_code: color_code2,
          size: size2,
          stock: stock2,
          color_name: color_name2,
        },
        {
          color_code: color_code3,
          size: size3,
          stock: stock3,
          color_name: color_name3,
        },
      ];

      for (const variant of productVariants) {
        Object.keys(variant).forEach((k) => (variant[k] = variant[k].trim()));
        console.log(variant.color_code.length);
        if (
          variant.color_code.length > 0 &&
          variant.size.length > 0 &&
          variant.stock.length > 0
        ) {
          await createProductVariant(
            product_id,
            variant.color_code,
            variant.size,
            variant.stock
          );
          await createColorCode(variant.color_code, variant.color_name);
        }
      }

      let imageSend = [];
      let imageQuery = [];
      await createMainImage(req.files[0].filename, product_id);
      for (let i = 1; i < req.files.length; i++) {
        let imageName = req.files[i].filename;
        imageSend.push(imageName);
        imageQuery.push([product_id, imageName]);
      }
      await createImage(imageQuery);
      let toFolder = __dirname;
      uploadObject("stylishdeercode", req.files, "ap-southeast-1", toFolder);

      const color = productVariants.map(({ size, stock, ...rest }) => rest);
      const variant = productVariants.map(({ color_name, ...rest }) => rest);
      const sizes = productVariants
        .map(({ size }) => size)
        .filter((value, index, self) => self.indexOf(value) === index);

      const oneProduct = {
        id: product_id,
        category: category,
        title: title,
        description: description,
        price: price,
        texture: texture,
        wash: wash,
        place: place,
        note: note,
        story: story,
        colors: color,
        sizes: sizes,
        variants: variant,
        main_image: req.files[0].originalname,
        Image: imageSend,
      };
      res.status(200).json(oneProduct);
    } catch (error) {
      res.status(500).send("Server Error");
      console.error(error);
    }
  }
);

export default router;
