import { pool } from "./poolDB.js";

export async function createRole(user_id) {
  await pool.query(`insert into user_admin(user_id) values(?)`, [
    user_id,
  ]);
}

export async function getRole(user_id) {
  let [rows, fields] = await pool.query(
    `select * from user_admin where user_id = ? `,
    [user_id]
  );
  return rows;
}
