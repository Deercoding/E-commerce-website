import "dotenv/config";
import {
  getImagesbyId,
  getProductbyKeyword,
  getVariantbyId,
  getcolorbyVariant,
  getVariantbyoneId,
  getcolorbyoneVariant,
  getImagesbyoneId,
  getProductbyCategory,
  getVariantbyCategory,
  getcolorbyCategory,
  getImagesbyCategory,
  getProduct,
  getVariant,
  getcolor,
  getImages,
  countAll,
  countCategory,
} from "../model/database.js";

export async function getProdustSearchDatas(keywordParam, firstItem) {
  const productTable = await getProductbyKeyword(keywordParam, firstItem);
  const productIds = productTable.map((ele) => ele.id);
  const variantTable = await getVariantbyId(productIds);
  const colorTable = await getcolorbyVariant(productIds);
  const imageTable = await getImagesbyId(productIds);
  return { productTable, productIds, variantTable, colorTable, imageTable };
}

export async function getProdustDetailDatas(productTable) {
  const productId = productTable.map((ele) => ele.id);
  const variantTable = await getVariantbyoneId(productId);
  const colorTable = await getcolorbyoneVariant(productId);
  const imageTable = await getImagesbyoneId(productId);
  return { productId, variantTable, colorTable, imageTable };
}

export async function getProdustCategoryDatas(category, firstItem) {
  let productTable = [];
  let variantTable = [];
  let colorTable = [];
  let imageTable = [];
  let productIds = [];

  if (category === "all") {
    productTable = await getProduct(firstItem);
    productIds = productTable.map((ele) => ele.id);
    variantTable = await getVariant(productIds);
    colorTable = await getcolor(productIds);
    imageTable = await getImages(productIds);
  } else {
    productTable = await getProductbyCategory(category, firstItem);
    productIds = productTable.map((ele) => ele.id);
    variantTable = await getVariantbyCategory(category, productIds);
    colorTable = await getcolorbyCategory(category, productIds);
    imageTable = await getImagesbyCategory(category, productIds);
  }

  return { productIds, productTable, imageTable, variantTable, colorTable };
}

export async function checkEnoughPageCategory(firstItem, category) {
  let countRows = [];
  let totalRows = 0;

  if (category === "all") {
    countRows = await countAll();
    totalRows = countRows[0].countID;

    if (firstItem >= totalRows) {
      return {
        status: 400,
        message: "Error: Not enough pages to display.",
      };
    }

    return {
      totalRows: totalRows,
      status: 200,
      message: "Enough Page to display.",
    };
  } else {
    countRows = await countCategory(category);
    totalRows = countRows[0].countID;
    if (firstItem >= totalRows) {
      return {
        status: 400,
        message: "Error: Not enough pages to display.",
      };
    }
    return {
      totalRows: totalRows,
      status: 200,
      message: "Enough Page to display.",
    };
  }
}

export async function cleanOneProduct(
  id,
  productTable,
  imageTable,
  variantTable,
  colorTable
) {
  imageTable = imageTable
    .filter((ele) => ele.product_id == id)
    .filter((ele) => ele != null);

  let imagebyProduct = [];
  for (let i = 0; i < imageTable.length; i++) {
    let oneImage = process.env.cloudfronturl + imageTable[i].images;
    imagebyProduct.push(oneImage);
  }

  let sizeByProduct = [];
  variantTable
    .filter((ele) => ele.product_id == id)
    .forEach((v) => {
      if (!sizeByProduct.includes(v.size)) {
        sizeByProduct.push(v.size);
      }
    });

  let productbyProduct = productTable.slice().filter((ele) => ele.id == id)[0];

  let mainImagePath = null;
  if (productbyProduct.main_image) {
    mainImagePath = process.env.cloudfronturl + productbyProduct.main_image;
  }

  let variantbyProduct = variantTable
    .filter((ele) => ele.product_id == id)
    .map(({ variant_id, product_id, ...rest }) => rest);

  let colorbyProduct = colorTable
    .filter((ele) => ele.product_id == id)
    .map(({ product_id, ...rest }) => rest);

  const oneProduct = {
    id: productbyProduct.id,
    category: productbyProduct.category,
    title: productbyProduct.title,
    description: productbyProduct.description,
    price: productbyProduct.price,
    texture: productbyProduct.texture,
    wash: productbyProduct.wash,
    place: productbyProduct.place,
    note: productbyProduct.note,
    story: productbyProduct.story,
    colors: colorbyProduct,
    sizes: sizeByProduct,
    variants: variantbyProduct,
    main_image: mainImagePath,
    Images: imagebyProduct,
  };

  return oneProduct;
}

export async function cleanProductArray(
  productId,
  productTable,
  imageTable,
  variantTable,
  colorTable
) {
  let returnProducts = { data: [] };

  for (let i = 0; i < productId.length; i++) {
    let oneProduct = await cleanOneProduct(
      productId[i],
      productTable,
      imageTable,
      variantTable,
      colorTable
    );
    returnProducts.data.push(oneProduct);
  }

  return returnProducts;
}
