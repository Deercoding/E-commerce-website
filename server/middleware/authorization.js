import jwt from "jsonwebtoken";
import { getRole } from "../model/adminDB.js";

export const isAdmin = async function (req, res, next) {
  if (!req.signedCookies.token) {
    return res.status(403).json("Client Error (No token) ");
  }
  let jwtResult;
  try {
    const mytoken = req.signedCookies.token.data.access_token;
    jwtResult = jwt.verify(mytoken, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json("Client Error (Wrong token)");
  }

  let userRole;
  try {
    userRole = await getRole(jwtResult.userId);
  } catch (err) {
    return res.status(403).json("User role Error");
  }

  if (userRole[0].user_role == "admin") {
    next();
  } else {
    res.status(403).send("You are not authorized to this page.");
  }
};
