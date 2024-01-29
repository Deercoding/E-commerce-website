import { pool } from "./poolDB.js";

export async function getConnection() {
  const conn = await pool.getConnection();
  return conn;
}

export async function beginSQL(connection) {
  let result = await connection.query(`begin;`);
  return result;
}

export async function commitSQL(connection) {
  let result = await connection.query(`commit;`);
  return result;
}

export async function rollbackSQL(connection) {
  let result = await connection.query(`rollback;`);
  return result;
}

export async function releaseConnection(connection) {
  let result = await connection.release();
  return result;
}

export async function checkOrderProduct(productColorSizes, connection) {
  let [rows, fields] = await connection.query(
    `select * from product_variant where concat(product_id,color_code, size) in (?);`,
    [productColorSizes]
  );
  return rows;
}

export async function lockStock(variants, connection) {
  let [rows, fields] = await connection.query(
    `select stock from product_variant where variant_id in (?) for update;`,
    [variants]
  );
  return rows;
}

export async function addUnpaidOrder(connection) {
  let result = await connection.query(
    `insert into order_payment (order_status) value ("unpaid") ;`
  );
  return result[0].insertId;
}

export async function updateTransaction(
  order_status,
  trans_status,
  trans_msg,
  trans_amount,
  trans_acquire,
  trans_currency,
  trans_rec_trade_id,
  trans_bank_transaction_id,
  trans_auth_codem,
  order_number,
  connection
) {
  let result = await connection.query(
    `update order_payment set order_status = ?, trans_status =  ?, trans_msg = ?, trans_amount = ?, trans_acquire = ?, trans_currency = ?, trans_rec_trade_id = ?, trans_bank_transaction_id = ?, trans_auth_code = ? where order_number = ? ;`,
    [
      order_status,
      trans_status,
      trans_msg,
      trans_amount,
      trans_acquire,
      trans_currency,
      trans_rec_trade_id,
      trans_bank_transaction_id,
      trans_auth_codem,
      order_number,
    ]
  );
  return result;
}

export async function updateErrTransaction(
  order_status,
  trans_status,
  trans_msg,
  trans_rec_trade_id,
  trans_bank_result_code,
  trans_bank_result_msg,
  order_number,
  connection
) {
  let result = await connection.query(
    `update order_payment set order_status = ?, trans_status =  ?, trans_msg = ?, trans_rec_trade_id = ?, trans_bank_result_code = ?, trans_bank_result_msg = ? where order_number = ? ;`,
    [
      order_status,
      trans_status,
      trans_msg,
      trans_rec_trade_id,
      trans_bank_result_code,
      trans_bank_result_msg,
      order_number,
    ]
  );
  return result;
}

export async function updateStock(order_qty, productColorSizes, connection) {
  let result = await connection.query(
    `update product_variant set stock = stock - ? where variant_id = ? ;`,
    [order_qty, productColorSizes]
  );
  return result;
}

export async function checkLock(connection) {
  let result = await connection.query(
    "select * from performance_schema.data_locks;"
  );
  return result;
}
