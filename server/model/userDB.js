// Package Install
import { pool } from "./poolDB.js";

export async function createUser(name, email, password) {
  let result = await pool.query(
    `insert into user(name, email, password) values(?,?,?);`,
    [name, email, password]
  );
  return result;
}

export async function checkUser(email) {
  let [rows, fields] = await pool.query(`select * from user where email = ?;`, [
    email,
  ]);
  return rows;
}

export async function checkFbId(third_party_id) {
  let [rows, fields] = await pool.query(
    `select * from user where third_party_id= ?;`,
    [third_party_id]
  );
  return rows;
}

export async function createFbUser(
  name,
  email,
  password,
  third_party_id,
  picture
) {
  let result = await pool.query(
    `insert into user(name, email, password, third_party_id, picture) values(?,?,?, ?, ?);`,
    [name, email, password, third_party_id, picture]
  );
  return result;
}

export async function updateFbUser(
  name,
  email,
  password,
  third_party_id,
  picture
) {
  let result = await pool.query(
    `UPDATE user set name = ?, email = ?, password =?, third_party_id =?, picture =? where third_party_id = ?`,
    [name, email, password, third_party_id, picture, third_party_id]
  );
  return result;
}
