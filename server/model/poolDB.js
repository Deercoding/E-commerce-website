// Package Install
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    database: "stylish",
    password: process.env.SQLPASSWORD,
  })
  .promise();

export { pool };
