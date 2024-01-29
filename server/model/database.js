// Package Install
import { pool } from "./poolDB.js";

export async function createProduct(
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
) {
  let result = await pool.query(
    `insert into product(title, category, description, price, texture, wash, place, note, story, main_image) values(?,?,?,?,?,?,?,?,?,?);`,
    [
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
    ]
  );
  return result;
}

export async function createProductVariant(
  product_id,
  color_code,
  size,
  stock
) {
  await pool.query(
    `insert into product_variant(product_id, color_code, size, stock) values(?,?,?,?)`,
    [product_id, color_code, size, stock]
  );
}

export async function createColorCode(color_code, color_name) {
  let result = await pool.query(
    `insert ignore into color(code, name) values(?,?)`,
    [color_code, color_name]
  );
}

export async function createImage(arrayofImage) {
  let result = await pool.query(
    `insert into image(product_id, images) values ?`,
    [arrayofImage]
  );
}

export async function createMainImage(main_image, id) {
  let result = await pool.query(`update product set main_image=? where id=?;`, [
    main_image,
    id,
  ]);
}

//category
export async function getProductbyCategory(category, firstItem) {
  let [rows, fields] = await pool.query(
    `select * from product where category = ? limit ? , 6`,
    [category, firstItem]
  );
  return rows;
}

export async function getVariantbyCategory(category, productIds) {
  let [rows, fields] = await pool.query(
    `select product_variant.* from product_variant left join product on product.id = product_variant.product_id where product.category=? and product.id in (?);`,
    [category, productIds]
  );
  return rows;
}

export async function getcolorbyCategory(category, productIds) {
  let [rows, fields] = await pool.query(
    `select color.*, product_variant.product_id from color left join product_variant on color.code = product_variant.color_code left join product on product.id = product_variant.product_id where product.category=? and product.id in (?);`,
    [category, productIds]
  );
  return rows;
}

export async function getImagesbyCategory(category, productIds) {
  let [rows, fields] = await pool.query(
    `select image.* from image left join product on product.id = image.product_id where product.category=? and product.id in (?);`,
    [category, productIds]
  );
  return rows;
}

//category
export async function getProduct(firstItem) {
  let [rows, fields] = await pool.query(`select * from product limit ? , 6`, [
    firstItem,
  ]);
  return rows;
}

export async function getVariant(productIds) {
  let [rows, fields] = await pool.query(
    `select * from product_variant where product_id in (?)`,
    [productIds]
  );
  return rows;
}

export async function getcolor(productIds) {
  let [rows, fields] = await pool.query(
    `select c.*, v.product_id from color c left join product_variant v on c.code = v.color_code where v.product_id in (?);`,
    [productIds]
  );
  return rows;
}

export async function getImages(productIds) {
  let [rows, fields] = await pool.query(
    `select * from image where product_id in (?)`,
    [productIds]
  );
  return rows;
}

export async function countCategory(category) {
  let [rows, fields] = await pool.query(
    `select count(*) as countID from product where category = ?`,
    [category]
  );
  return rows;
}

export async function countAll() {
  let [rows, fields] = await pool.query(
    `select count(*) as countID from product `
  );
  return rows;
}

//keyword
export async function getProductbyKeyword(keyword, firstItem) {
  let [rows, fields] = await pool.query(
    `select * from product where title like ? limit ? , 6`,
    [keyword, firstItem]
  );
  return rows;
}

export async function getVariantbyId(productIds) {
  let [rows, fields] = await pool.query(
    `select * from product_variant where product_id in (?);`,
    [productIds]
  );
  return rows;
}

export async function getcolorbyVariant(productIds) {
  let [rows, fields] = await pool.query(
    ` select c.*, v.product_id from color c left join product_variant v on c.code = v.color_code  where product_id in (?);`,
    [productIds]
  );
  return rows;
}

export async function getImagesbyId(productIds) {
  let [rows, fields] = await pool.query(
    `select * from image where product_id in (?);`,
    [productIds]
  );
  return rows;
}

export async function countKeyword(keyword) {
  let [rows, fields] = await pool.query(
    `select count(*) as countID from product where title like ?`,
    [keyword]
  );
  return rows;
}

//id
export async function getProductbyId(product_id) {
  let [rows, fields] = await pool.query(`select * from product where id = ?`, [
    product_id,
  ]);
  return rows;
}

export async function getVariantbyoneId(product_id) {
  let [rows, fields] = await pool.query(
    `select * from product_variant where product_id = ?;`,
    [product_id]
  );
  return rows;
}

export async function getcolorbyoneVariant(product_id) {
  let [rows, fields] = await pool.query(
    ` select c.*, v.product_id from color c left join product_variant v on c.code = v.color_code  where product_id = ?;`,
    [product_id]
  );
  return rows;
}

export async function getImagesbyoneId(product_id) {
  let [rows, fields] = await pool.query(
    `select * from image where product_id = ?;`,
    [product_id]
  );
  return rows;
}

// campaign
export async function createCamInfo(product_id, story) {
  let result = await pool.query(
    `insert into campaigns(product_id, story) values(?,?)`,
    [product_id, story]
  );
  return result;
}

export async function createCamImage(main_image, campaign_id) {
  let result = await pool.query(
    `update campaigns set image=? where campaign_id=?;`,
    [main_image, campaign_id]
  );
  return result;
}

export async function getCampaign() {
  let [rows, fields] = await pool.query(`select * from campaigns`);
  return rows;
}

// order total
export async function getOrderTotal() {
  let [rows, fields] = await pool.query(
    `select user_id, total from order_total`
  );
  return rows;
}
